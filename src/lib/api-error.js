import { NextResponse } from 'next/server';

// Maps Prisma/JSON errors to honest status codes so admin endpoints never
// fall back to a generic 500 for client mistakes (bad JSON, missing record,
// duplicate unique fields, invalid payloads).
export function apiErrorResponse(label, err) {
  console.error(label, err);
  const code = err?.code;
  if (err instanceof SyntaxError) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (code === 'P2025') {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }
  if (code === 'P2002') {
    return NextResponse.json({ error: 'A record with that value already exists' }, { status: 409 });
  }
  if (err?.name === 'PrismaClientValidationError') {
    return NextResponse.json({ error: 'Invalid data for this record' }, { status: 400 });
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
