import { readFileSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supported = ["en", "it"];
  if (!supported.includes(locale)) notFound();

  const filePath = join(
    process.cwd(),
    "..",
    "agentpick-legal",
    `terms-of-service.${locale}.md`
  );

  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-invert prose-purple max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-gray-500 flex gap-6">
          <a href={`/${locale}/privacy`} className="hover:text-purple-400 transition-colors">
            {locale === "it" ? "Privacy Policy" : "Privacy Policy"}
          </a>
          <a href={`/${locale}/cookies`} className="hover:text-purple-400 transition-colors">
            Cookie Policy
          </a>
          <a href={`/${locale}`} className="hover:text-purple-400 transition-colors">
            ← {locale === "it" ? "Torna alla home" : "Back to home"}
          </a>
        </div>
      </div>
    </main>
  );
}
