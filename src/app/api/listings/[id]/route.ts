import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/listings/[id]
 * Listing detail. Accepts UUID or slug.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createUserClient()

    // Try UUID first, then slug
    const isUuid = /^[0-9a-f-]{36}$/i.test(id)
    const query = supabase
      .from('listings')
      .select('*, creator:users(id, username, full_name, avatar_url, bio)')

    const { data, error } = isUuid
      ? await query.eq('id', id).single()
      : await query.eq('slug', id).single()

    if (error || !data) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Non-creators can only see published listings
    const { data: { user } } = await supabase.auth.getUser()
    if (data.status !== 'published' && data.creator_id !== user?.id) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[GET /api/listings/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/listings/[id]
 * Update listing. Owner only.
 *
 * Body: any subset of listing fields (partial update).
 * Status transitions: draft→published, published→archived, etc.
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const allowed = ['title', 'description', 'short_desc', 'type', 'price_monthly', 'price_once', 'tags', 'thumbnail_url', 'demo_url', 'docs_url', 'status']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    if (updates.status && !['draft', 'published', 'archived'].includes(updates.status as string)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // RLS ensures only the owner can update
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .eq('creator_id', user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Listing not found or not authorized' }, { status: 404 })

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[PUT /api/listings/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
