import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Look up by session user id first, fallback to email, then fallback to first admin
    let user = null;
    if (session.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } });
    }
    if (!user && session.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    }

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location,
        website: user.website,
        linkedin: user.linkedin,
        github: user.github,
      },
    });
  } catch (err) {
    console.error('Error in GET /api/admin/profile:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve target admin user id
    let targetUser = null;
    if (session.user?.id) {
      targetUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    }
    if (!targetUser && session.user?.email) {
      targetUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User record to update not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, bio, avatar, location, website, linkedin, github } = body;

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar: safeUrl(avatar) }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website: safeUrl(website) }),
        ...(linkedin !== undefined && { linkedin: safeUrl(linkedin) }),
        ...(github !== undefined && { github: safeUrl(github) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error('Error in PUT /api/admin/profile:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
