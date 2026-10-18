import { prisma } from '@/lib/prisma';
import { safeUrl } from '@/lib/safe-url';

// The restricted (honeypot) page is fully DB-backed: one JSON document under
// this siteDetail key, edited from /admin/restricted. DEFAULT_RESTRICTED is
// both the seed and the crash fallback so the honeypot never goes dark.
export const RESTRICTED_KEY = 'restricted_content';

export const DEFAULT_RESTRICTED = {
  title: 'You found the back door',
  subtitle:
    'This page is a honeypot. You reached it by typing an admin address you were not meant to use. Nothing here is a real login. It is also my security portfolio.',
  logNote:
    'A real deployment records details like these on the server and checks them against an allowlist. Nobody is asked to type a password here.',
  about:
    'I am Zaidan, an Information Technology student in Indonesia. I started cyber security in my 5th semester. My level is fundamentals. I am listing what I have actually studied and tried, nothing more.',
  knowBullets: [
    'OSI model layers and where common attacks sit in them.',
    'Malware types and how they spread.',
    'White, grey and black hat hackers, and red team versus blue team roles.',
    'Web attacks: SQL injection, XSS, DoS and DDoS.',
    'Google hacking database queries for finding exposed information.',
    'OWASP Top 10 and the basics of SIEM monitoring.',
    'SIEM & Log Analysis: Writing custom SPL (Splunk Search Processing Language) queries for real-time security event monitoring.',
    'Endpoint & Network Telemetry: Configuring Sysmon schemas for Process Creation (Event ID 1) and Network Connections (Event ID 3).',
    'Alert Triage & Tuning: Identifying and filtering false positives (system noise and loopback traffic) to highlight true positive threats.',
  ],
  tools: [
    { name: 'Splunk Enterprise', use: 'SIEM log ingestion, SPL query creation, & SOC dashboarding', level: 'practical' },
    { name: 'Sysmon', use: 'Windows endpoint telemetry & event filtering (Event ID 1 & 3)', level: 'practical' },
    { name: 'Nmap', use: 'Network reconnaissance & port scanning simulation', level: 'practical' },
    { name: 'Burp Suite', use: 'Intercepting & editing web requests', level: 'basic' },
    { name: 'Wireshark', use: 'Reading captured network traffic', level: 'basic' },
  ],
  certsIntro: 'Basic cyber security certificates. Click an image to open the full size.',
  certs: [
    {
      imageUrl: 'https://res.cloudinary.com/uzew4w12/image/upload/v1792316825/restricted_cert_1.png',
      imageAlt: 'Introduction to Information Security certificate',
      caption: 'Introduction to Information Security',
      issuer: 'Cyber Academy, 2026',
    },
    {
      imageUrl: 'https://res.cloudinary.com/uzew4w12/image/upload/v1792316828/restricted_cert_2.png',
      imageAlt: 'Classical Cryptography for Beginner certificate',
      caption: 'Classical Cryptography for Beginner',
      issuer: 'Cyber Academy, 2026',
    },
  ],
  lab: {
    status: 'completed',
    title: 'SOC Lab: End-to-End Threat Detection & SIEM Monitoring',
    architecture: 'VirtualBox multi-VM environment.',
    redTeam: 'Kali Linux VM executing network reconnaissance (nmap port scans & curl HTTP requests).',
    blueTeam: 'Windows Host running Sysmon for endpoint telemetry, ingesting logs into Splunk Enterprise.',
    achievements: [
      'Built interactive SOC dashboards tracking Event ID 1 (suspicious host recon like whoami, net user, systeminfo) and Event ID 3 (network traffic spikes & targeted ports).',
      'Custom SPL logic to filter system loopback noise so true positives stand out.',
    ],
    screenshotUrl: '',
    screenshotAlt: 'Splunk SOC dashboard screenshot',
  },
  defenseBullets: [
    'Admin routes check the visitor against my trusted devices.',
    'Anyone else is sent to this page instead of an error.',
    'Failed attempts are logged: time, path, IP address, browser.',
    'This page is excluded from search engines and asks for no input.',
  ],
  contactLead:
    'If you are a recruiter or a security person and you found this on purpose, say hello:',
  contactEmail: 'contact@zaidanghiffari.my.id',
  footer: 'Zaidan Ghiffari Azhar. Ethical use only. No visitor data is shown to anyone on this page.',
};

// --- sanitization -----------------------------------------------------------

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
// null = "field absent" (callers fall back to defaults); array = admin's list,
// even when intentionally emptied.
const strListOrNull = (value, maxItems, maxLen) =>
  Array.isArray(value)
    ? value.map((v) => str(v, maxLen)).filter(Boolean).slice(0, maxItems)
    : null;

