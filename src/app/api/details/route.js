import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const details = await prisma.siteDetail.findMany();
    const detailsMap = {};
    details.forEach(item => {
      detailsMap[item.key] = item.value;
    });
    return NextResponse.json({ details: detailsMap });
  } catch (err) {
    console.error('Error in GET /api/details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
