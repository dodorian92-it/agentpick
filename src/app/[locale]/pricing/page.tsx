"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    name: "Creator",
    badge: "Free to start",
    price: "€0",
    period: "forever",
    description:
      "List your agents and skills on the marketplace. Pay only when you earn.",
    highlight: false,
    features: [
      "Unlimited listings",
      "Public marketplace profile",
      "Analytics dashboard",
      "30% commission on sales",
      "Payout via Stripe Connect",
      "Community support",
    ],
    cta: "Start listing",
    ctaHref: "/signup?role=creator",
    note: "30% platform commission on every transaction",
  },
  {
    name: "Buyer",
    badge: "Most popular",
    price: "€29",
    period: "/ month",
    description:
      "Unlimited access to the best AI agents and skills. Cancel anytime.",
    highlight: true,
    features: [
      "Access all listed agents & skills",
      "Priority support",
      "Early access to new listings",
      "Usage analytics",
      "Team seats (coming soon)",
      "Cancel anytime",
    ],
    cta: "Subscribe now",
    ctaHref: "/signup?role=buyer",
    note: "Billed monthly · No contracts",
  },
];

export default function PricingPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            AgentPick
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/marketplace`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="text-sm text-white font-medium"
            >
              Pricing
            </Link>
            {/* Language switcher */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => switchLocale("en")}
                className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}
              >
                EN
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => switchLocale("it")}
                className={`px-2 py-1 rounded transition-colors ${locale === "it" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}
              >
                IT
              </button>
            </div>
            <Link
              href={`/${locale}/signup`}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            One plan for buyers.
          </span>
          <br />
          <span className="text-white">Free for creators.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          AgentPick grows when you grow. No hidden fees — just results.
        </p>
      </section>

      {/* Plans */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-purple-900/40 to-gray-900/60 border-purple-500/50 shadow-xl shadow-purple-500/10"
                  : "bg-gray-900/40 border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}
              {!plan.highlight && (
                <div className="mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/10">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mt-2">{plan.name}</h2>
              <p className="text-gray-400 text-sm mt-1 mb-6">{plan.description}</p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 mb-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-purple-400 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}${plan.ctaHref}`}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {plan.cta}
              </Link>

              <p className="text-xs text-gray-500 mt-3 text-center">{plan.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Common questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How does the Creator commission work?",
                a: "When a buyer purchases your listing, AgentPick takes 30% and you keep 70%. Payouts are processed via Stripe Connect — no invoicing required.",
              },
              {
                q: "Can I be both a Buyer and a Creator?",
                a: "Yes. You can subscribe as a Buyer and list your own agents at the same time. One account, two roles.",
              },
              {
                q: "What's included in the Buyer subscription?",
                a: "Full access to all published listings on the marketplace. No per-purchase fees — your subscription covers everything.",
              },
              {
                q: "When will real Stripe payments go live?",
                a: "We're in test mode during beta. Real payments will activate when we open public access. Early waitlist members get first access.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-white/5 pb-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} AgentPick · All rights reserved
      </footer>
    </main>
  );
}
