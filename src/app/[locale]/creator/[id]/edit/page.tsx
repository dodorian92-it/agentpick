'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface Listing {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  short_desc: string;
  type: 'agent' | 'skill';
  price_monthly: number | null;
  price_once: number | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  demo_url: string | null;
  docs_url: string | null;
}

const TAGS_SUGGESTIONS = [
  'productivity', 'email', 'social', 'marketing', 'analytics', 'data',
  'content', 'seo', 'github', 'slack', 'notion', 'automation', 'research',
];

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default function EditListingPage({ params }: Props) {
  const router = useRouter();

  const [locale, setLocale] = useState('en');
  const [listingId, setListingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [type, setType] = useState<'agent' | 'skill'>('agent');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceOnce, setPriceOnce] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [demoUrl, setDemoUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');

  useEffect(() => {
    params.then(({ locale: l, id }) => {
      setLocale(l);
      setListingId(id);
      loadListing(id, l);
    });
  }, [params]);

  async function loadListing(id: string, loc: string) {
    setLoading(true);
    const supabase = createBrowserClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/${loc}/login?next=/${loc}/creator/${id}/edit`);
      return;
    }

    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) {
      setError(loc === 'it' ? 'Listing non trovato.' : 'Listing not found.');
      setLoading(false);
      return;
    }

    const { data }: { data: Listing } = await res.json();

    if (data.creator_id !== user.id) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }

    setTitle(data.title);
    setDescription(data.description ?? '');
    setShortDesc(data.short_desc ?? '');
    setType(data.type);
    setPriceMonthly(data.price_monthly != null ? String(data.price_monthly) : '');
    setPriceOnce(data.price_once != null ? String(data.price_once) : '');
    setTags(data.tags ?? []);
    setStatus(data.status);
    setDemoUrl(data.demo_url ?? '');
    setDocsUrl(data.docs_url ?? '');
    setLoading(false);
  }

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const body: Record<string, unknown> = {
      title,
      description,
      short_desc: shortDesc,
      type,
      tags,
      status,
      demo_url: demoUrl || null,
      docs_url: docsUrl || null,
      price_monthly: priceMonthly ? parseFloat(priceMonthly) : null,
      price_once: priceOnce ? parseFloat(priceOnce) : null,
    };

    const res = await fetch(`/api/listings/${listingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? (locale === 'it' ? 'Errore nel salvataggio.' : 'Save failed.'));
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const t = {
    title: locale === 'it' ? 'Modifica Listing' : 'Edit Listing',
    back: locale === 'it' ? '← Torna al dashboard' : '← Back to dashboard',
    save: locale === 'it' ? 'Salva modifiche' : 'Save changes',
    saving: locale === 'it' ? 'Salvataggio...' : 'Saving...',
    saved: locale === 'it' ? '✅ Salvato!' : '✅ Saved!',
    unauthorized: locale === 'it'
      ? 'Non hai i permessi per modificare questo listing.'
      : 'You are not authorized to edit this listing.',
    labelTitle: locale === 'it' ? 'Titolo' : 'Title',
    labelShortDesc: locale === 'it' ? 'Descrizione breve' : 'Short description',
    labelDescription: locale === 'it' ? 'Descrizione completa' : 'Full description',
    labelType: locale === 'it' ? 'Tipo' : 'Type',
    labelPriceMonthly: locale === 'it' ? 'Prezzo mensile (€)' : 'Monthly price (€)',
    labelPriceOnce: locale === 'it' ? 'Prezzo una tantum (€)' : 'One-time price (€)',
    labelTags: locale === 'it' ? 'Tag' : 'Tags',
    labelStatus: locale === 'it' ? 'Stato' : 'Status',
    labelDemoUrl: locale === 'it' ? 'URL demo' : 'Demo URL',
    labelDocsUrl: locale === 'it' ? 'URL documentazione' : 'Docs URL',
    addTag: locale === 'it' ? 'Aggiungi' : 'Add',
    tagPlaceholder: locale === 'it' ? 'es. produttività' : 'e.g. productivity',
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">
          {locale === 'it' ? 'Caricamento...' : 'Loading...'}
        </div>
      </main>
    );
  }

  if (unauthorized) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{t.unauthorized}</p>
          <Link href={`/${locale}/dashboard`} className="text-blue-400 hover:text-blue-300 text-sm">
            {t.back}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/${locale}/dashboard`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            {t.back}
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-8">{t.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelTitle}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
            />
          </div>

          {/* Short desc */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelShortDesc}</label>
            <input
              type="text"
              maxLength={160}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
            />
            <p className="text-xs text-gray-600 mt-1">{shortDesc.length}/160</p>
          </div>

          {/* Full description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelDescription}</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 resize-y"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelType}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'agent' | 'skill')}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="agent">Agent</option>
              <option value="skill">Skill</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelPriceMonthly}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
                placeholder="9.99"
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelPriceOnce}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceOnce}
                onChange={(e) => setPriceOnce(e.target.value)}
                placeholder="29.00"
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.labelTags}</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-400 hover:text-red-400 transition-colors ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
                }}
                placeholder={t.tagPlaceholder}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
              >
                {t.addTag}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TAGS_SUGGESTIONS.filter((s) => !tags.includes(s)).slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="px-2 py-0.5 text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-full transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelStatus}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">{locale === 'it' ? 'Bozza' : 'Draft'}</option>
              <option value="published">{locale === 'it' ? 'Pubblicato' : 'Published'}</option>
              <option value="archived">{locale === 'it' ? 'Archiviato' : 'Archived'}</option>
            </select>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelDemoUrl}</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t.labelDocsUrl}</label>
              <input
                type="url"
                value={docsUrl}
                onChange={(e) => setDocsUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? t.saving : t.save}
            </button>
            {success && <span className="text-green-400 text-sm">{t.saved}</span>}
            <Link
              href={`/${locale}/dashboard`}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors ml-auto"
            >
              {locale === 'it' ? 'Annulla' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
