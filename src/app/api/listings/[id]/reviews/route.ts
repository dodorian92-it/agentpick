import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/listings/[id]/reviews
 * Paginated reviews for a listing.
 *
 * Query params: page, limit
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const offset = (page - 1) * limit

    const supabase = await createUserClient()

    const { data, error, count } = await supabase
      .from('reviews')
      .select('id, rating, body, created_at, user:users(id, username, full_name, avatar_url)', { count: 'exact' })
      .eq('listing_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      data,
      meta: { total: count ?? 0, page, limit, pages: Math.ceil((count ?? 0) / limit) }
    })
  } catch (err) {
    console.error('[GET /api/listings/[id]/reviews]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/listings/[id]/reviews
 * Add a review. Requires auth + active purchase of this listing.
 *
 * Body: { rating: 1-5, body?: string }
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: listing_id } = await params
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify active purchase
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)
      .eq('status', 'active')
      .single()

    if (!purchase) {
      return NextResponse.json({ error: 'You must purchase this listing before reviewing' }, { status: 403 })
    }

    const { rating, body } = await req.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({ listing_id, user_id: user.id, rating, body: body ?? null })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You have already reviewed this listing' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/listings/[id]/reviews]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
