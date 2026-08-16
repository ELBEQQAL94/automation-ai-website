# Automatoro SEO Foundation + Content Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: use executing-plans skill to implement this plan task-by-task.

**Goal:** Turn automation-ai-website from a single anchor-link page into a
multi-route, fully indexable site with metadata, JSON-LD, sitemap/robots, an
MDX blog pipeline (2 posts/day cadence), and llms.txt/llms-full.txt - matching
the SEO maturity of the money-flow-web reference implementation.

**Architecture:** Extract the current one-pager's header/footer into shared
layout components, split `/services`, `/about`, `/contact` into real routes,
add a `lib/seo.ts` metadata helper + `lib/blog.ts` MDX content pipeline (same
shape as money-flow-web's), wire JSON-LD (`Organization`/`WebSite` site-wide,
`ProfessionalService` on `/services`, `Article` per post), and ship the first
two blog posts to prove the pipeline end to end.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, `gray-matter`,
`next-mdx-remote/rsc`, `sharp` (webp conversion), `next/og` `ImageResponse`.

**Working directory for every task below:**
`/Users/youssefelbeqqal/Desktop/workspace/learning-ai/automation-ai-website`

**Project rule (per this project's memory / established habit):** never run
`npm install`, `npm run dev`, `npm run lint`, `npm run build`, or `tsc`
automatically. Each verification step below states the exact command - present
it to the engineer and wait for them to run it and share the output.

---

### Task 1: Install dependencies

**Files:**

- Modify: `package.json`

**Step 1: Add the blog/OG dependencies**

Ask the engineer to run:

```bash
npm install gray-matter next-mdx-remote
npm install --save-dev sharp
```

This adds `gray-matter` (frontmatter parsing), `next-mdx-remote` (MDX
rendering in `app/blog/[slug]/page.tsx`), and `sharp` (used by
`scripts/convert-to-webp.mjs`, added in Task 16).

**Step 2: Verify**

```bash
cat package.json
```

Expected: `gray-matter` and `next-mdx-remote` under `dependencies`, `sharp`
under `devDependencies`.

---

### Task 2: Add the metadata helper (`lib/seo.ts`)

**Files:**

- Create: `lib/seo.ts`

**Step 1: Implement**

```ts
// lib/seo.ts
import type { Metadata } from "next";

export const SITE_URL = "https://www.automatoro.com";

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
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `lib/seo.ts` (other errors from files not yet
created in later tasks are expected at this point and will clear as you
proceed).

---

### Task 3: Add the blog content pipeline (`lib/blog.ts`)

**Files:**

- Create: `lib/blog.ts`

**Step 1: Implement**

```ts
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
```

**Step 2: Verify**

```bash
mkdir -p content/blog
npx tsc --noEmit
```

Expected: `content/blog` directory exists (empty for now - Task 16 adds the
first posts), no new type errors from `lib/blog.ts`.

---

### Task 4: Add the site-wide dynamic OG image

**Files:**

- Create: `app/opengraph-image.tsx`

**Step 1: Implement**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Automatoro - AI-Powered Process Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #131313 0%, #1c1b1b 100%)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            marginBottom: 32,
            background: "linear-gradient(135deg, #10b981 0%, #4edea3 100%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#e5e2e1" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#bbcabf", marginTop: 12 }}>
          Eliminate manual busywork. Automatically.
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors from `app/opengraph-image.tsx`.

---

### Task 5: Add `robots.ts` and `sitemap.ts`

**Files:**

- Create: `app/robots.ts`
- Create: `app/sitemap.ts`

**Step 1: Implement robots.ts**

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.automatoro.com/sitemap.xml",
  };
}
```

**Step 2: Implement sitemap.ts**

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.automatoro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/about", "/contact", "/blog"].map((route) => ({
    url: `${BASE_URL}${route}`,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...postRoutes];
}
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors from either file (relies on `lib/blog.ts` from Task 3).

---

### Task 6: Extract shared Header and Footer components

**Files:**

- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

**Step 1: Implement Header.tsx**

Extracted from the current `app/page.tsx` header, with nav links pointed at
the new routes instead of same-page anchors, and the demo link kept external.

```tsx
// components/layout/Header.tsx
import Link from "next/link";
import { BotIcon } from "@/app/icons";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <BotIcon className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-on-surface">Automatoro</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-primary-container px-5 py-2 text-base font-bold text-on-primary-container transition-opacity hover:opacity-90"
        >
          Talk to an expert
        </Link>
      </div>
    </header>
  );
}
```

**Step 2: Implement Footer.tsx**

