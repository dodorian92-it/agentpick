import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get user to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user profile to determine type-based redirect
        const { data: profile } = await supabase
          .from('users')
          .select('type')
          .eq('id', user.id)
          .single();

        if (next !== '/') {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // Redirect based on user type (default locale 'en')
        const redirectPath =
          profile?.type === 'creator' ? '/en/creator' : '/en/dashboard';
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Error — redirect to login
  return NextResponse.redirect(`${origin}/en/login?error=auth_callback_error`);
}
