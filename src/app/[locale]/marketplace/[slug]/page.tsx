"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { createClient } from '@supabase/supabase-js';

function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { use } from "react";

interface Creator {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_desc: string;
  type: "agent" | "skill";
  price_monthly: number | null;
  price_once: number | null;
  tags: string[];
  thumbnail_url: string | null;
  demo_url: string | null;
  docs_url: string | null;
  download_url: string | null;
  install_count: number;
  avg_rating: number | null;
  created_at: string;
  creator: Creator;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
  reviewer?: { full_name: string; avatar_url: string | null; username: string };
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<boolean>(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createBrowserClient();
        const { data: { session: supaSession } } = await supabase.auth.getSession();
        setSession(!!supaSession);

        const [listingRes, reviewsRes] = await Promise.all([
          fetch(`/api/listings/${slug}`),
          fetch(`/api/listings/${slug}/reviews`),
        ]);
        const listingJson = await listingRes.json();
        if (listingJson.error) throw new Error(listingJson.error);
        setListing(listingJson.data);

        const reviewsJson = await reviewsRes.json();
        setReviews(reviewsJson.data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Listing not found");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleCheckout = async (type: "subscription" | "once") => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listing?.id, type }),
      });
      const json = await res.json();
      if (json.error) {
        if (res.status === 401) {
          router.push(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }
        throw new Error(json.error);
      }
      if (json.data?.url) {
        window.location.href = json.data.url;
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          </div>
        </nav>
        <div className="pt-20 max-w-6xl mx-auto px-6 py-16 animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/2" />
          <div className="h-4 bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-3/4" />
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-2xl font-bold mb-2">Listing not found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href={`/${locale}/marketplace`} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium">
            ← Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const hasMonthly = listing.price_monthly != null;
  const hasOnce = listing.price_once != null;

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLocale("en")} className={`px-2 py-1 rounded transition-colors ${locale === "en" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>EN</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => switchLocale("it")} className={`px-2 py-1 rounded transition-colors ${locale === "it" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}>IT</button>
            </div>
            <Link href={`/${locale}/login`} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium">Sign in</Link>
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

      <div className="pt-20">
        {/* Breadcrumb + Back */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${locale}/marketplace`} className="hover:text-white transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-gray-300">{listing.title}</span>
          </nav>
          <Link
            href={`/${locale}/marketplace`}
            className="inline-flex items-center gap-1 mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            ← Back to Browse
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Listing header */}
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {listing.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={listing.thumbnail_url} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{listing.type === "agent" ? "🤖" : "⚡"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${listing.type === "agent" ? "bg-purple-500/20 text-purple-300 border border-purple-500/20" : "bg-blue-500/20 text-blue-300 border border-blue-500/20"}`}>
                      {listing.type === "agent" ? "Agent" : "Skill"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white">{listing.title}</h1>
                  <p className="text-gray-400 mt-1">{listing.short_desc}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    {listing.avg_rating && (
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={listing.avg_rating} />
                        <span className="text-white font-medium">{listing.avg_rating.toFixed(1)}</span>
                        <span>({reviews.length} reviews)</span>
                      </div>
                    )}
                    {listing.install_count > 0 && (
                      <span>{listing.install_count.toLocaleString()} installs</span>
                    )}
                    {listing.demo_url && (
                      <a href={listing.demo_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        Live demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {listing.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <Link key={tag} href={`/${locale}/marketplace?tag=${tag}`} className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300 border border-white/5 hover:border-purple-500/30 hover:text-white transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-white/10">
                <div className="flex gap-6">
                  {(["overview", "reviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "text-white border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300"}`}
                    >
                      {tab}
                      {tab === "reviews" && reviews.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-800 text-xs">{reviews.length}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "overview" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </div>
                  {listing.docs_url && (
                    <div className="mt-6 p-4 rounded-xl bg-gray-900 border border-white/10">
                      <a href={listing.docs_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium">
                        📚 View documentation ↗
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">⭐</div>
                      <p className="text-gray-400">No reviews yet. Be the first!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="p-5 rounded-xl bg-gray-900 border border-white/5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {review.reviewer?.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={review.reviewer.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-xs font-semibold">
                                {(review.reviewer?.full_name || review.reviewer?.username || "U")[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-white">
                                {review.reviewer?.full_name || review.reviewer?.username || "Anonymous"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        {review.body && <p className="text-gray-300 text-sm leading-relaxed">{review.body}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sidebar — Purchase CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="p-6 rounded-2xl bg-gray-900 border border-white/10 shadow-xl shadow-purple-500/5">
                  <h3 className="text-lg font-semibold mb-4">Get access</h3>

                  {/* Pricing options */}
                  <div className="space-y-3">
                    {hasMonthly && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-purple-300">Subscription</span>
                          <span className="text-xl font-bold text-white">€{listing.price_monthly}<span className="text-sm font-normal text-gray-400">/mo</span></span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Full access, cancel anytime</p>
                        <button
                          onClick={() => handleCheckout("subscription")}
                          disabled={checkoutLoading}
                          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm text-white shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {checkoutLoading ? "Loading..." : "Subscribe →"}
                        </button>
                      </div>
                    )}

                    {hasOnce && (
                      <div className="p-4 rounded-xl bg-gray-800/50 border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-300">One-time</span>
                          <span className="text-xl font-bold text-white">€{listing.price_once}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Lifetime access, no recurring charges</p>
                        <button
                          onClick={() => handleCheckout("once")}
                          disabled={checkoutLoading}
                          className="w-full py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all font-semibold text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {checkoutLoading ? "Loading..." : "Buy once →"}
                        </button>
                      </div>
                    )}

                    {!hasMonthly && !hasOnce && (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                        <span className="text-green-300 font-semibold">Free</span>
                        <button
                          onClick={() => {
                            if (!session) {
                              router.push(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
                              return;
                            }
                            if (listing.download_url) {
                              window.location.href = listing.download_url;
                            } else {
                              alert("Check the docs tab for installation instructions");
                            }
                          }}
                          className="mt-2 w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 transition-all font-semibold text-sm text-white">
                          Get for free →
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Secure checkout via Stripe
                  </p>
                </div>

                {/* Creator card */}
                <div className="p-5 rounded-2xl bg-gray-900 border border-white/10">
                  <h4 className="text-sm text-gray-500 mb-3">Created by</h4>
                  <div className="flex items-center gap-3">
                    {listing.creator.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.creator.avatar_url} alt={listing.creator.full_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-semibold">
                        {(listing.creator.full_name || listing.creator.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{listing.creator.full_name || listing.creator.username}</div>
                      {listing.creator.username && (
                        <div className="text-sm text-gray-400">@{listing.creator.username}</div>
                      )}
                    </div>
                  </div>
                  {listing.creator.bio && (
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed line-clamp-3">{listing.creator.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
