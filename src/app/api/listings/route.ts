import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase'

/**
 * GET /api/listings
 * Browse listings with optional filters.
 *
 * Query params:
 *   type    = 'agent' | 'skill'
 *   tag     = string (single tag filter)
 *   sort    = 'newest' | 'popular' | 'rating' (default: 'newest')
 *   page    = number (default: 1)
 *   limit   = number (default: 20, max: 50)
 *   q       = string (text search on title + description)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type   = searchParams.get('type')
    const tag    = searchParams.get('tag')
    const sort   = searchParams.get('sort') ?? 'newest'
    const q      = searchParams.get('q')
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const offset = (page - 1) * limit

    const supabase = await createUserClient()

    let query = supabase
      .from('listings')
      .select('id, title, slug, short_desc, type, price_monthly, price_once, tags, thumbnail_url, status, install_count, avg_rating, created_at, creator:users(id, username, full_name, avatar_url)', { count: 'exact' })
      .eq('status', 'published')
      .range(offset, offset + limit - 1)

    if (type && ['agent', 'skill'].includes(type)) {
      query = query.eq('type', type)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    switch (sort) {
      case 'popular': query = query.order('install_count', { ascending: false }); break
      case 'rating':  query = query.order('avg_rating', { ascending: false, nullsFirst: false }); break
      default:        query = query.order('created_at', { ascending: false }); break
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      meta: { total: count ?? 0, page, limit, pages: Math.ceil((count ?? 0) / limit) }
    })
  } catch (err) {
    console.error('[GET /api/listings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/listings
 * Create a new listing. Requires creator auth.
 *
 * Body: { title, description, short_desc?, type, price_monthly?, price_once?, tags?, thumbnail_url?, demo_url?, docs_url? }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is creator or both
    const { data: profile } = await supabase.from('users').select('type').eq('id', user.id).single()
    if (!profile || !['creator', 'both'].includes(profile.type)) {
      return NextResponse.json({ error: 'Creator account required' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, short_desc, type, price_monthly, price_once, tags, thumbnail_url, demo_url, docs_url } = body

    if (!title || !description || !type) {
      return NextResponse.json({ error: 'title, description, and type are required' }, { status: 400 })
    }
    if (!['agent', 'skill'].includes(type)) {
      return NextResponse.json({ error: 'type must be agent or skill' }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    const { data, error } = await supabase
      .from('listings')
      .insert({
        creator_id: user.id,
        title,
        slug,
        description,
        short_desc,
        type,
        price_monthly: price_monthly ?? null,
        price_once: price_once ?? null,
        tags: tags ?? [],
        thumbnail_url: thumbnail_url ?? null,
        demo_url: demo_url ?? null,
        docs_url: docs_url ?? null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/listings]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