```tsx
// components/layout/Footer.tsx
import Link from "next/link";
import { BotIcon } from "@/app/icons";

const DEMO_LINK = "https://task-router-pi.vercel.app/";

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/40 bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-10 sm:px-8 md:flex-row md:justify-between lg:px-12">
        <div className="flex items-center gap-2">
          <BotIcon className="h-6 w-6 text-primary" />
          <span className="font-mono text-base font-bold text-on-surface">Automatoro</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-base text-secondary">
          <Link href="/services" className="transition-colors hover:text-on-surface hover:underline">
            Services
          </Link>
          <Link href="/blog" className="transition-colors hover:text-on-surface hover:underline">
            Blog
          </Link>
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-on-surface hover:underline"
          >
            Task Router Demo
          </a>
          <Link href="/contact" className="transition-colors hover:text-on-surface hover:underline">
            Contact
          </Link>
        </div>
        <p className="text-base text-secondary">© 2026 Automatoro. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors from either component (the `page.tsx` still has its own
inline header/footer until Task 8 - that's fine, both can exist until then).

---

### Task 7: Wire Header/Footer + Organization/WebSite JSON-LD into the root layout

**Files:**

- Modify: `app/layout.tsx`

**Step 1: Implement**

Replace the full file with:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-59ZK4N2LQY";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Automatoro | Eliminate Manual Busywork",
    template: "%s | Automatoro",
  },
  description:
    "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
  openGraph: {
    title: "Automatoro | Eliminate Manual Busywork",
    description:
      "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
    type: "website",
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automatoro | Eliminate Manual Busywork",
    description:
      "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Automatoro",
  url: SITE_URL,
  email: "elbeqqal.youssef@gmail.com",
  description:
    "Automatoro is an AI-powered process automation service that connects the tools teams already use, cuts manual busywork, and keeps a human in control of every important decision.",
  founder: {
    "@type": "Person",
    name: "Youssef Elbeqqal",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Automatoro",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Automatoro Blog"
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-full flex-1 flex-col items-center bg-background">
          <Header />
          {children}
          <Footer />
        </div>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
```

Note: this keeps the Google Analytics snippet already added, just relocated
verbatim into the rewritten file.

**Step 2: Verify**

```bash
npx tsc --noEmit
```

Expected: no type errors from `app/layout.tsx`.

---

### Task 8: Trim the homepage to Hero/Problem/Solution-teaser/Benefits/Demo CTA

**Files:**

- Modify: `app/page.tsx`

**Step 1: Implement**

Replace the full file with (removes the inline header/footer - now provided
by the layout - and the `#solution`/`#contact` sections, which move to
`/services` and `/contact`; adds a short "How it works" teaser linking to
`/services`, and a metadata export):

```tsx
// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { HeroDiagram } from "./hero-diagram";
import {
  AlertTriangleIcon,
  ChecklistIcon,
  ClockIcon,
  CloudSyncIcon,
  GaugeIcon,
  SparkleIcon,
  TrendingUpIcon,
  UnlockIcon,
  UserMinusIcon,
} from "./icons";
import { buildPageMetadata } from "@/lib/seo";

const DEMO_LINK = "https://task-router-pi.vercel.app/";

export const metadata: Metadata = buildPageMetadata({
  title: "Automatoro | Eliminate Manual Busywork",
  description:
    "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
  path: "/",
});

const problems = [
  {
    icon: ClockIcon,
    title: "Manual Busywork",
    body: "Data entry shouldn't be your team's full-time job. Reclaim their focus for high-value work.",
  },
  {
    icon: AlertTriangleIcon,
    title: "Cracks in the System",
    body: "Human error leads to missed deadlines and dropped tasks. Automation keeps handoffs consistent.",
  },
  {
    icon: UserMinusIcon,
    title: "The Hiring Trap",
    body: "Don't solve process problems with more headcount. Scale output without inflating payroll.",
  },
];

const benefits = [
  {
    icon: GaugeIcon,
    title: "Hours back every week",
    body: "Reclaim time lost to repetitive document handling and data entry, redirected toward client work.",
  },
  {
    icon: TrendingUpIcon,
    title: "Scales without headcount",
    body: "Take on more volume without adding staff - the coordination overhead stops scaling linearly.",
  },
  {
    icon: UnlockIcon,
    title: "You keep full control",
    body: "Every automated workflow waits for your approval before anything client-facing goes out.",
  },
  {
    icon: SparkleIcon,
    title: "Zero process overhaul",
    body: "Go live with no disruption. We work in the background of the tools you already use.",
  },
];

export default function Home() {
  return (
    <main className="flex w-full max-w-5xl flex-col gap-20 px-6 py-16 sm:gap-24 sm:px-8 sm:py-24 lg:px-12">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary sm:text-sm">
            B2B Process Automation
          </span>
          <h1 className="mb-5 text-4xl font-semibold leading-[1.1] tracking-tight text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">
            Eliminate manual busywork. <span className="text-primary">Automatically.</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg leading-8 text-on-surface-variant sm:text-xl sm:leading-9">
            Connect your tools, automate the retyping, and scale your ops without adding
            headcount. Our tailored AI workflows do the heavy lifting for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02] active:scale-95"
            >
              See it in action
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-outline-variant px-8 py-4 text-lg font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Talk to an expert
            </Link>
          </div>
        </div>
        <div className="relative rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6">
          <HeroDiagram />
        </div>
      </section>

      {/* Problem */}
      <section className="flex flex-col gap-10">
        <div>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary sm:text-sm">
            The Challenge
          </h2>
          <h3 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
            Stop throwing people at process problems.
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-outline-variant/30 p-6 transition-colors hover:bg-surface-container-low sm:p-8"
            >
              <item.icon className="mb-4 h-8 w-8 text-on-surface-variant transition-colors group-hover:text-primary" />
              <h4 className="mb-2 text-xl font-medium text-on-surface">{item.title}</h4>
              <p className="text-lg leading-7 text-on-surface-variant">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution teaser */}
      <section className="flex flex-col items-center gap-6 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8 text-center sm:p-12">
        <ChecklistIcon className="h-10 w-10 text-primary" />
        <h3 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          Enterprise-grade automation made simple.
        </h3>
        <p className="max-w-xl text-lg leading-8 text-on-surface-variant">
          Deep tool integrations, a human-in-the-loop approval step on every workflow, and
          automations built around how your team already works - not the other way around.
        </p>
        <Link
          href="/services"
          className="font-medium text-primary underline hover:opacity-80"
        >
          See the full framework
        </Link>
      </section>

      {/* Benefits */}
      <section className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {benefits.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-highest sm:h-14 sm:w-14">
                <item.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <div>
                <h4 className="mb-1 text-xl font-medium text-on-surface">{item.title}</h4>
                <p className="text-lg leading-7 text-on-surface-variant">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container p-8 text-center sm:p-12 md:p-16 lg:p-20">
        <h2 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
          Ready to see how it works?
        </h2>
        <p className="max-w-xl text-lg leading-8 text-on-surface-variant sm:text-xl">
          See Automatoro in action with Task Router - a live example of a multi-step
          automation with a human approval step built in.
        </p>
        <a
          href={DEMO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full bg-primary-container px-10 py-4 text-lg font-medium text-on-primary-container shadow-lg transition-transform hover:scale-[1.02]"
        >
          View the demo
        </a>
      </section>
    </main>
  );
}
```

