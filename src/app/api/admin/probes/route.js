import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return null;
  return session;
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
    items,
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
