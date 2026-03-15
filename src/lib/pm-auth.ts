import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const PM_COOKIE = 'pm_session';
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'fallback-dev-secret-change-me'
);

export async function createPMSession(): Promise<string> {
  return await new SignJWT({ pm: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyPMSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(PM_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export { PM_COOKIE };
