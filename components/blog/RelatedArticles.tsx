// components/blog/RelatedArticles.tsx
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

export default function RelatedArticles({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-outline-variant/30 pt-10">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-on-surface">
        Related articles
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 transition-colors hover:border-primary/40"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {post.category}
            </span>
            <span className="text-base font-medium text-on-surface group-hover:text-primary">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
