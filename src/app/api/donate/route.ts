import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "placeholder", { apiVersion: "2026-02-25.clover" as never });
  return _stripe;
}

/**
 * POST /api/donate
 * Create a Stripe Checkout session for a one-time voluntary donation.
 *
 * Body:
 *   amount  number — donation amount in EUR (e.g. 10)
 *
 * Returns: { clientSecret: string, url: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'amount must be a positive number (EUR)' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)

    // Create a Stripe Checkout Session (hosted page) for one-time donation
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: amountCents,
            product_data: {
              name: 'Donazione AgentPick',
              description: 'Contributo volontario a supporto dei costi operativi di AgentPick. Non costituisce corrispettivo di servizi.',
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          type: 'donation',
          platform: 'agentpick',
        },
      },
      metadata: {
        type: 'donation',
        platform: 'agentpick',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agentpick.com'}/donate/thank-you?amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agentpick.com'}/pricing`,
    })

    return NextResponse.json({
      clientSecret: session.payment_intent as string ?? null,
      url: session.url,
    })
  } catch (err) {
    console.error('[POST /api/donate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
