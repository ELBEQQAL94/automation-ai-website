// app/blog/page.tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/blog/BlogList";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Ideas on process automation, workflow design, and cutting manual busywork for growing teams.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-on-surface sm:text-5xl">
          Blog
        </h1>
        <p className="text-lg leading-8 text-on-surface-variant">
          Ideas on process automation, workflow design, and cutting manual busywork for
          growing teams.
        </p>
      </div>

      <BlogList posts={posts} />
    </main>
  );
}
