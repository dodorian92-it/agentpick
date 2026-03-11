"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Purchase {
  id: string;
  type: "subscription" | "once";
  status: string;
  amount_paid: number;
  currency: string;
  created_at: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    type: "agent" | "skill";
  } | null;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  type: "buyer" | "creator" | "both";
  purchases: Purchase[];
  subscription: Subscription | null;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/20 text-green-300 border-green-500/20",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/20",
    cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/20",
    failed: "bg-red-500/20 text-red-300 border-red-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] ?? colors.cancelled}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"purchases" | "subscription">("purchases");

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/me");
        if (res.status === 401) {
          router.replace(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setProfile(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [locale, pathname, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href={`/${locale}/login`} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const activePurchases = profile.purchases.filter((p) => p.status === "active" || p.status === "completed");
  const sub = profile.subscription;
  const subEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLocale("en")} className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>EN</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => switchLocale("it")} className={`px-2 py-1 rounded transition-colors ${locale === "it" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>IT</button>
            </div>
            <Link href={`/${locale}/marketplace`} className="text-sm text-gray-400 hover:text-white transition-colors">Marketplace</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-5xl mx-auto px-6 pb-16">
        {/* Header */}
        <div className="py-10 flex items-center gap-5 border-b border-white/5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-full border-2 border-purple-500/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
              {(profile.full_name || profile.username || profile.email)[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.full_name || profile.username || "Your Dashboard"}</h1>
            <p className="text-gray-400 text-sm">{profile.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${profile.type === "creator" || profile.type === "both" ? "bg-blue-500/20 text-blue-300 border-blue-500/20" : "bg-purple-500/20 text-purple-300 border-purple-500/20"}`}>
              {profile.type}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
          {[
            { label: "Total purchases", value: profile.purchases.length },
            { label: "Active items", value: activePurchases.length },
            { label: "Subscription", value: sub ? "Active" : "None", highlight: !!sub },
            {
              label: "Member since",
              value: new Date(profile.purchases[profile.purchases.length - 1]?.created_at ?? Date.now()).getFullYear().toString() || "—",
            },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl bg-gray-900 border border-white/5">
              <div className={`text-2xl font-bold ${stat.highlight ? "text-green-400" : "text-white"}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Subscription banner */}
        {sub && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold text-white">🎯 Active Subscription</span>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-sm text-gray-400">
                  Plan: <span className="text-purple-300 font-medium capitalize">{sub.plan}</span>
                  {subEnd && (
                    <> · {sub.cancel_at_period_end ? "Cancels" : "Renews"} on{" "}
                      <span className="text-white">{subEnd.toLocaleDateString()}</span></>
                  )}
                </p>
              </div>
              {sub.cancel_at_period_end && (
                <span className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 text-sm border border-orange-500/20">
                  Cancellation scheduled
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-white/10 mb-6">
          <div className="flex gap-6">
            {([
              { key: "purchases", label: "My Purchases", count: profile.purchases.length },
              { key: "subscription", label: "Subscription" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab.key ? "text-white border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300"}`}
              >
                {tab.label}
                {"count" in tab && tab.count > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-800 text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Purchases tab */}
        {activeTab === "purchases" && (
          <div className="space-y-3">
            {profile.purchases.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-5">🛒</div>
                <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                <p className="text-gray-400 mb-6">Browse the marketplace and find your first AI agent or skill.</p>
                <Link
                  href={`/${locale}/marketplace`}
                  className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm"
                >
                  Browse Marketplace →
                </Link>
              </div>
            ) : (
              profile.purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-white/5 hover:border-purple-500/20 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/5">
                    {purchase.listing?.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={purchase.listing.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{purchase.listing?.type === "agent" ? "🤖" : "⚡"}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {purchase.listing ? (
                      <Link href={`/${locale}/marketplace/${purchase.listing.slug}`} className="font-medium text-white hover:text-purple-300 transition-colors">
                        {purchase.listing.title}
                      </Link>
                    ) : (
                      <span className="font-medium text-gray-400 italic">Listing removed</span>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${purchase.type === "subscription" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"}`}>
                        {purchase.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={purchase.status} />
                    {purchase.amount_paid > 0 && (
                      <span className="text-sm text-gray-400">
                        €{(purchase.amount_paid / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Subscription tab */}
        {activeTab === "subscription" && (
          <div>
            {!sub ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-5">⚡</div>
                <h3 className="text-xl font-semibold mb-2">No active subscription</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  Subscribe to get access to premium AI agents and skills on AgentPick.
                </p>
                <Link
                  href={`/${locale}/marketplace`}
                  className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm"
                >
                  Browse Marketplace →
                </Link>
              </div>
            ) : (
              <div className="max-w-md space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Subscription details</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Plan", value: <span className="text-purple-300 font-medium capitalize">{sub.plan}</span> },
                      { label: "Status", value: <StatusBadge status={sub.status} /> },
                      { label: subEnd && sub.cancel_at_period_end ? "Cancels on" : "Renews on", value: subEnd?.toLocaleDateString() ?? "—" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {sub.cancel_at_period_end && (
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-orange-300">
                    ⚠️ Your subscription is set to cancel. You&apos;ll retain access until {subEnd?.toLocaleDateString()}.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <Link href={`/${locale}`} className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <span>© {new Date().getFullYear()} AgentPick. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
