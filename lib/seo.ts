// lib/seo.ts
import type { Metadata } from "next";

export const SITE_URL = "https://www.automatoro.com";

export const LINKEDIN_URL = "https://www.linkedin.com/company/automatoro/posts/?feedView=all";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Automatoro - AI-Powered Process Automation",
};

/**
 * Next.js does not deep-merge `openGraph`/`twitter` across route segments: a page that
 * declares its own `openGraph` object entirely replaces the root layout's (including the
 * image inherited from app/opengraph-image.tsx), leaving the page with no share image.
 * Building metadata through this helper keeps every page's image explicit.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
