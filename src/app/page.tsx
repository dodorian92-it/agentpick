"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"buyer" | "creator">("buyer");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AgentPick
          </span>
          <a
            href="#waitlist"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
          >
            Join the Waitlist →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
            Coming soon · Limited early access spots
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
            The AI Agent Marketplace{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              You Can Actually Trust
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated skills and agents for OpenClaw, Claude Code, and beyond.
            Every listing is reviewed, tested, and kept up-to-date — or your
            money back.
          </p>
          <a
            href="#waitlist"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg shadow-purple-500/20"
          >
            Join the Waitlist →
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Tired of skills that break on next update?
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            The current marketplace landscape is a mess. Here&apos;s what
            everyone&apos;s putting up with.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "No Curation",
                desc: "Anyone can publish anything. Most skills are abandoned, broken, or just plain useless. You waste hours testing before finding something that works.",
              },
              {
                icon: "💸",
                title: "One-Time Sales",
                desc: "Creators get paid once, then move on. There's no incentive to maintain or update. Your workflow breaks silently after each platform update.",
              },
              {
                icon: "⭐",
                title: "Fake Reviews",
                desc: "Self-hosted reviews with no verification. You never know if you're reading genuine feedback or manufactured social proof.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-gray-800/50 border border-white/5 hover:border-red-500/20 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-red-400">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            A marketplace built on trust
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            AgentPick fixes the fundamentals. Every decision we make comes back
            to one question: would you stake your reputation on this?
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✅",
                title: "Curated Catalog",
                desc: "Every skill is manually reviewed and tested by our team before it hits the marketplace. We reject anything that doesn't meet our quality bar.",
                color: "purple",
              },
              {
                icon: "🔄",
                title: "Subscription Model",
                desc: "Creators earn recurring revenue, which means they're incentivized to keep their skills working perfectly — every update, every time.",
                color: "blue",
              },
              {
                icon: "🛡️",
                title: "Verified Reviews",
                desc: "Only verified buyers can leave reviews. No gaming the system. Real feedback from real users who actually paid for the skill.",
                color: "purple",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-8 rounded-2xl bg-gradient-to-b from-${item.color}-500/10 to-transparent border border-${item.color}-500/20 hover:border-${item.color}-500/40 transition-colors`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3
                  className={`text-xl font-semibold mb-3 text-${item.color}-400`}
                >
                  {item.title}
                </h3>
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Sell skills that pay you every month
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Build once, earn forever. With our subscription model and{" "}
            <span className="text-white font-semibold">70% revenue share</span>
            , you get predictable income that grows as your user base grows.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                stat: "70%",
                label: "Revenue share",
                sub: "Best-in-class creator payout",
              },
              {
                stat: "∞",
                label: "Recurring income",
                sub: "Monthly subscriptions, not one-offs",
              },
              {
                stat: "0%",
                label: "Fee for 90 days",
                sub: "For early creator signups",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="p-6 rounded-2xl bg-gray-800/50 border border-white/5"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  {item.stat}
                </div>
                <div className="font-semibold text-white mb-1">{item.label}</div>
                <div className="text-sm text-gray-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="p-10 rounded-3xl bg-gray-900 border border-white/10 shadow-2xl shadow-purple-500/5">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-2">
                  We&apos;re launching soon.
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
                      I&apos;m a {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  {role === "buyer" ? (
                    <p className="text-purple-300 text-sm text-center">
                      🎁{" "}
                      <span className="font-semibold">
                        Early buyers get 30% off their first 3 months.
                      </span>{" "}
                      No code needed — applied automatically.
                    </p>
                  ) : (
                    <p className="text-purple-300 text-sm text-center">
                      🚀{" "}
                      <span className="font-semibold">
                        Early creators pay 0% platform fee for 90 days.
                      </span>{" "}
                      Keep everything you earn.
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-800 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-white shadow-lg shadow-purple-500/20 transform hover:scale-[1.02]"
                  >
                    Join the Waitlist →
                  </button>
                </form>
                <p className="text-center text-xs text-gray-500 mt-4">
                  No spam. No credit card. Cancel anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold mb-3">You&apos;re on the list!</h3>
                <p className="text-gray-400 mb-2">
                  We&apos;ll reach out to <span className="text-white">{email}</span> when we launch.
                </p>
                <p className="text-purple-300 text-sm">
                  {role === "buyer"
                    ? "Your 30% discount is reserved. We'll apply it automatically."
                    : "Your 0% fee period is locked in. We'll onboard you first."}
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
          <span>© 2026 AgentPick — Built for the OpenClaw ecosystem</span>
        </div>
      </footer>
    </main>
  );
}
