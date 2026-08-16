// lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  coverImageAlt: string;
  summary: string;
  category: string;
  author: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function readPostFile(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

function toMeta(slug: string, data: matter.GrayMatterFile<string>["data"]): BlogPostMeta {
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    coverImage: data.coverImage,
    coverImageAlt: data.coverImageAlt,
    summary: data.summary,
    category: data.category,
    author: data.author,
  };
}

function isPublished(date: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return date <= today;
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => isPublished(readPostFile(slug).data.date));
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllSlugs()
    .map((slug) => toMeta(slug, readPostFile(slug).data))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!getAllSlugs().includes(slug)) return null;
  const { data, content } = readPostFile(slug);
  return { ...toMeta(slug, data), content };
}

export function getRelatedPosts(slug: string, count = 3): BlogPostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const others = getAllPosts().filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);
  const related = sameCategory.slice(0, count);

  if (related.length < count) {
    const chosenSlugs = new Set(related.map((post) => post.slug));
    const backfill = others.filter((post) => !chosenSlugs.has(post.slug));
    related.push(...backfill.slice(0, count - related.length));
  }

  return related;
}
