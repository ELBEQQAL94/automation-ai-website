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
