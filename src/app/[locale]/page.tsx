"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"buyer" | "creator">("buyer");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: role }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AgentPick
          </span>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/pricing`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <a
              href="#waitlist"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
            >
              {t("hero.cta")}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
            Coming soon · Limited early access spots
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t("hero.headline")}
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.sub")}
          </p>
          <a
            href="#waitlist"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg shadow-purple-500/20"
          >
            {t("hero.cta")}
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            {t("problem.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔍", title: t("problem.col1_title"), desc: t("problem.col1_body"), color: "red" },
              { icon: "💸", title: t("problem.col2_title"), desc: t("problem.col2_body"), color: "red" },
              { icon: "⭐", title: t("problem.col3_title"), desc: t("problem.col3_body"), color: "red" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-gray-800/50 border border-white/5 hover:border-red-500/20 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-red-400">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            {t("solution.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: t("solution.card1_title"), desc: t("solution.card1_body"), color: "purple" },
              { icon: "🔄", title: t("solution.card2_title"), desc: t("solution.card2_body"), color: "blue" },
              { icon: "🛡️", title: t("solution.card3_title"), desc: t("solution.card3_body"), color: "purple" },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-8 rounded-2xl bg-gradient-to-b from-${item.color}-500/10 to-transparent border border-${item.color}-500/20 hover:border-${item.color}-500/40 transition-colors`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 text-${item.color}-400`}>{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section className="py-24 px-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
            For Creators
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t("creators.title")}</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">{t("creators.body")}</p>
          <a
            href="#waitlist"
            onClick={() => setRole("creator")}
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all font-semibold text-lg"
          >
            {t("creators.cta")}
          </a>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-3xl bg-gray-900 border border-white/10 shadow-2xl shadow-purple-500/5">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-2">
                  {t("waitlist.title")}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                  Get early access and lock in your exclusive benefits.
                </p>

                {/* Role toggle */}
                <div className="flex mb-6 p-1 bg-gray-800 rounded-xl">
                  {(["buyer", "creator"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        role === r
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {r === "buyer" ? t("waitlist.buyer") : t("waitlist.creator")}
                    </button>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-purple-300 text-sm text-center">
                    {role === "buyer" ? `🎁 ${t("waitlist.promise_buyer")}` : `🚀 ${t("waitlist.promise_creator")}`}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder={t("waitlist.placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-800 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-colors"
                  />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-white shadow-lg shadow-purple-500/20 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : t("waitlist.submit")}
                  </button>
                </form>
                <p className="text-center text-xs text-gray-500 mt-4">
                  No spam. No credit card. Cancel anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold mb-3">{t("waitlist.success")}</h3>
                <p className="text-gray-400 mb-2">
                  We&apos;ll reach out to <span className="text-white">{email}</span> when we launch.
                </p>
                <p className="text-purple-300 text-sm">
                  {role === "buyer" ? t("waitlist.promise_buyer") : t("waitlist.promise_creator")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AgentPick
          </span>
          <span>{t("footer")}</span>
        </div>
      </footer>
    </main>
  );
}
