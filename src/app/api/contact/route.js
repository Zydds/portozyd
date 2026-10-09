import { NextResponse, after } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot: bots fill hidden fields; humans never see it.
    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // Validation
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (
      trimmedName.length === 0 ||
      trimmedName.length > 100 ||
      trimmedSubject.length === 0 ||
      trimmedSubject.length > 200 ||
      trimmedMessage.length === 0 ||
      trimmedMessage.length > 5000 ||
      trimmedEmail.length === 0 ||
      trimmedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 1. Save to Database
    const saved = await prisma.contactMessage.create({
      data: { name: trimmedName, email: trimmedEmail, subject: trimmedSubject, message: trimmedMessage },
    });

    // 2. Notify by email after the response is sent (does not block the sender).
    if (process.env.RESEND_API_KEY) {
      after(async () => {
        try {
          await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL || 'contact@zaidanghiffari.my.id',
            subject: `New Contact Form Submission: ${trimmedSubject}`,
            html: `
              <h3>New Message from Portfolio Website</h3>
              <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
              <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
              <p><strong>Message:</strong></p>
              <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>
            `,
          });
        } catch (err) {
          console.error('Contact notification email failed:', err);
        }
      });
    }

    return NextResponse.json({ success: true, id: saved.id });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
