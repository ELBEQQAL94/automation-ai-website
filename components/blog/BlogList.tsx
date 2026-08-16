// components/blog/BlogList.tsx
import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import AuthorByline from "@/components/blog/AuthorByline";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) {
    return <p className="text-lg text-on-surface-variant">No posts published yet - check back soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low transition-colors hover:border-primary/40"
        >
          <div className="relative h-44 w-full shrink-0">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
              unoptimized
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {post.category}
            </span>
            <h2 className="text-xl font-medium text-on-surface group-hover:text-primary">
              {post.title}
            </h2>
            <p className="text-base leading-6 text-on-surface-variant">{post.summary}</p>
            <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-3">
              <AuthorByline author={post.author} size="sm" />
              <span className="text-sm text-on-surface-variant/70">{formatDate(post.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
