import { NextRequest, NextResponse } from 'next/server'
import { createUserClient, createServiceClient } from '@/lib/supabase'
import Stripe from 'stripe'

let _stripe: import("stripe").default | null = null;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", { apiVersion: "2026-02-25.clover" as never });
  return _stripe;
}

/**
 * POST /api/checkout
 * Create a Stripe Checkout session.
 *
 * Body:
 *   listing_id  string — UUID of the listing to purchase
 *   type        'subscription' | 'once' — purchase type
 *   success_url string — redirect after successful payment
 *   cancel_url  string — redirect on cancel
 *
 * Returns: { url: string } — Stripe hosted checkout URL
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createUserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { listing_id, type, success_url, cancel_url } = await req.json()

    if (!listing_id || !type || !success_url || !cancel_url) {
      return NextResponse.json({ error: 'listing_id, type, success_url, cancel_url are required' }, { status: 400 })
    }
    if (!['subscription', 'once'].includes(type)) {
      return NextResponse.json({ error: 'type must be subscription or once' }, { status: 400 })
    }

    // Fetch listing
    const { data: listing, error: listingErr } = await supabase
      .from('listings')
      .select('id, title, price_monthly, price_once, stripe_price_id_monthly, stripe_price_id_once, status')
      .eq('id', listing_id)
      .eq('status', 'published')
      .single()

    if (listingErr || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient.from('users').select('stripe_customer_id').eq('id', user.id).single()

    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await serviceClient.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Build line items
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    let mode: Stripe.Checkout.SessionCreateParams.Mode

    if (type === 'subscription') {
      if (!listing.stripe_price_id_monthly && !listing.price_monthly) {
        return NextResponse.json({ error: 'Listing does not support subscriptions' }, { status: 400 })
      }
      const priceId = listing.stripe_price_id_monthly ?? await getOrCreateStripePrice(listing, 'recurring')
      lineItems = [{ price: priceId, quantity: 1 }]
      mode = 'subscription'
    } else {
      if (!listing.stripe_price_id_once && !listing.price_once) {
        return NextResponse.json({ error: 'Listing does not support one-time purchase' }, { status: 400 })
      }
      const priceId = listing.stripe_price_id_once ?? await getOrCreateStripePrice(listing, 'one_time')
      lineItems = [{ price: priceId, quantity: 1 }]
      mode = 'payment'
    }

    // Create pending purchase record
    const { data: purchase, error: purchaseErr } = await serviceClient
      .from('purchases')
      .insert({
        user_id: user.id,
        listing_id,
        type,
        status: 'pending',
        currency: 'eur',
      })
      .select('id')
      .single()

    if (purchaseErr) throw purchaseErr

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: lineItems,
      success_url,
      cancel_url,
      metadata: {
        supabase_user_id: user.id,
        listing_id,
        purchase_id: purchase.id,
        purchase_type: type,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getOrCreateStripePrice(listing: { id: string; title: string; price_monthly?: number | null; price_once?: number | null }, pricingType: 'recurring' | 'one_time') {
  // Create ad-hoc Stripe price (prices should be pre-created in production)
  const amount = pricingType === 'recurring' ? listing.price_monthly! : listing.price_once!
  const product = await getStripe().products.create({
    name: listing.title,
    metadata: { listing_id: listing.id },
  })
  const price = await getStripe().prices.create({
    product: product.id,
    unit_amount: Math.round(amount * 100),
    currency: 'eur',
    ...(pricingType === 'recurring' ? { recurring: { interval: 'month' } } : {}),
  })
  return price.id
}
