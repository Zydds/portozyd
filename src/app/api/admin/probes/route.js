import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return null;
  return session;
}

// Read-time attack classification from logged evidence (path, UA, action).
// Display-only: enforcement is a uniform 302 regardless of kind.
const SCANNER_RE = /sqlmap|nikto|nmap|masscan|zgrab|nuclei|gobuster|feroxbuster|dirbuster|wpscan|acunetix|nessus|openvas|whatweb|arachni|xsstrike|commix|hydra|metasploit|burpsuite|zaproxy|httpx|scrapy/i;
const BOT_RE = /curl|wget|python|scrapy|libwww|go-http-client|java\/|axios|node-fetch|okhttp|bot|crawler|spider|slurp|scanner|headless|phantomjs|puppeteer|playwright/i;
const EXPLOIT_PATH_RE = /\.\.|%2e|\.env|\.git|wp-admin|wp-login|phpmyadmin|\.sql|\bbackup\b|etc\/passwd|id_rsa|\.aws|actuator|phpinfo|config\.php|shell|admin\.php|wp-content|vendor\/|\.bak|union\s*select|information_schema|\bsleep\s*\(|\bbenchmark\s*\(|\bor\b\s*1\s*=\s*1|<script|javascript:/i;

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function classifyProbe(row) {
  if (row.action === 'origin') return 'CSRF';
  // Decode first (%2e%2e, union%20select); NextURL may serialize spaces as
  // '+', so treat '+' as space before matching payloads.
  const target = safeDecode(row.path || '').replace(/\+/g, ' ');
  if (EXPLOIT_PATH_RE.test(target)) return 'EXPLOIT';
  const ua = row.userAgent || '';
  if (!ua) return 'NO-UA';
  if (SCANNER_RE.test(ua)) return 'SCANNER';
  if (BOT_RE.test(ua)) return 'BOT';
  return 'HUMAN';
}

export async function GET(request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit'), 10) || 15));

  const [total, items] = await Promise.all([
    prisma.probeLog.count(),
    prisma.probeLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    items: items.map((row) => ({ ...row, kind: classifyProbe(row) })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function DELETE(request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, all } = await request.json().catch(() => ({}));

  if (all) {
    const { count } = await prisma.probeLog.deleteMany();
    return NextResponse.json({ success: true, count });
  }

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  await prisma.probeLog.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ success: true });
}
