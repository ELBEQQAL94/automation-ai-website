// components/layout/Footer.tsx
import Link from "next/link";
import { BotIcon } from "@/app/icons";
import { getAllPosts } from "@/lib/blog";

const DEMO_LINK = "https://task-router-pi.vercel.app/";
const LINKEDIN_URL = "https://www.linkedin.com/company/automatoro/posts/?feedView=all";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.11 20.45H3.56V9h3.55v11.45Z" />
    </svg>
  );
}

type FooterLink = { href: string; label: string; newTab?: boolean };

export default function Footer() {
  const recentPosts = getAllPosts().slice(0, 4);

  const linkColumns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: "Product",
      links: [
        { href: "/services", label: "Services" },
        { href: "/blog", label: "Blog" },
        { href: DEMO_LINK, label: "Task Router Demo", newTab: true },
      ],
    },
    {
      heading: "Resources",
      links: [
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/llms.txt", label: "llms.txt", newTab: true },
        { href: "/llms-full.txt", label: "llms-full.txt", newTab: true },
      ],
    },
    {
      heading: "Blog",
      links: [
        ...recentPosts.map((post) => ({ href: `/blog/${post.slug}`, label: post.title })),
        { href: "/blog", label: "All Posts" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-outline-variant/40 bg-surface">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="mb-3 flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary" />
            <span className="font-mono text-base font-bold text-on-surface">Automatoro</span>
          </Link>
          <p className="mb-5 max-w-xs text-sm leading-6 text-secondary">
            AI-powered automation that connects the tools your team already uses.
          </p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Automatoro on LinkedIn"
            className="-ml-2 inline-flex p-2 text-secondary transition-colors hover:text-on-surface"
          >
            <LinkedInIcon />
          </a>
        </div>

        {linkColumns.map((column) => (
          <div key={column.heading}>
            <p className="mb-4 text-sm font-semibold text-on-surface">{column.heading}</p>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                    className="text-sm text-secondary transition-colors hover:text-on-surface hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant/40">
        <div className="mx-auto max-w-5xl px-6 py-6 sm:px-8 lg:px-12">
          <p className="text-center text-sm text-secondary">
            &copy; {new Date().getFullYear()} Automatoro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
