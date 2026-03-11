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

async function getOrCreateStripePrice(
  listing: { id: string; title: string; price_monthly?: number | null; price_once?: number | null },
  pricingType: 'recurring' | 'one_time'
): Promise<string> {
  const serviceClient = createServiceClient()
  const amount = pricingType === 'recurring' ? listing.price_monthly! : listing.price_once!
  const amountCents = Math.round(amount * 100)

  // 1. Check Supabase cache first
  const { data: cached } = await serviceClient
    .from('stripe_prices')
    .select('price_id')
    .eq('listing_id', listing.id)
    .eq('pricing_type', pricingType)
    .single()

  if (cached?.price_id) {
    return cached.price_id
  }

  // 2. Also check the listings columns for pre-existing price IDs
  const { data: listingRow } = await serviceClient
    .from('listings')
    .select('stripe_price_id_monthly, stripe_price_id_once')
    .eq('id', listing.id)
    .single()

  const existingPriceId = pricingType === 'recurring'
    ? listingRow?.stripe_price_id_monthly
    : listingRow?.stripe_price_id_once

  if (existingPriceId) {
    // Backfill cache so we find it next time without hitting listings
    await serviceClient.from('stripe_prices').upsert({
      listing_id: listing.id,
      pricing_type: pricingType,
      amount: amountCents,
      currency: 'eur',
      price_id: existingPriceId,
      product_id: '', // unknown at this point, that's fine
    }, { onConflict: 'listing_id,pricing_type' })
    return existingPriceId
  }

  // 3. Create new Stripe product + price
  const product = await getStripe().products.create({
    name: listing.title,
    metadata: { listing_id: listing.id },
  })
  const price = await getStripe().prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency: 'eur',
    ...(pricingType === 'recurring' ? { recurring: { interval: 'month' } } : {}),
  })

  // 4. Persist to Supabase cache AND back-write to listings table
  await Promise.all([
    serviceClient.from('stripe_prices').upsert({
      listing_id: listing.id,
      pricing_type: pricingType,
      amount: amountCents,
      currency: 'eur',
      price_id: price.id,
      product_id: product.id,
    }, { onConflict: 'listing_id,pricing_type' }),
    serviceClient.from('listings').update(
      pricingType === 'recurring'
        ? { stripe_price_id_monthly: price.id }
        : { stripe_price_id_once: price.id }
    ).eq('id', listing.id),
  ])

  return price.id
}