function cleanUrl(value) {
  const s = str(value, 2000);
  if (!s) return '';
  return safeUrl(s) || '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Builds a well-typed document from anything (DB JSON, admin payload), keeping
// only known fields with sane caps — unknown keys are dropped, never rendered.
export function sanitizeRestrictedDoc(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const lab = src.lab && typeof src.lab === 'object' ? src.lab : {};
  const d = DEFAULT_RESTRICTED;

  const email = str(src.contactEmail, 160);
  const status = lab.status === 'completed' ? 'completed' : d.lab.status;

  const tools = Array.isArray(src.tools)
    ? src.tools
        .filter((t) => t && typeof t === 'object')
        .map((t) => ({
          name: str(t.name, 120),
          use: str(t.use, 300),
          level: t.level === 'practical' ? 'practical' : 'basic',
        }))
        .filter((t) => t.name && t.use)
        .slice(0, 20)
    : d.tools;

  const certs = Array.isArray(src.certs)
    ? src.certs
        .filter((c) => c && typeof c === 'object')
        .map((c) => ({
          imageUrl: cleanUrl(c.imageUrl),
          imageAlt: str(c.imageAlt, 300),
          caption: str(c.caption, 200),
          issuer: str(c.issuer, 200),
        }))
        .filter((c) => c.caption || c.imageUrl)
        .slice(0, 10)
    : d.certs;

  return {
    title: str(src.title, 200) || d.title,
    subtitle: str(src.subtitle, 1000) || d.subtitle,
    logNote: str(src.logNote, 1000) || d.logNote,
    about: str(src.about, 5000) || d.about,
    knowBullets: strListOrNull(src.knowBullets, 30, 500) ?? d.knowBullets,
    tools,
    certsIntro: str(src.certsIntro, 500) || d.certsIntro,
    certs,
    lab: {
      status,
      title: str(lab.title, 300) || d.lab.title,
      architecture: str(lab.architecture, 500),
      redTeam: str(lab.redTeam, 1000),
      blueTeam: str(lab.blueTeam, 1000),
      achievements: strListOrNull(lab.achievements, 15, 500) ?? d.lab.achievements,
      screenshotUrl: cleanUrl(lab.screenshotUrl),
      screenshotAlt: str(lab.screenshotAlt, 300) || d.lab.screenshotAlt,
    },
    defenseBullets: strListOrNull(src.defenseBullets, 20, 500) ?? d.defenseBullets,
    contactLead: str(src.contactLead, 500) || d.contactLead,
    contactEmail: EMAIL_RE.test(email) ? email : d.contactEmail,
    footer: str(src.footer, 500) || d.footer,
  };
}

export async function loadRestrictedDoc() {
  try {
    const row = await prisma.siteDetail.findUnique({ where: { key: RESTRICTED_KEY } });
    if (!row) return DEFAULT_RESTRICTED;
    return sanitizeRestrictedDoc(JSON.parse(row.value));
  } catch {
    // Missing row, bad JSON, or DB down: the honeypot still renders defaults.
    return DEFAULT_RESTRICTED;
  }
}

// --- rendering --------------------------------------------------------------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const levelTag = (level) =>
  level === 'practical'
    ? '<span class="tag ok">practical</span>'
    : '<span class="tag">basic</span>';

const liList = (items) => items.map((b) => `<li>${esc(b)}</li>`).join('');

export function renderRestrictedHtml(doc) {
  const d = sanitizeRestrictedDoc(doc);

  const toolsRows = d.tools
    .map(
      (t) =>
        `<tr><td>${esc(t.name)}</td><td>${esc(t.use)}</td><td>${levelTag(t.level)}</td></tr>`
    )
    .join('');

  const certFigures = d.certs
    .map(
      (c) => `      <figure class="cert">
        <a href="${esc(c.imageUrl)}" target="_blank" rel="noopener"><img src="${esc(c.imageUrl)}" alt="${esc(c.imageAlt || c.caption)}" width="800" height="600" hidden><div class="ph">Certificate image coming soon</div></a>
        <figcaption>${esc(c.caption)}<span>${esc(c.issuer)}</span></figcaption>
      </figure>`
    )
    .join('\n');

  const labStatusTag =
    d.lab.status === 'completed'
      ? '<span class="tag ok">completed</span>'
      : '<span class="tag wip">in progress</span>';

  const labLines = [
    d.lab.architecture && `<li><b>Architecture:</b> ${esc(d.lab.architecture)}</li>`,
    d.lab.redTeam && `<li><b>Red Team (Attacker):</b> ${esc(d.lab.redTeam)}</li>`,
    d.lab.blueTeam && `<li><b>Blue Team (SIEM):</b> ${esc(d.lab.blueTeam)}</li>`,
  ]
    .filter(Boolean)
    .join('');

  const labHtml = `
    <p>Status: ${labStatusTag}</p>
    <p><b>${esc(d.lab.title)}</b></p>
    ${labLines ? `<ul>${labLines}</ul>` : ''}
    ${d.lab.achievements.length ? `<p><b>Key Achievements</b></p><ul>${liList(d.lab.achievements)}</ul>` : ''}
    ${d.lab.screenshotUrl ? `<img class="lab-shot" src="${esc(d.lab.screenshotUrl)}" alt="${esc(d.lab.screenshotAlt)}" loading="lazy">` : ''}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Restricted Area | Zaidan Ghiffari Azhar</title>
<style>
:root{
  --bark:#0A0A0A; --board:#141414; --panel:#1A1A1A; --line:#262626;
  --text:#F5F5F5; --muted:#A3A3A3; --brass:#6366F1; --moss:#10B981; --rust:#EF4444;
}
.light{
  --bark:#FFFFFF; --board:#F9FAFB; --panel:#F3F4F6; --line:#E5E7EB;
  --text:#0A0A0A; --muted:#4B5563;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bark);color:var(--text);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px 16px 48px}
.wrap{max-width:820px;margin:0 auto}
[hidden]{display:none!important}
a{color:var(--brass)}
:focus-visible{outline:2px solid var(--brass);outline-offset:2px}
.crumbs{font-size:.85rem;color:var(--muted);margin-bottom:16px}
h1{font-size:1.9rem;line-height:1.25;margin-bottom:8px;color:var(--text)}
.sub{color:var(--muted);margin-bottom:28px;max-width:62ch}
.post{background:var(--board);border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-bottom:20px}
.post h2{font-size:1.05rem;font-weight:bold;background:var(--panel);border-bottom:1px solid var(--line);padding:10px 16px;color:var(--text)}
.body{padding:16px}
.body p+p,.body ul+p,.body p+ul{margin-top:10px}
.body li b{color:var(--text)}
.body li{color:var(--muted)}
ul{padding-left:20px}
li{margin-bottom:4px}
.tag{display:inline-block;font:.8rem/1 ui-monospace,Consolas,monospace;padding:4px 7px;border:1px solid var(--line);background:var(--bark);color:var(--muted);margin-left:6px}
.tag.ok{color:var(--moss);border-color:var(--moss)}
.tag.wip{color:var(--brass);border-color:var(--brass)}
table{width:100%;border-collapse:collapse;font-size:.95rem}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--muted);font-weight:normal}
.log{font:.85rem/1.6 ui-monospace,Consolas,monospace;background:var(--bark);border:1px solid var(--rust);border-radius:6px;padding:14px;color:var(--text);overflow-x:auto}
.log b{color:var(--rust);font-weight:normal}
.certs{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:12px}
.cert{margin:0;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--bark)}
.cert img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
.cert .ph{aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;font-size:.85rem;color:var(--muted);border-bottom:1px dashed var(--line)}
.cert figcaption{padding:8px 10px;font-size:.85rem}
.cert figcaption span{display:block;color:var(--muted)}
.lab-shot{display:block;width:100%;height:auto;margin-top:12px;border:1px solid var(--line);border-radius:6px}
footer{font-size:.85rem;color:var(--muted);margin-top:28px}
@media(max-width:520px){h1{font-size:1.5rem}body{font-size:16px}}
</style>
</head>
<body>
<div class="wrap">

<p class="crumbs">Board index / Restricted / Admin gate</p>
<h1>${esc(d.title)}</h1>
<p class="sub">${esc(d.subtitle)}</p>

<section class="post" aria-labelledby="seen">
  <h2 id="seen">What this request looked like</h2>
  <div class="body">
    <pre class="log" id="log">Loading request details...</pre>
    <p style="margin-top:10px;color:var(--muted)">${esc(d.logNote)}</p>
  </div>
</section>

<section class="post" aria-labelledby="about">
  <h2 id="about">About me</h2>
  <div class="body">
    <p>${esc(d.about)}</p>
  </div>
</section>

<section class="post" aria-labelledby="know">
  <h2 id="know">What I know</h2>
  <div class="body">
    <ul>
${liList(d.knowBullets)}
    </ul>
  </div>
</section>

<section class="post" aria-labelledby="tools">
  <h2 id="tools">Tools I have used</h2>
  <div class="body">
    <table>
      <tr><th>Tool</th><th>Use</th><th>Level</th></tr>
${toolsRows}
    </table>
  </div>
</section>

<section class="post" aria-labelledby="certs">
  <h2 id="certs">Certifications</h2>
  <div class="body">
    <p>${esc(d.certsIntro)}</p>
    <div class="certs">
${certFigures}
    </div>
  </div>
</section>

<section class="post" aria-labelledby="lab">
  <h2 id="lab">Practice lab</h2>
  <div class="body">${labHtml}
  </div>
</section>

<section class="post" aria-labelledby="defense">
  <h2 id="defense">How this site protects its admin area</h2>
  <div class="body">
    <ul>
${liList(d.defenseBullets)}
    </ul>
  </div>
</section>

<section class="post" aria-labelledby="contact">
  <h2 id="contact">Contact</h2>
  <div class="body">
    <p>${esc(d.contactLead)} <a href="mailto:${esc(d.contactEmail)}">${esc(d.contactEmail)}</a>. Back to the <a href="/">main portfolio</a>.</p>
  </div>
</section>

<footer>${esc(d.footer)}</footer>
</div>

<script src="/flag/restricted.js"></script>
</body>
</html>`;
}
