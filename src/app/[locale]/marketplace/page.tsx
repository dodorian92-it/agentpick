"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Creator {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  type: "agent" | "skill";
  price_monthly: number | null;
  price_once: number | null;
  tags: string[];
  thumbnail_url: string | null;
  install_count: number;
  avg_rating: number | null;
  created_at: string;
  creator: Creator;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "agent", label: "🤖 Agents" },
  { value: "skill", label: "⚡ Skills" },
];

const POPULAR_TAGS = ["automation", "productivity", "writing", "code", "research", "sales", "support", "marketing"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/marketplace/${listing.slug}`}
      className="group flex flex-col bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center overflow-hidden">
        {listing.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.thumbnail_url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">{listing.type === "agent" ? "🤖" : "⚡"}</span>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${listing.type === "agent" ? "bg-purple-500/20 text-purple-300 border border-purple-500/20" : "bg-blue-500/20 text-blue-300 border border-blue-500/20"}`}>
            {listing.type === "agent" ? "Agent" : "Skill"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-900/80 text-white border border-white/10">
            Free
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{listing.short_desc}</p>
        </div>

        {/* Tags */}
        {listing.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {listing.creator.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.creator.avatar_url} alt={listing.creator.full_name} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">
                {(listing.creator.full_name || listing.creator.username || "?")[0].toUpperCase()}
              </div>
            )}
            <span>{listing.creator.full_name || listing.creator.username}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {listing.avg_rating && (
              <div className="flex items-center gap-1">
                <StarRating rating={listing.avg_rating} />
                <span>{listing.avg_rating.toFixed(1)}</span>
              </div>
            )}
            {listing.install_count > 0 && (
              <span>{listing.install_count.toLocaleString()} installs</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      if (tagFilter) params.set("tag", tagFilter);
      if (search) params.set("q", search);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/listings?${params}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setListings(json.data ?? []);
      setMeta(json.meta ?? { total: 0, page: 1, pages: 1 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, tagFilter, search, sort, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [typeFilter, tagFilter, search, sort]);

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AgentPick
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLocale("en")} className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>EN</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => switchLocale("it")} className={`px-2 py-1 rounded transition-colors ${locale === "it" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>IT</button>
            </div>
            <Link href={`/${locale}/login`} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium">
              Sign in
            </Link>
          </div>
          <button
            className="md:hidden text-white text-2xl leading-none"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            <Link href={`/${locale}`} className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href={`/${locale}/marketplace`} className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
            <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href={`/${locale}/login`} className="text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          </div>
        )}
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-6 pb-16">
        {/* Open & Free Banner */}
        <div className="mt-6 mb-2 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🆓</span>
            <div>
              <p className="text-white font-semibold text-base leading-tight">Open &amp; Free</p>
              <p className="text-gray-300 text-sm">List your agent at no cost — no fees, no gatekeeping, forever.</p>
            </div>
          </div>
          <a
            href={`/${locale}/creator/new`}
            className="shrink-0 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium text-white"
          >
            List your agent →
          </a>
        </div>
        {/* Header */}
        <div className="py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
              Marketplace
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <span>✦</span>
              <span>Free &amp; Open</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Discover AI Agents & Skills
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Browse curated, verified AI tools built by creators worldwide.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search agents and skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type filter */}
            <div className="flex bg-gray-900 border border-white/10 rounded-xl p-1 gap-1">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${typeFilter === opt.value ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-900 border border-white/10 text-sm text-gray-300 focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Results count */}
            {!loading && (
              <span className="text-sm text-gray-500 ml-auto">
                {meta.total} {meta.total === 1 ? "result" : "results"}
              </span>
            )}
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${tagFilter === tag ? "bg-purple-600 text-white border border-purple-500" : "bg-gray-900 text-gray-400 border border-white/5 hover:border-purple-500/30 hover:text-gray-300"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Listings grid */}
        {error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-2">⚠️ {error}</div>
            <button onClick={fetchListings} className="text-sm text-purple-400 hover:underline">Retry</button>
          </div>
        ) : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setTypeFilter(""); setTagFilter(""); setSearch(""); setSort("newest"); }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-900 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(meta.pages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-purple-600 text-white" : "bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                  disabled={page === meta.pages}
                  className="px-4 py-2 rounded-lg bg-gray-900 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
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
