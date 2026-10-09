<#
  Smoke test for the portfolio site.

  Codifies the standard verification loop:
    lint → build → dev server → login → landing asserts → details PUT/restore → admin pages

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke.ps1
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\smoke.ps1 -SkipBuild   # quick re-run (dev must be warm)
    npm run smoke

  Notes:
  - One login per run; logins are rate-limited (10 / 15 min / IP) — a run that
    suddenly fails at "admin session" right after many runs is the limiter.
  - Detail test values are restored at the end (edu_1_image, social_discord_url).
#>
param(
  [int]$Port = 3001,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$origin = "http://localhost:$Port"
$tmp = Join-Path $env:TEMP 'opencode'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$jar = Join-Path $tmp 'smoke-cookies.txt'
$bodyFile = Join-Path $tmp 'smoke-body.json'
$htmlFile = Join-Path $tmp 'smoke-landing.html'
$script:failures = New-Object System.Collections.Generic.List[string]

function Assert([string]$name, [bool]$ok) {
  if ($ok) { Write-Host "  PASS  $name" }
  else { $script:failures.Add($name); Write-Host "  FAIL  $name" }
}

function Get-DevPid([int]$p) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($c) { return $c.OwningProcess }
  return $null
}

function Stop-Dev([int]$p) {
  $procId = Get-DevPid $p
  if ($procId) { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 2 }
}

function Start-Dev([int]$p) {
  Start-Process cmd -ArgumentList "/c", "npx next dev -p $p > .next\dev.log 2>&1" -WorkingDirectory $repo -WindowStyle Hidden
}

function Wait-Ready([string]$url, [int]$tries = 45) {
  for ($i = 0; $i -lt $tries; $i++) {
    try {
      $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
      if ($r.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Seconds 2
  }
  return $false
}

function Write-JsonBody($obj, [string]$path) {
  [System.IO.File]::WriteAllText($path, ($obj | ConvertTo-Json -Compress))
}

function Read-DotEnv([string]$path) {
  # KEY=value lines; values may be wrapped in quotes. PowerShell cannot
  # dot-source this file (KEY=value parses as a command), parse manually.
  Get-Content $path | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
      Set-Item -Path "env:$($Matches[1])" -Value ($Matches[2].Trim().Trim('"', "'"))
    }
  }
}

function Invoke-Landing {
  curl.exe -s -o $htmlFile "$origin/"
  return [System.IO.File]::ReadAllText($htmlFile)
}

function Put-Details([hashtable]$details, [int]$expectedStatus) {
  Write-JsonBody @{ details = $details } $bodyFile
  return curl.exe -s -o NUL -w '%{http_code}' -X PUT -b $jar `
    -H "Origin: $origin" -H 'Content-Type: application/json' -H 'X-Forwarded-For: 127.0.0.1' `
    --data "@$bodyFile" "$origin/api/admin/details"
}

