import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/src/lib/db';
import Registration from '@/src/models/Registration';

const memberSchemaZ = z.object({
  name: z.string().min(1),
  phone: z.string().min(10).max(15),
  prn: z.string().min(1),
});

const registrationSchemaZ = z.object({
  leaderName: z.string().min(1),
  leaderPRN: z.string().min(1),
  div: z.string().min(1),
  year: z.string().min(1),
  branch: z.string().min(1),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  teamName: z.string().min(1),
  members: z.array(memberSchemaZ).max(3).optional().default([]),
});

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.headers.set('Vary', 'Origin');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchemaZ.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const exists = await Registration.findOne({
      $or: [{ email: parsed.data.email }, { leaderPRN: parsed.data.leaderPRN }],
    });
    if (exists) {
      return NextResponse.json({ error: 'Already registered with this email or PRN' }, { status: 409 });
    }

    const reg = await Registration.create(parsed.data);
    const res = NextResponse.json({ id: reg._id, message: 'Registered successfully' }, { status: 201 });
    res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.headers.set('Vary', 'Origin');
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
