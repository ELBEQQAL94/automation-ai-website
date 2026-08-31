// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.automatoro.com";

const STATIC_ROUTE_CONFIG: Record<
  string,
  { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
> = {
  "": { changeFrequency: "weekly", priority: 1 },
  "/services": { changeFrequency: "monthly", priority: 0.8 },
  "/about": { changeFrequency: "monthly", priority: 0.6 },
  "/contact": { changeFrequency: "yearly", priority: 0.5 },
  "/blog": { changeFrequency: "daily", priority: 0.9 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = Object.entries(STATIC_ROUTE_CONFIG).map(([route, config]) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: config.changeFrequency,
    priority: config.priority,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
