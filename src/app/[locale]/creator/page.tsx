"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  slug: string;
  type: "agent" | "skill";
  status: "draft" | "published" | "archived";
  price_monthly: number | null;
  price_once: number | null;
  install_count: number;
  avg_rating: number | null;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-500/20 text-green-300 border-green-500/20",
    draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    archived: "bg-gray-500/20 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] ?? colors.draft}`}>
      {status}
    </span>
  );
}

export default function CreatorPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me");
        if (res.status === 401) {
          router.replace(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }
        // Fetch creator's listings
        const listRes = await fetch("/api/listings/mine");
        if (listRes.ok) {
          const json = await listRes.json();
          setListings(json.data ?? []);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load listings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale, pathname, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your listings...</p>
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
            <Link href={`/${locale}/dashboard`} className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-5xl mx-auto px-6 pb-16">
        {/* Header */}
        <div className="py-10 flex items-center justify-between border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator Studio</h1>
            <p className="text-gray-400 mt-1">Manage your listings and track performance</p>
          </div>
          <Link
            href={`/${locale}/creator/new`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm"
          >
            + Create new listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
          {[
            { label: "Total listings", value: listings.length },
            { label: "Published", value: listings.filter(l => l.status === "published").length },
            { label: "Drafts", value: listings.filter(l => l.status === "draft").length },
            { label: "Total installs", value: listings.reduce((sum, l) => sum + (l.install_count || 0), 0) },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl bg-gray-900 border border-white/5">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-gray-400 mb-6">Create your first agent or skill and start earning.</p>
            <Link
              href={`/${locale}/creator/new`}
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm"
            >
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-white/5 hover:border-purple-500/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center flex-shrink-0 border border-white/5">
                  <span className="text-xl">{listing.type === "agent" ? "🤖" : "⚡"}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{listing.title}</span>
                    <StatusBadge status={listing.status} />
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${listing.type === "agent" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"}`}>
                      {listing.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    {listing.price_monthly && <span>€{listing.price_monthly}/mo</span>}
                    {listing.price_once && <span>€{listing.price_once} once</span>}
                    <span>{listing.install_count ?? 0} installs</span>
                    {listing.avg_rating && <span>⭐ {listing.avg_rating.toFixed(1)}</span>}
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/${locale}/marketplace/${listing.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
                    target="_blank"
                  >
                    View
                  </Link>
                  <Link
                    href={`/${locale}/creator/${listing.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-sm text-purple-300 border border-purple-500/20 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
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
