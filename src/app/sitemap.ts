import { MetadataRoute } from 'next';

const BASE_URL = 'https://agentpick.co';
const locales = ['en', 'it'];

const routes = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/marketplace', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/blog', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/creator', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    routes.map(({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );
}
