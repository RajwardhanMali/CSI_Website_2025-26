import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true, time: new Date().toISOString() });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Vary', 'Origin');
  return res;
}