Note: `ContactForm` import is unused in the trimmed homepage - it moves to
`app/contact/page.tsx` in Task 11. Remove the now-unused
`import { ContactForm } from "./contact-form";` line if your editor flags it
(it's omitted from the file above already).

**Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors. Lint may flag unused icon imports (`BotIcon`,
`PlugIcon`, `DatabaseIcon`) that moved to `/services` - that's expected until
Task 9 is done.

---

### Task 9: Add `/services` page

**Files:**

- Create: `app/services/page.tsx`

**Step 1: Implement**

```tsx
// app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChecklistIcon,
  CloudSyncIcon,
  DatabaseIcon,
  PlugIcon,
} from "@/app/icons";
import { buildPageMetadata } from "@/lib/seo";
import FaqSection from "@/components/shared/FaqSection";

const faqs = [
  {
    question: "What tools does Automatoro integrate with?",
    answer:
      "ClickUp, Airtable, and most tools with an API or an existing Zapier/Make connection. If your stack isn't listed, tell us on the discovery call - most integrations are custom-built anyway.",
  },
  {
    question: "Do I need to change how my team works?",
    answer:
      "No. Automations are built around your existing workflow, not the other way around - we adapt to your process instead of asking you to adopt a new tool.",
  },
  {
    question: "What does \"human-in-the-loop\" mean?",
    answer:
      "Every automated workflow pauses for your approval before anything client-facing goes out. Nothing ships without a human sign-off.",
  },
  {
    question: "How long does it take to go live?",
    answer:
      "It depends on scope - a single integration often ships in days, while a multi-step workflow takes longer. Timeline gets scoped on the discovery call once we know your process.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Automation Services | Tool Integration & Human-in-the-Loop Workflows",
  description:
    "Deep tool integrations, human-in-the-loop workflow automation, and custom adapters built around how your team already works. See the framework.",
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Automatoro",
    url: "https://www.automatoro.com/services",
    description:
      "Automation services covering tool integration, human-in-the-loop workflow automation, and custom workflow adapters for B2B teams.",
    provider: {
      "@type": "Organization",
      name: "Automatoro",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tool Integration & Data Sync",
            description:
              "Deep integrations with ClickUp, Airtable, and your existing stack, bridging siloed data pools.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Human-in-the-Loop Workflow Automation",
            description:
              "Automated workflows with a built-in approval step, so a human signs off before anything client-facing goes out.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Workflow Adapters",
            description:
              "Automations built around your existing process instead of asking your team to adopt new tools.",
          },
        },
      ],
    },
  };

  return (
    <main className="flex w-full max-w-5xl flex-col gap-16 px-6 py-16 sm:gap-20 sm:px-8 sm:py-24 lg:px-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-on-surface sm:text-5xl">
          Enterprise-grade automation made simple.
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-on-surface-variant sm:text-xl">
          Three principles guide every workflow Automatoro builds: connect to the tools you
          already use, keep a human in control of anything that matters, and fit into your
          process instead of forcing you into ours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-8 md:col-span-7 md:p-10">
          <div>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary sm:text-sm">
              Integrations
            </span>
            <h2 className="mb-4 text-2xl font-medium text-on-surface">Tool Connectivity</h2>
            <p className="max-w-md text-lg leading-7 text-on-surface-variant">
              Deep integrations with ClickUp, Airtable, and your existing stack. We bridge the
              gap between siloed data pools effortlessly.
            </p>
          </div>
          <div className="mt-8 flex gap-4 text-on-surface-variant/50">
            <CloudSyncIcon className="h-8 w-8" />
            <DatabaseIcon className="h-8 w-8" />
            <PlugIcon className="h-8 w-8" />
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-2xl bg-primary-container p-6 text-on-primary-container sm:p-8 md:col-span-5 md:p-10">
          <ChecklistIcon className="mb-6 h-10 w-10" />
          <h2 className="mb-4 text-2xl font-medium">Human-in-the-Loop</h2>
          <p className="text-lg leading-7 opacity-90">
            Automation with an approval step. You keep full control while AI handles the
            mundane pre-processing.
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-8 md:col-span-12 md:flex-row md:p-10">
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-medium text-on-surface">Seamless Fit</h2>
            <p className="text-lg leading-7 text-on-surface-variant">
              We adapt to your workflows, not the other way around. We build custom adapters
              for the unique way you do business.
            </p>
          </div>
        </div>
      </div>

      <FaqSection faqs={faqs} />

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold text-on-surface sm:text-3xl">
          Ready to map your process?
        </h2>
        <Link
          href="/contact"
          className="mt-2 rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02]"
        >
          Talk to an expert
        </Link>
      </div>
    </main>
  );
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors (this restores the `PlugIcon`/`DatabaseIcon`/`ChecklistIcon`/`CloudSyncIcon`
usage removed from the homepage in Task 8; relies on `FaqSection` from Task 12
- if you're executing tasks in order, create Task 12's `FaqSection` first or
expect an import error here until then).

---

### Task 10: Add `/about` page

**Files:**

- Create: `app/about/page.tsx`

**Step 1: Implement**

```tsx
// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Automatoro",
  description:
    "Automatoro is a hands-on automation service run by Youssef Elbeqqal - no account managers, no handoffs, direct access to whoever is building your workflow.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:py-24 lg:px-12">
      <div>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-on-surface sm:text-5xl">
          About Automatoro
        </h1>
        <p className="text-lg leading-8 text-on-surface-variant">
          Automatoro is a hands-on automation service, built and run by Youssef Elbeqqal. It
          started from a simple observation: most growing teams don't have a technology
          problem, they have a repetition problem - the same manual handoffs, retyped into
          three different tools, every single day.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-medium text-on-surface">Why this exists</h2>
        <p className="text-lg leading-7 text-on-surface-variant">
          Most automation advice defaults to one of two extremes: hire more people to absorb
          the busywork, or hand everything to a fully autonomous AI and hope for the best.
          Neither actually fixes the process. Automatoro builds the middle path - workflows
          that do the repetitive work, and a human who still approves anything that touches a
          client or a decision that matters.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-medium text-on-surface">How I work</h2>
        <p className="text-lg leading-7 text-on-surface-variant">
          Automatoro is early-stage and intentionally small - no account managers, no
          handoffs between sales and delivery. You talk to the person who scopes your
          workflow and builds it, from the first call through to it running in production.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-medium text-on-surface">What I build</h2>
        <p className="text-lg leading-7 text-on-surface-variant">
          Integrations between the tools you already use, human-in-the-loop automations that
          pause for your approval before anything ships, and custom workflow adapters for
          the specific way your team operates.{" "}
          <Link href="/services" className="font-medium text-primary underline hover:opacity-80">
            See the full framework
          </Link>
          .
        </p>
      </section>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8 text-center">
        <p className="mb-4 text-lg text-on-surface-variant">
          Have a process worth automating?
        </p>
        <Link
          href="/contact"
          className="rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02]"
        >
          Talk to an expert
        </Link>
      </div>
    </main>
  );
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors.

