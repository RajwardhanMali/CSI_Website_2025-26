import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function getAuthClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_EMAIL;
  if (!privateKey || !clientEmail) throw new Error('Missing Google service account credentials');
  const auth = new GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: SCOPES,
  });
  return auth;
}

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
    const { name, mimeType } = body || {};
    if (!name || !mimeType) {
      return NextResponse.json({ error: 'name and mimeType are required' }, { status: 400 });
    }

    const parent = process.env.GOOGLE_DRIVE_PARENT_ID ? [process.env.GOOGLE_DRIVE_PARENT_ID] : undefined;

    const auth = getAuthClient();
    const client = await auth.getClient();

    const metadata: any = { name, mimeType, ...(parent ? { parents: parent } : {}) };

    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
    const resp = await client.request({
      url,
      method: 'POST',
      headers: {
        'X-Upload-Content-Type': mimeType,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      data: JSON.stringify(metadata),
    });

    const sessionUrl = (resp as any).headers.location;
    if (!sessionUrl) return NextResponse.json({ error: 'Failed to create upload session' }, { status: 500 });

    const res = NextResponse.json({ uploadUrl: sessionUrl });
    res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.headers.set('Vary', 'Origin');
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
