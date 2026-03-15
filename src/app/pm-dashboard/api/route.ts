import { NextRequest, NextResponse } from 'next/server';
import { createPMSession, PM_COOKIE } from '@/lib/pm-auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.DASHBOARD_PASSWORD ?? 'Jarvis2026!';

  if (password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const token = await createPMSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PM_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}
