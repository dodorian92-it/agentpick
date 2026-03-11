import { NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase'

/**
 * GET /api/listings/mine
 * Returns all listings owned by the authenticated creator.
 */
export async function GET() {
  try {
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('listings')
      .select('id, title, slug, type, status, price_monthly, price_once, tags, install_count, avg_rating, created_at')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[GET /api/listings/mine]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
