import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase'

/**
 * GET /api/me
 * Returns the authenticated user's profile + purchases + subscription.
 */
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [profileRes, purchasesRes, subscriptionRes] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase
        .from('purchases')
        .select('id, type, status, amount_paid, currency, created_at, listing:listings(id, title, slug, thumbnail_url, type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('subscriptions')
        .select('id, plan, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single(),
    ])

    return NextResponse.json({
      data: {
        ...profileRes.data,
        email: user.email,
        purchases: purchasesRes.data ?? [],
        subscription: subscriptionRes.data ?? null,
      }
    })
  } catch (err) {
    console.error('[GET /api/me]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/me
 * Update the authenticated user's profile.
 *
 * Body: { username?, full_name?, bio?, website?, avatar_url?, type? }
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const allowed = ['username', 'full_name', 'bio', 'website', 'avatar_url', 'type']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (updates.type && !['buyer', 'creator', 'both'].includes(updates.type as string)) {
      return NextResponse.json({ error: 'type must be buyer, creator, or both' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[PUT /api/me]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