Push-Location $repo
try {
  # 1. Lint ------------------------------------------------------------------
  Write-Host '[1/6] lint'
  npm run lint
  if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: eslint reported problems'; exit 1 }

  # 2. Build (kills dev first — .next is locked otherwise) --------------------
  if (-not $SkipBuild) {
    Write-Host '[2/6] build'
    Stop-Dev $Port
    npm run build
    if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: next build failed'; exit 1 }
  } else {
    Write-Host '[2/6] build skipped (-SkipBuild)'
  }

  # 3. Dev server ------------------------------------------------------------
  Write-Host "[3/6] dev server on :$Port"
  if (-not (Get-DevPid $Port)) { Start-Dev $Port }
  if (-not (Wait-Ready "$origin/api/details")) {
    Write-Host "FAIL: dev server not answering on $origin (see .next\dev.log)"; exit 1
  }

  # 4. Login -----------------------------------------------------------------
  Write-Host '[4/6] admin login'
  if (-not (Test-Path .\.env.local)) { Write-Host 'FAIL: .env.local missing'; exit 1 }
  Read-DotEnv .\.env.local
  if (-not $env:ADMIN_EMAIL -or -not $env:ADMIN_PASSWORD) { Write-Host 'FAIL: ADMIN_EMAIL/ADMIN_PASSWORD not set'; exit 1 }
  Remove-Item $jar -ErrorAction SilentlyContinue
  $csrf = ((curl.exe -s -c $jar -b $jar -H "Origin: $origin" "$origin/api/auth/csrf") | ConvertFrom-Json).csrfToken
  Write-JsonBody @{ email = $env:ADMIN_EMAIL; password = $env:ADMIN_PASSWORD; csrfToken = $csrf; callbackUrl = "$origin/admin"; json = 'true' } $bodyFile
  curl.exe -s -o NUL -b $jar -c $jar -H "Origin: $origin" -H 'Content-Type: application/json' `
    --data "@$bodyFile" "$origin/api/auth/callback/credentials"
  $session = curl.exe -s -b $jar "$origin/api/auth/session"
  Assert 'admin session established' ($session -match '"role":"ADMIN"')

  # 5. Landing ----------------------------------------------------------------
  Write-Host '[5/6] landing asserts'
  $html = Invoke-Landing
  Assert 'landing 200 with h1' ($html -match '<h1')
  Assert '5 reveal wrappers' (([regex]::Matches($html, 'class="reveal')).Count -eq 5)
  Assert 'project card glow present' ($html -match 'class="glow-hover"')
  Assert 'skill cell glow present' ($html -match 'skill-cell glow-hover')
  Assert 'no glow on experience timeline' ($html -notmatch 'titem glow-hover')
  Assert 'no glow on education rows' ($html -notmatch 'panel-item glow-hover')

  # 6. Details PUT/restore + admin pages -------------------------------------
  #    Never blind-restore: save the owner's current values first, put test
  #    markers in, then restore exactly what was there. Assert on the markers
  #    (owner data may legitimately contain edu thumbnails / socials).
  Write-Host '[6/6] details PUT cycle + admin pages'
  $restored = $false
  try {
    $current = (curl.exe -s -b $jar -H 'X-Forwarded-For: 127.0.0.1' "$origin/api/admin/details" | ConvertFrom-Json).details
    $origEdu = if ($current) { $current.edu_1_image } else { $null }
    $origSocial = if ($current) { $current.social_discord_url } else { $null }

    $put = Put-Details @{
      edu_1_image        = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      social_discord_url = 'https://discord.gg/smoke-test'
    } 200
    Assert 'details PUT 200' ($put -eq '200')
    if ($put -eq '200') {
      $html = Invoke-Landing
      Assert 'test edu image renders' ($html -match 'sample\.jpg')
      Assert 'test social link renders' ($html -match 'href="https://discord\.gg/smoke-test"')
    }
  } finally {
    $restore = Put-Details @{
      edu_1_image        = if ($null -ne $origEdu) { $origEdu } else { '' }
      social_discord_url = if ($null -ne $origSocial) { $origSocial } else { '' }
    } 200
    $restored = ($restore -eq '200')
  }
  Assert 'details restored to original values' $restored
  if ($restored) {
    $html = Invoke-Landing
    Assert 'test edu image cleaned up' ($html -notmatch 'sample\.jpg')
    Assert 'test social link cleaned up' ($html -notmatch 'discord\.gg/smoke-test')
  }

  $adminCode = curl.exe -s -o NUL -w '%{http_code}' -b $jar -H 'X-Forwarded-For: 127.0.0.1' "$origin/admin"
  Assert 'admin dashboard 200' ($adminCode -eq '200')
  $detailsCode = curl.exe -s -o NUL -w '%{http_code}' -b $jar -H 'X-Forwarded-For: 127.0.0.1' "$origin/admin/details"
  Assert 'admin details 200' ($detailsCode -eq '200')

  # Summary -------------------------------------------------------------------
  if ($script:failures.Count -eq 0) {
    Write-Host 'SMOKE PASS' -ForegroundColor Green
    exit 0
  }
  Write-Host "SMOKE FAIL ($($script:failures.Count)):" -ForegroundColor Red
  $script:failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  exit 1
} finally {
  Pop-Location
}
