import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { apiErrorResponse } from '@/lib/api-error';
import {
  RESTRICTED_KEY,
  loadRestrictedDoc,
  sanitizeRestrictedDoc,
} from '@/lib/restricted-content';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET: current document (defaults until first save) for the admin editor.
export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    return NextResponse.json({ restricted: await loadRestrictedDoc() });
  } catch (err) {
    return apiErrorResponse('Error in GET /api/admin/restricted:', err);
  }
}

// PUT: sanitize + persist the document; the page re-renders from it live.
export async function PUT(request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const doc = sanitizeRestrictedDoc(body?.restricted);
    const value = JSON.stringify(doc);

    await prisma.siteDetail.upsert({
      where: { key: RESTRICTED_KEY },
      update: { value },
      create: { key: RESTRICTED_KEY, value },
    });

    return NextResponse.json({ success: true, restricted: doc });
  } catch (err) {
    return apiErrorResponse('Error in PUT /api/admin/restricted:', err);
  }
}
