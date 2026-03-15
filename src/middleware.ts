import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';
import { routing } from './i18n/routing';

// PM Dashboard auth
const PM_COOKIE = 'pm_session';
const pmSecret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'fallback-dev-secret-change-me'
);

async function isPMAuthed(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(PM_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, pmSecret);
    return true;
  } catch {
    return false;
  }
}

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/creator'];
// API routes that require authentication
const PROTECTED_API_ROUTES = ['/api/me'];

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PM Dashboard protection (root-level, not locale-prefixed)
  // Exclude login page and api route from protection
  const isPMRoute =
    pathname === '/pm-dashboard' ||
    (pathname.startsWith('/pm-dashboard/') &&
      !pathname.startsWith('/pm-dashboard/login') &&
      !pathname.startsWith('/pm-dashboard/api'));

  if (isPMRoute) {
    const authed = await isPMAuthed(request);
    if (!authed) {
      return NextResponse.redirect(new URL('/pm-dashboard/login', request.url));
    }
    return NextResponse.next();
  }

  // Check if this is a protected API route
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is a protected page route (with or without locale prefix)
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    // Match /dashboard, /en/dashboard, /it/dashboard, etc.
    pathname === route ||
    pathname.startsWith(`${route}/`) ||
    routing.locales.some(
      (locale) =>
        pathname === `/${locale}${route}` ||
        pathname.startsWith(`/${locale}${route}/`)
    )
  );

  if (isProtectedApi || isProtectedPage) {
    // Create a response to potentially modify cookies
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Redirect to login with current locale
      const locale =
        routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
        routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // For non-protected routes, just run i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all routes except API routes, static files, _next internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
