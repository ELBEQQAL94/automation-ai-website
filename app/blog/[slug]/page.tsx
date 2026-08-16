// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import FaqSection from "@/components/shared/FaqSection";
import AuthorByline from "@/components/blog/AuthorByline";
import { SITE_URL } from "@/lib/seo";

const mdxComponents = {
  FaqSection,
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mb-4 mt-10 text-2xl font-semibold text-on-surface" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold text-on-surface" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-5 text-lg leading-8 text-on-surface-variant" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-lg leading-8 text-on-surface-variant" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-lg leading-8 text-on-surface-variant" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="font-medium text-primary underline hover:opacity-80" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-on-surface" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="mb-5 border-l-2 border-primary pl-4 italic text-on-surface-variant" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-sm text-on-surface" {...props} />
  ),
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Automatoro",
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <main className="flex w-full max-w-3xl flex-col px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
      <article>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mb-4">
          <AuthorByline author={post.author} date={formatDate(post.date)} linkable />
        </div>
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-on-surface">
          {post.title}
        </h1>

        <div className="mb-8 rounded-xl border border-primary/30 bg-surface-container-low p-5">
          <p className="mb-1 text-sm font-semibold text-primary">TL;DR</p>
          <p className="text-on-surface-variant">{post.summary}</p>
        </div>

        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-xl border border-outline-variant/30 sm:h-96">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            unoptimized
          />
        </div>

        <div>
          <MDXRemote source={post.content} components={mdxComponents} options={{ blockJS: false }} />
        </div>
      </article>
    </main>
  );
}
