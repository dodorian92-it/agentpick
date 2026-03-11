"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const TAGS_SUGGESTIONS = ["productivity", "coding", "writing", "research", "automation", "data", "marketing", "customer-support"];

export default function CreatorNewPage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [form, setForm] = useState({
    title: "",
    description: "",
    short_desc: "",
    type: "agent" as "agent" | "skill",
    price_monthly: "",
    price_once: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const body = {
        title: form.title,
        description: form.description,
        short_desc: form.short_desc || undefined,
        type: form.type,
        price_monthly: form.price_monthly ? parseFloat(form.price_monthly) : null,
        price_once: form.price_once ? parseFloat(form.price_once) : null,
        tags: form.tags,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        router.replace(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create listing");

      router.push(`/${locale}/creator/${json.data.id}/edit?created=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

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
            <Link href={`/${locale}/creator`} className="text-sm text-gray-400 hover:text-white transition-colors">← Creator Studio</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-2xl mx-auto px-6 pb-16">
        <div className="py-10 border-b border-white/5">
          <h1 className="text-3xl font-bold text-white">New Listing</h1>
          <p className="text-gray-400 mt-1">Create a new agent or skill for the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="py-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <div className="flex gap-3">
              {(["agent", "skill"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all capitalize ${form.type === t ? "bg-purple-600/30 border-purple-500 text-purple-300" : "bg-gray-900 border-white/10 text-gray-400 hover:border-white/20"}`}
                >
                  {t === "agent" ? "🤖" : "⚡"} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="e.g. Code Review Agent"
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Short description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Short description</label>
            <input
              type="text"
              value={form.short_desc}
              onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))}
              maxLength={160}
              placeholder="One-line summary shown in listing cards"
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description <span className="text-red-400">*</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              rows={6}
              placeholder="Full description of your agent or skill. Markdown supported."
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Monthly price (€)</label>
              <input
                type="number"
                value={form.price_monthly}
                onChange={e => setForm(f => ({ ...f, price_monthly: e.target.value }))}
                min="0"
                step="0.01"
                placeholder="e.g. 9.99"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">One-time price (€)</label>
              <input
                type="number"
                value={form.price_once}
                onChange={e => setForm(f => ({ ...f, price_once: e.target.value }))}
                min="0"
                step="0.01"
                placeholder="e.g. 29.99"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/20">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                placeholder="Type a tag and press Enter"
                className="flex-1 px-4 py-2 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
              <button type="button" onClick={() => addTag(tagInput)} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TAGS_SUGGESTIONS.filter(t => !form.tags.includes(t)).map(tag => (
                <button key={tag} type="button" onClick={() => addTag(tag)} className="px-2 py-0.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors">
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href={`/${locale}/creator`}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create listing"}
            </button>
          </div>
        </form>
      </div>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <Link href={`/${locale}`} className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <span>© {new Date().getFullYear()} AgentPick. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
