import { readFile } from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ locale: string }> };

async function getLegalContent(locale: string): Promise<string> {
  const filename = `terms-of-service.${locale}.md`;
  const filePath = path.join(process.cwd(), 'content', 'legal', filename);
  try {
    return await readFile(filePath, 'utf-8');
  } catch {
    const fallbackPath = path.join(process.cwd(), 'content', 'legal', 'terms-of-service.en.md');
    try {
      return await readFile(fallbackPath, 'utf-8');
    } catch {
      return '';
    }
  }
}

export default async function TermsPage({ params }: Params) {
  const { locale } = await params;
  const content = await getLegalContent(locale);

  if (!content) notFound();

  const title = locale === 'it' ? 'Termini di Servizio' : 'Terms of Service';

  return (
    <main className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a
            href={`/${locale}`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← {locale === 'it' ? 'Torna alla home' : 'Back to home'}
          </a>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
