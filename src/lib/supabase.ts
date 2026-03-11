import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Service-role client — bypasses RLS.
 * Use ONLY in trusted server contexts (webhooks, admin routes).
 */
export function createServiceClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

/**
 * User-scoped client — respects RLS.
 * Use in API routes that act on behalf of the authenticated user.
 */
export async function createUserClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

/**
 * Get authenticated user or return null.
 */
export async function getAuthUser() {
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
