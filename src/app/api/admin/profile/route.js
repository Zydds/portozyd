import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { safeUrl } from '@/lib/safe-url';
import { apiErrorResponse } from '@/lib/api-error';
import { registerExternalMedia } from '@/lib/media-register';

// Users often paste bare domains ("github.com/Zydos"); safeUrl() returns null
// for those, which silently wiped the field on save. Assume https:// first.
function asSafeUrl(value) {
  const direct = safeUrl(value);
  if (direct) return direct;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  if (/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+([/:?#].*)?$/i.test(trimmed)) {
    return safeUrl('https://' + trimmed);
  }
  return null;
}

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
      user = await prisma.user.findFirst({ where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' } });
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
    return apiErrorResponse('Error in GET /api/admin/profile:', err);
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
      targetUser = await prisma.user.findFirst({ where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' } });
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User record to update not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, bio, avatar, location, website, linkedin, github } = body;

    // email backs authentication: reject empty/obviously-invalid values that
    // would lock the admin out (empty string used to be stored silently).
    if (email !== undefined && email !== null) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar: asSafeUrl(avatar) }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website: asSafeUrl(website) }),
        ...(linkedin !== undefined && { linkedin: asSafeUrl(linkedin) }),
        ...(github !== undefined && { github: asSafeUrl(github) }),
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

    // Landing/topic pages render this profile under the root layout's ISR;
    // invalidate immediately so saves appear without waiting out revalidate=300.
    revalidatePath('/', 'layout');

    if (avatar !== undefined) await registerExternalMedia(updatedUser.avatar);

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'That email address is already in use' }, { status: 409 });
    }
    return apiErrorResponse('Error in PUT /api/admin/profile:', err);
  }
}
