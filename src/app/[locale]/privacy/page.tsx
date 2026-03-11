import { readFile } from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ locale: string }> };

async function getLegalContent(locale: string): Promise<string> {
  const filename = `privacy-policy.${locale}.md`;
  const filePath = path.join(process.cwd(), '..', 'agentpick-legal', filename);
  try {
    return await readFile(filePath, 'utf-8');
  } catch {
    // Fallback to EN
    const fallbackPath = path.join(process.cwd(), '..', 'agentpick-legal', 'privacy-policy.en.md');
    try {
      return await readFile(fallbackPath, 'utf-8');
    } catch {
      return '';
    }
  }
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mb-6 mt-8">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-8">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-gray-200 mb-2 mt-6">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-100">$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 text-gray-400 italic my-4">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-gray-700 my-6" />')
    .replace(/^- (.+)$/gm, '<li class="text-gray-300 ml-4 list-disc mb-1">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-gray-300 ml-4 list-decimal mb-1">$2</li>')
    .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">')
    .replace(/^(?!<[h|b|l|h|p])/gm, '');
}

export default async function PrivacyPage({ params }: Params) {
  const { locale } = await params;
  const content = await getLegalContent(locale);

  if (!content) notFound();

  const title = locale === 'it' ? 'Informativa sulla Privacy' : 'Privacy Policy';

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