---

### Task 11: Add `/contact` page

**Files:**

- Create: `app/contact/page.tsx`
- Modify: `app/page.tsx` (already trimmed in Task 8 - no `#contact` section
  remains; nothing further to change here)

**Step 1: Implement**

```tsx
// app/contact/page.tsx
import type { Metadata } from "next";
import { ContactForm } from "@/app/contact-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Automatoro",
  description:
    "Tell us about your workflow and we'll get back to you shortly. No account managers, no handoffs - direct access to whoever builds your automation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-16 sm:py-24 lg:px-12">
      <div className="text-center">
        <h1 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary sm:text-sm">
          Get in touch
        </h1>
        <h2 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          Talk to an expert.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-on-surface-variant">
          Tell us about your workflow and we&apos;ll get back to you shortly.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors. `app/contact-form.tsx` already exports `ContactForm`
unchanged - no edits needed there.

---

### Task 12: Port `FaqSection` and add `BlogList`

**Files:**

- Create: `components/shared/FaqSection.tsx`
- Create: `components/blog/BlogList.tsx`

**Step 1: Implement FaqSection.tsx**

Ported from money-flow-web, colors adapted to this project's design tokens
(`on-surface` / `on-surface-variant` / `outline-variant` / `surface-container-low`
instead of `foreground` / `gray-text` / `border` / `surface`).

```tsx
// components/shared/FaqSection.tsx
export type Faq = {
  question: string;
  answer: string;
};

