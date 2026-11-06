import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Fixed destination: never accept a user-provided redirect URL.
  const destination = new URL('/reset-password', url.origin);
  try {
    const code = url.searchParams.get('code');
    const db = await serverDb();
    if (!code || !db || url.searchParams.has('error')) {
      destination.searchParams.set('recovery_error', 'invalid_link');
    } else {
      const { error } = await db.auth.exchangeCodeForSession(code);
      if (error) destination.searchParams.set('recovery_error', 'expired_link');
    }
  } catch {
    destination.searchParams.set('recovery_error', 'connection');
  }
  const response = NextResponse.redirect(destination);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
