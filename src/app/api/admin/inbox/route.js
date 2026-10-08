import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit'), 10) || 10));

  const [total, unread, items] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    items,
    total,
    unread,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function PATCH(request) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, read } = await request.json();

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  await prisma.contactMessage.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
