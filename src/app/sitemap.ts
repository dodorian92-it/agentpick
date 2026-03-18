import { MetadataRoute } from "next";
import { posts } from "@/app/[locale]/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agentpick.co";
  const locales = ["en", "it"];

  const staticRoutes = [
    "",
    "/marketplace",
    "/blog",
    "/pricing",
  ];

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    }))
  );

  const blogEntries = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...blogEntries];
}
