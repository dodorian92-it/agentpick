import Link from "next/link";
import { posts } from "./posts";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href={`/${locale}/marketplace`} className="hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href={`/${locale}/blog`} className="text-white">
              Blog
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-3">Blog</h1>
        <p className="text-gray-400 mb-12">Guides, updates, and ideas from the AgentPick team.</p>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <time className="text-xs text-gray-500 uppercase tracking-wide">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-2 text-2xl font-semibold">
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="hover:text-gray-300 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-gray-400 leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
