import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPost } from "../posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function renderMarkdown(content: string): string {
  return content
    // h2
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-10 mb-4 text-white">$1</h2>')
    // h3
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3 text-white">$1</h3>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm font-mono text-gray-300">$2</code></pre>'
    )
    // links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // paragraphs (blank-line separated, skip already-tagged lines)
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      return `<p class="text-gray-300 leading-relaxed my-4">${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            AgentPick
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-gray-400">
            <Link href={`/${locale}/marketplace`} className="hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href={`/${locale}/login`} className="hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
          <details className="md:hidden relative">
            <summary className="list-none cursor-pointer text-white text-2xl leading-none select-none">☰</summary>
            <div className="absolute right-0 top-8 bg-gray-900 border border-white/10 rounded-xl shadow-xl py-2 flex flex-col min-w-[160px] z-50">
              <Link href={`/${locale}`} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Home</Link>
              <Link href={`/${locale}/marketplace`} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Marketplace</Link>
              <Link href={`/${locale}/blog`} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Blog</Link>
              <Link href={`/${locale}/login`} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Sign In</Link>
            </div>
          </details>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <time className="block text-xs text-gray-500 uppercase tracking-wide mt-4">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <h1 className="mt-3 text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>

        <hr className="border-gray-800 my-10" />

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
