import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import CookieBanner from '@/components/CookieBanner';

const BASE_URL = 'https://agentpick.co';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = 'AgentPick — The AI Agent Marketplace You Can Actually Trust';
  const description =
    'Curated skills and agents for OpenClaw, Claude Code, and beyond. Every listing is reviewed, tested, and kept up-to-date — or your money back.';
  const url = `${BASE_URL}/${locale}`;
  const ogLocale = locale === 'it' ? 'it_IT' : 'en_US';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AgentPick',
      images: [
        {
          url: 'https://agentpick.co/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AgentPick — The AI Agent Marketplace',
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://agentpick.co/og-image.png'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as 'en' | 'it')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