export default function FaqSection({
  faqs,
  heading = "Frequently asked questions",
}: {
  faqs: Faq[];
  heading?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="mb-6 text-2xl font-medium text-on-surface">{heading}</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5"
          >
            <h3 className="mb-1 font-semibold text-primary">{faq.question}</h3>
            <p className="text-sm leading-6 text-on-surface-variant">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Implement BlogList.tsx**

No pagination for now (YAGNI - fewer than 10 posts at launch; revisit once
the archive grows past a page).

```tsx
// components/blog/BlogList.tsx
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

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
          className="group flex flex-col gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 transition-colors hover:border-primary/40"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {post.category}
          </span>
          <h2 className="text-xl font-medium text-on-surface group-hover:text-primary">
            {post.title}
          </h2>
          <p className="text-base leading-6 text-on-surface-variant">{post.summary}</p>
          <span className="text-sm text-on-surface-variant/70">{formatDate(post.date)}</span>
        </Link>
      ))}
    </div>
  );
}
```

**Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors.

---

### Task 13: Add the blog index page

**Files:**

- Create: `app/blog/page.tsx`
- Create: `app/blog/opengraph-image.tsx`

**Step 1: Implement app/blog/page.tsx**

```tsx
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
```

**Step 2: Implement app/blog/opengraph-image.tsx**

```tsx
// app/blog/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Automatoro Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #131313 0%, #1c1b1b 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#10b981" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#e5e2e1" }}>
          Blog
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors.

---

### Task 14: Add the blog post page

**Files:**

- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/[slug]/opengraph-image.tsx`

**Step 1: Implement app/blog/[slug]/page.tsx**

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import FaqSection from "@/components/shared/FaqSection";
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

        <p className="mb-4 text-sm text-on-surface-variant">
          {post.author} &middot; {formatDate(post.date)}
        </p>
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
```

**Step 2: Implement app/blog/[slug]/opengraph-image.tsx**

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export const alt = "Automatoro Blog Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Automatoro Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #131313 0%, #1c1b1b 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#10b981" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#e5e2e1", lineHeight: 1.2 }}>
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors (relies on at least one post existing in `content/blog` -
added in Task 16 - `generateStaticParams` returns an empty array until then,
which is fine for type checking).

---

### Task 15: Add the RSS feed route

**Files:**

- Create: `app/feed.xml/route.ts`

**Step 1: Implement**

```ts
// app/feed.xml/route.ts
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Automatoro Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Ideas on process automation, workflow design, and cutting manual busywork for growing teams.</description>
    <language>en-US</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 16: Add cover image placeholder, the webp conversion script, and the first two blog posts

**Files:**

- Create: `public/blog/placeholder.svg`
- Create: `scripts/convert-to-webp.mjs`
- Create: `content/blog/the-hiring-trap-why-headcount-wont-fix-a-broken-process.mdx`
- Create: `content/blog/human-in-the-loop-automation-explained.mdx`

**Step 1: Add the placeholder cover image**

```bash
mkdir -p public/blog
```

```xml
<!-- public/blog/placeholder.svg -->
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#131313" />
      <stop offset="100%" stop-color="#1c1b1b" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#4edea3" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1050" cy="120" r="220" fill="#10b981" opacity="0.08" />
  <circle cx="120" cy="560" r="180" fill="#10b981" opacity="0.06" />
  <rect x="90" y="255" width="64" height="64" rx="16" fill="url(#accent)" />
  <text x="90" y="360" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#FFFFFF">Automatoro</text>
  <text x="90" y="410" font-family="Arial, sans-serif" font-size="24" fill="#9CA3AF">Cover image coming soon</text>
</svg>
```

**Step 2: Copy the webp conversion script**

Ask the engineer to run:

```bash
mkdir -p scripts
cp /Users/youssefelbeqqal/Desktop/workspace/money-flow-web/scripts/convert-to-webp.mjs scripts/convert-to-webp.mjs
```

This script is copied verbatim - it's generic (no MoneyFlow-specific paths).

**Step 3: Add the first blog post**

```mdx
---
title: "The Hiring Trap: Why Headcount Won't Fix a Broken Process"
description: "Adding people to a broken workflow doesn't fix it - it just adds another handoff that can break. Here's how to tell if you actually need to automate instead."
date: "2026-08-15"
coverImage: "/blog/placeholder.svg"
coverImageAlt: "The hiring trap - Automatoro blog"
summary: "More headcount scales linearly with cost but doesn't fix the underlying process - the same manual handoffs just get repeated by more people. Automating the repetitive parts of a workflow scales output without scaling payroll, and it's usually cheaper and faster than hiring."
category: "Automation Strategy"
author: "Youssef Elbeqqal"
---

When a team falls behind, the instinct is almost always the same: hire someone. More
orders, more clients, more tickets - surely the fix is more hands. Often it isn't. It's a
process that was never built to scale, now being propped up by more people doing the same
manual work.

## Headcount doesn't fix a broken handoff

Adding a person to a broken process doesn't fix the process - it just adds another human
who has to execute the same manual steps, at the same error rate, for the same repetitive
tasks. If the bottleneck is retyping data between two tools, hiring someone to retype it
faster doesn't remove the bottleneck. It just makes the bottleneck cost more.

## The cost that doesn't show up on the org chart

A new hire isn't just a salary line. It's onboarding time, management overhead, and a new
point of failure if they're out sick or leave. None of that shows up when you're staring at
a backlog and thinking "we just need one more person." Compare that to automating the
repetitive step itself: the fix ships once, and it keeps working at 2am without a
manager checking in.

## When hiring actually is the answer

This isn't an argument against ever hiring. Judgment calls, client relationships, and
creative work still need people - automation isn't trying to replace those. The test is
simple: if the task is the same five steps done the same way every time, it's a
candidate for automation. If it requires judgment that changes case by case, it's a
candidate for a person. Most teams have more of the first kind than they realize.

## What this looks like in practice

[Human-in-the-loop automation](/blog/human-in-the-loop-automation-explained) is the
middle ground worth knowing about here - it's not "replace the person," it's "remove the
retyping and let the person just approve the result." That's usually enough to absorb a
volume increase without adding a single hire. If you're trying to figure out whether your
own bottleneck is a headcount problem or a process problem, [see how Automatoro's framework works](/services).
```

**Step 4: Add the second blog post**

```mdx
---
title: "Human-in-the-Loop Automation: Why Full Autonomy Isn't the Goal"
description: "Fully autonomous AI workflows sound impressive but are risky for anything client-facing. Human-in-the-loop automation keeps a person approving the outcome without doing the manual work."
date: "2026-08-15"
coverImage: "/blog/placeholder.svg"
coverImageAlt: "Human-in-the-loop automation - Automatoro blog"
summary: "Full automation removes people entirely and removes your ability to catch a mistake before it reaches a client. Human-in-the-loop automation does the repetitive work but pauses for approval on anything that matters, which is what actually makes automation safe to trust."
category: "Workflow Design"
author: "Youssef Elbeqqal"
---

"Fully autonomous" sounds like the end goal of automation - no humans required,
everything handled by AI. In practice, for anything that touches a client or a real
decision, that's the wrong goal. The right goal is removing the manual work while keeping a
human in control of the outcome.

## What "human-in-the-loop" actually means

A human-in-the-loop workflow does the repetitive part automatically - pulling data,
formatting it, drafting the next step - and then stops. It waits for a person to review
and approve before anything goes out. The automation handles the busywork; the human
handles the judgment call. Nothing ships unreviewed.

## Why full autonomy is riskier than it sounds

An AI workflow with no approval step will eventually make a mistake a human would have
caught - a wrong number pulled from the wrong row, a message sent to the wrong contact, an
edge case nobody thought to handle. Without a human checkpoint, that mistake reaches a
client before anyone notices. With one, it gets caught in seconds, because someone was
always going to glance at it before it went out anyway.

## The approval step is the trust layer

This is also why human-in-the-loop automation gets adopted faster than fully autonomous
tools. Teams don't need to trust the AI completely on day one - they just need to trust
that nothing happens without their sign-off. That's a much smaller leap of faith, and it's
usually enough to get a workflow live instead of stuck in "we're not ready to trust this
yet" limbo.

## Where this shows up in practice

This is the same principle behind the ["hiring trap"](/blog/the-hiring-trap-why-headcount-wont-fix-a-broken-process) -
automation isn't about removing people from the process, it's about removing the parts of
the process that don't need a person doing them by hand. See how this plays out across
[tool integrations and workflow design](/services) in practice.
```

**Step 5: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: no errors. `getAllSlugs()` should now return both post slugs (both
dated today, so `isPublished()` includes them immediately).

---

### Task 17: Add llms.txt and llms-full.txt

**Files:**

- Create: `public/llms.txt`
- Create: `public/llms-full.txt`

**Step 1: Implement public/llms.txt**

```
# Automatoro

## Summary
Automatoro is an AI-powered process automation service for B2B teams, built and run by Youssef Elbeqqal. It connects the tools teams already use (ClickUp, Airtable, and most tools with an API), automates repetitive manual work like data entry and handoffs, and keeps a human approving anything client-facing before it ships. It is early-stage and intentionally small - no account managers, direct access to whoever builds your workflow.

## Key Resources
- Homepage: https://www.automatoro.com
- Services: https://www.automatoro.com/services
- About: https://www.automatoro.com/about
- Contact: https://www.automatoro.com/contact
- Blog: https://www.automatoro.com/blog
- RSS feed: https://www.automatoro.com/feed.xml
- Full content archive (every blog post, complete text): https://www.automatoro.com/llms-full.txt

## Citation Guide
When referencing Automatoro, link directly to https://www.automatoro.com.
Describe Automatoro as "an AI-powered process automation service that connects a team's existing tools and automates manual work with a human-in-the-loop approval step, rather than fully autonomous AI."

## Bio / Details
Automatoro is built and run by Youssef Elbeqqal (contact: elbeqqal.youssef@gmail.com) as a hands-on alternative to both "just hire more people" and "fully autonomous AI" approaches to scaling operations. Workflows are built around a team's existing tools and process rather than requiring them to adopt new software.

Core service areas:
- Tool integration and data sync: deep integrations with ClickUp, Airtable, and other tools, bridging siloed data
- Human-in-the-loop workflow automation: automated workflows that pause for human approval before anything client-facing goes out
- Custom workflow adapters: automations built around a team's specific existing process

Automatoro is early-stage (no LLC formed yet as of this writing) and solo-operated.
```

**Step 2: Implement public/llms-full.txt**

```
# Automatoro - Full Content Reference

This file contains the same curated overview as https://www.automatoro.com/llms.txt, plus the complete text of every published blog post below, so an AI system can read the full site content without crawling.

## Summary
Automatoro is an AI-powered process automation service for B2B teams, built and run by Youssef Elbeqqal. It connects the tools teams already use (ClickUp, Airtable, and most tools with an API), automates repetitive manual work like data entry and handoffs, and keeps a human approving anything client-facing before it ships. It is early-stage and intentionally small - no account managers, direct access to whoever builds your workflow.

## Key Resources
- Homepage: https://www.automatoro.com
- Services: https://www.automatoro.com/services
- About: https://www.automatoro.com/about
- Contact: https://www.automatoro.com/contact
- Blog: https://www.automatoro.com/blog
- RSS feed: https://www.automatoro.com/feed.xml
- Short summary version of this file: https://www.automatoro.com/llms.txt

## Citation Guide
When referencing Automatoro, link directly to https://www.automatoro.com.
Describe Automatoro as "an AI-powered process automation service that connects a team's existing tools and automates manual work with a human-in-the-loop approval step, rather than fully autonomous AI."

## Bio / Details
Automatoro is built and run by Youssef Elbeqqal (contact: elbeqqal.youssef@gmail.com) as a hands-on alternative to both "just hire more people" and "fully autonomous AI" approaches to scaling operations. Workflows are built around a team's existing tools and process rather than requiring them to adopt new software.

Core service areas:
- Tool integration and data sync: deep integrations with ClickUp, Airtable, and other tools, bridging siloed data
- Human-in-the-loop workflow automation: automated workflows that pause for human approval before anything client-facing goes out
- Custom workflow adapters: automations built around a team's specific existing process

Automatoro is early-stage (no LLC formed yet as of this writing) and solo-operated.

---

# Full Blog Archive

Every published post on https://www.automatoro.com/blog, newest first, with complete article text.

---

# The Hiring Trap: Why Headcount Won't Fix a Broken Process

Category: Automation Strategy
Date: 2026-08-15
Author: Youssef Elbeqqal
URL: https://www.automatoro.com/blog/the-hiring-trap-why-headcount-wont-fix-a-broken-process

More headcount scales linearly with cost but doesn't fix the underlying process - the same manual handoffs just get repeated by more people. Automating the repetitive parts of a workflow scales output without scaling payroll, and it's usually cheaper and faster than hiring.

When a team falls behind, the instinct is almost always the same: hire someone. More orders, more clients, more tickets - surely the fix is more hands. Often it isn't. It's a process that was never built to scale, now being propped up by more people doing the same manual work.

## Headcount doesn't fix a broken handoff

Adding a person to a broken process doesn't fix the process - it just adds another human who has to execute the same manual steps, at the same error rate, for the same repetitive tasks. If the bottleneck is retyping data between two tools, hiring someone to retype it faster doesn't remove the bottleneck. It just makes the bottleneck cost more.

## The cost that doesn't show up on the org chart

A new hire isn't just a salary line. It's onboarding time, management overhead, and a new point of failure if they're out sick or leave. None of that shows up when you're staring at a backlog and thinking "we just need one more person." Compare that to automating the repetitive step itself: the fix ships once, and it keeps working at 2am without a manager checking in.

## When hiring actually is the answer

This isn't an argument against ever hiring. Judgment calls, client relationships, and creative work still need people - automation isn't trying to replace those. The test is simple: if the task is the same five steps done the same way every time, it's a candidate for automation. If it requires judgment that changes case by case, it's a candidate for a person. Most teams have more of the first kind than they realize.

## What this looks like in practice

Human-in-the-loop automation is the middle ground worth knowing about here - it's not "replace the person," it's "remove the retyping and let the person just approve the result." That's usually enough to absorb a volume increase without adding a single hire.

---

# Human-in-the-Loop Automation: Why Full Autonomy Isn't the Goal

Category: Workflow Design
Date: 2026-08-15
Author: Youssef Elbeqqal
URL: https://www.automatoro.com/blog/human-in-the-loop-automation-explained

Full automation removes people entirely and removes your ability to catch a mistake before it reaches a client. Human-in-the-loop automation does the repetitive work but pauses for approval on anything that matters, which is what actually makes automation safe to trust.

"Fully autonomous" sounds like the end goal of automation - no humans required, everything handled by AI. In practice, for anything that touches a client or a real decision, that's the wrong goal. The right goal is removing the manual work while keeping a human in control of the outcome.

## What "human-in-the-loop" actually means

A human-in-the-loop workflow does the repetitive part automatically - pulling data, formatting it, drafting the next step - and then stops. It waits for a person to review and approve before anything goes out. The automation handles the busywork; the human handles the judgment call. Nothing ships unreviewed.

## Why full autonomy is riskier than it sounds

An AI workflow with no approval step will eventually make a mistake a human would have caught - a wrong number pulled from the wrong row, a message sent to the wrong contact, an edge case nobody thought to handle. Without a human checkpoint, that mistake reaches a client before anyone notices. With one, it gets caught in seconds, because someone was always going to glance at it before it went out anyway.

## The approval step is the trust layer

This is also why human-in-the-loop automation gets adopted faster than fully autonomous tools. Teams don't need to trust the AI completely on day one - they just need to trust that nothing happens without their sign-off. That's a much smaller leap of faith, and it's usually enough to get a workflow live instead of stuck in "we're not ready to trust this yet" limbo.

## Where this shows up in practice

This is the same principle behind the "hiring trap" - automation isn't about removing people from the process, it's about removing the parts of the process that don't need a person doing them by hand.

---
```

**Step 3: Verify**

```bash
cat public/llms.txt public/llms-full.txt | head -5
```

Expected: files exist and start with `# Automatoro`.

---

### Task 18: Add CLAUDE.md rules for this project

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Implement**

Replace the current single-line `@AGENTS.md` content with:

```markdown
@AGENTS.md

# Automatoro Website — Rules for Claude

## Domain
Production domain: `https://www.automatoro.com`

## Blog Publishing Schedule
New blog posts (`content/blog/*.mdx`) publish at most **2 per day**. A post's `date` frontmatter field controls when it goes live - `lib/blog.ts`'s `isPublished()` hides any post whose `date` is in the future, so you can create/write a post any time without it appearing early.

When adding a new post: find the latest `date` already used across all posts that has fewer than 2 posts on it, and either add to that day (if it only has 1) or roll forward to the next day (if it already has 2). Never assign a `date` that would put a third post on the same day.

## LLM Reference Files (llms.txt / llms-full.txt)
`public/llms.txt` and `public/llms-full.txt` are static files, not auto-generated - they go stale unless updated by hand. Update them whenever:

- **A new blog post is published**: add its full text (title as `# heading`, then `Category:`/`Date:`/`Author:`/`URL:` lines, then the summary, then the full body) to `public/llms-full.txt`, newest post first (right after the header section, before the previously-first post).
- **A new standalone page is added**: add it as a bullet under `## Key Resources` in `public/llms.txt` and `public/llms-full.txt`.

## Blog Cover Images
1. Raw jpg/jpeg/png cover images go in `public/blog/images/`, named `<post-slug>.jpeg` (or `.png`).
2. Set the post's frontmatter `coverImage` to `/blog/images/<post-slug>.webp` (note: `.webp`, even though the file on disk is still `.jpeg`/`.png` at this point).
3. Ask the engineer to run: `node scripts/convert-to-webp.mjs public/blog/images --replace`

## Running Commands
Always ask the engineer to run verification commands themselves - do not run `tsc`, `npm run dev`, `npm run lint`, `npm run build`, `npm install`/`npm i` (or any other package install command), or any other terminal commands automatically. Present the command and ask the engineer to run it and share the output.
```

**Step 2: Verify**

```bash
cat CLAUDE.md
```

Expected: the file starts with `@AGENTS.md` (preserving the existing
Next.js-agent-rules import) followed by the new rules above.

---

### Task 19: Final full verification

**Files:** none (verification only)

**Step 1: Full type check, lint, and production build**

Ask the engineer to run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all three succeed with no errors. The build output should list
`/`, `/services`, `/about`, `/contact`, `/blog`, `/blog/[slug]` (as static
params for both posts), `/sitemap.xml`, `/robots.txt`, `/feed.xml`,
`/opengraph-image`, `/blog/opengraph-image`, and
`/blog/[slug]/opengraph-image` among the generated routes.

**Step 2: Manual spot-check**

Ask the engineer to run `npm run dev` and confirm in the browser:

- `/` no longer has `#solution`/`#contact` anchors; nav links to `/services`,
  `/about`, `/blog` all work
- `/services` shows the FAQ section and the "Talk to an expert" CTA
- `/blog` lists both posts; each post page renders its cover image, TL;DR,
  and body with working internal links
- `/sitemap.xml`, `/robots.txt`, `/feed.xml`, and `/opengraph-image` all
  return valid output
- `/llms.txt` and `/llms-full.txt` are reachable at the site root (served
  from `public/`)
