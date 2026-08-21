// components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BotIcon, CloseIcon, MenuIcon } from "@/app/icons";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
          <BotIcon className="h-6 w-6 shrink-0 text-primary sm:h-7 sm:w-7" />
          <span className="truncate text-lg font-bold text-on-surface sm:text-xl">Automatoro</span>
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
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="shrink-0 cursor-pointer whitespace-nowrap rounded-full bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container transition-opacity hover:opacity-90 sm:px-5 sm:text-base"
          >
            Talk to an expert
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 cursor-pointer items-center justify-center text-on-surface md:hidden"
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-outline-variant/40 bg-surface px-6 py-4 sm:px-8 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
