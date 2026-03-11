import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", { apiVersion: "2026-02-25.clover" as never });

/**
 * POST /api/webhooks/stripe
 * Handle Stripe events. Validates webhook signature.
 *
 * Handled events:
 *   checkout.session.completed       — activate purchase
 *   invoice.payment_succeeded        — renew subscription
 *   invoice.payment_failed           — mark subscription past_due
 *   customer.subscription.deleted    — cancel subscription + purchase
 *   customer.subscription.updated    — sync subscription status
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe Webhook] Invalid signature', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { purchase_id, purchase_type } = session.metadata ?? {}

        if (purchase_id) {
          await db.from('purchases').update({
            status: 'active',
            stripe_payment_intent_id: session.payment_intent as string ?? null,
            stripe_subscription_id: session.subscription as string ?? null,
            amount_paid: session.amount_total ? session.amount_total / 100 : null,
          }).eq('id', purchase_id)

          // Increment install count
          if (session.metadata?.listing_id) {
            await db.rpc('increment_install_count', { listing_id: session.metadata.listing_id })
          }
        }

        // Handle subscription plan
        if (purchase_type === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await upsertSubscription(db, sub, session.metadata?.supabase_user_id!)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subId = (invoice as any).subscription as string | null
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          await upsertSubscription(db, sub)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subId = (invoice as any).subscription as string | null
        if (subId) {
          await db.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', subId)
          await db.from('purchases').update({ status: 'failed' }).eq('stripe_subscription_id', subId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await db.from('subscriptions').update({ status: 'cancelled' }).eq('stripe_subscription_id', sub.id)
        await db.from('purchases').update({ status: 'cancelled' }).eq('stripe_subscription_id', sub.id)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await upsertSubscription(db, sub)
        break
      }

      default:
        // Ignore unhandled events
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Stripe Webhook] Processing error', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function upsertSubscription(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  sub: Stripe.Subscription,
  supabaseUserId?: string
) {
  // Resolve user from stripe customer if not provided
  let userId = supabaseUserId
  if (!userId) {
    const { data } = await db.from('users').select('id').eq('stripe_customer_id', sub.customer).single()
    userId = data?.id
  }
  if (!userId) return

  await db.from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer as string,
    plan: 'buyer_monthly',
    status: sub.status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current_period_start: (sub as any).current_period_start ? new Date((sub as any).current_period_start * 1000).toISOString() : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current_period_end: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
  }, { onConflict: 'stripe_subscription_id' })
}
