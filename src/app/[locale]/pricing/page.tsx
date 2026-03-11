"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const costs = [
  { name: "Vercel", desc: "Hosting & Edge Functions", monthly: "€20", icon: "▲" },
  { name: "Supabase", desc: "Database & Auth", monthly: "€10", icon: "⚡" },
  { name: "Resend", desc: "Email transazionale", monthly: "€10", icon: "✉️" },
  { name: "Dominio", desc: "agentpick.com (annuo)", monthly: "€2", icon: "🌐" },
];

const DONATION_AMOUNTS = [3, 10, 25];

export default function PricingPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState<number | "custom" | null>(null);
  const [error, setError] = useState("");

  const isIT = locale === "it";

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const handleDonate = async (amount: number, key: number | "custom") => {
    if (!amount || amount < 1) return;
    setLoading(key);
    setError("");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(isIT ? "Qualcosa è andato storto. Riprova." : "Something went wrong. Please try again.");
      }
    } catch {
      setError(isIT ? "Qualcosa è andato storto. Riprova." : "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
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
              {isIT ? "Supporta" : "Support"}
            </Link>
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
              {isIT ? "Inizia" : "Get started"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium">
          {isIT ? "Open & gratuito per sempre" : "Open & free forever"}
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {isIT ? "AgentPick è gratuito." : "AgentPick is free."}
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {isIT
            ? "Non paghiamo le bollette con aria fritta — i server costano. Se AgentPick ti ha dato valore e vuoi contribuire a tenerlo in piedi, puoi farlo qui sotto."
            : "Servers aren't free. If AgentPick has been useful to you and you'd like to help keep the lights on, you can do so below."}
        </p>
      </section>

      {/* Real costs */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">
            {isIT ? "Cosa paghiamo ogni mese" : "What we pay every month"}
          </h2>
          <p className="text-gray-400 text-center text-sm mb-10">
            {isIT
              ? "Trasparenza totale — ecco i costi reali per tenere AgentPick online."
              : "Full transparency — here are the real costs to keep AgentPick running."}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {costs.map((cost) => (
              <div
                key={cost.name}
                className="flex items-center gap-4 p-5 rounded-xl bg-gray-900/60 border border-white/10"
              >
                <span className="text-2xl">{cost.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{cost.name}</div>
                  <div className="text-xs text-gray-400">{cost.desc}</div>
                </div>
                <div className="text-purple-300 font-bold">{cost.monthly}<span className="text-gray-500 font-normal text-xs">/mo</span></div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-purple-300 text-sm font-medium">
              {isIT ? "Totale stimato: ~€40–50/mese" : "Estimated total: ~€40–50/month"}
            </span>
          </div>
        </div>
      </section>

      {/* Donation section */}
      <section className="pb-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-3xl bg-gray-900 border border-white/10 shadow-2xl shadow-purple-500/5 text-center">
            <div className="text-4xl mb-4">☕</div>
            <h2 className="text-2xl font-bold mb-2">
              {isIT ? "Supporta il progetto" : "Support the project"}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isIT
                ? "È una liberalità volontaria: non ricevi nulla di speciale in cambio, solo la nostra gratitudine e la consapevolezza di aver supportato un progetto indipendente."
                : "This is a voluntary contribution: you don't receive anything extra in return — just our genuine thanks and the knowledge that you're backing an independent project."}
            </p>

            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {DONATION_AMOUNTS.map((amount) => {
                const labels: Record<number, { it: string; en: string }> = {
                  3: { it: "Caffè", en: "Coffee" },
                  10: { it: "Supporto", en: "Support" },
                  25: { it: "Generoso", en: "Generous" },
                };
                return (
                  <button
                    key={amount}
                    onClick={() => handleDonate(amount, amount)}
                    disabled={loading !== null}
                    className="py-3 rounded-xl bg-gray-800 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 transition-all font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="text-white">€{amount}</div>
                    <div className="text-xs text-gray-400">{isIT ? labels[amount].it : labels[amount].en}</div>
                    {loading === amount && <div className="text-xs text-purple-300 mt-1">...</div>}
                  </button>
                );
              })}
            </div>

            {/* Custom amount */}
            <div className="flex gap-2 mb-6">
              <input
                type="number"
                min={1}
                placeholder={isIT ? "Importo libero (€)" : "Custom amount (€)"}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-colors"
              />
              <button
                onClick={() => handleDonate(Number(customAmount), "custom")}
                disabled={loading !== null || !customAmount || Number(customAmount) < 1}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === "custom" ? "..." : "→"}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {/* Legal disclaimer */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {isIT
                ? "Contributo gestito tramite Stripe. Nessun abbonamento, nessun rinnovo automatico. Se hai effettuato un pagamento per errore, scrivici entro 30 giorni per il rimborso completo. I fondi vanno a copertura dei costi operativi di AgentPick. Liberalità volontaria — non corrispettivo di servizi."
                : "Payment processed via Stripe. No subscription, no automatic renewal. If you made a payment by mistake, contact us within 30 days for a full refund. Funds cover AgentPick's operating costs. Voluntary contribution — not a payment for services."}
            </p>
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
