import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";
import Link from "next/link";

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const filePath = join(process.cwd(), "..", ".openclaw/workspace/agentpick-legal", `cookie-policy.${locale}.md`);
  
  let html = "";
  try {
    const md = readFileSync(filePath, "utf-8");
    html = await marked(md);
  } catch {
    html = "<p>Cookie policy not available.</p>";
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <Link href={`/${locale}/marketplace`} className="text-sm text-gray-400 hover:text-white transition-colors">Marketplace</Link>
        </div>
      </nav>

      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        <div
          className="prose prose-invert prose-headings:text-white prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-table:text-sm prose-th:text-gray-300 prose-td:text-gray-400 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <Link href={`/${locale}`} className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AgentPick</Link>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href={`/${locale}/cookies`} className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
          <span>© {new Date().getFullYear()} AgentPick. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
