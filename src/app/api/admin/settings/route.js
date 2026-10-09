import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { apiErrorResponse } from '@/lib/api-error';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'change-password') {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Both passwords required' }, { status: 400 });
      }

      // Target the logged-in admin — findFirst() used to change whichever
      // admin row came first (there are two in this DB).
      let user = null;
      if (session.user?.id) user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user && session.user?.email) user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return apiErrorResponse('Error in POST /api/admin/settings:', err);
  }
}
