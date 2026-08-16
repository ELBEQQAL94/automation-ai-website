// app/terms/page.tsx
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Terms of Service",
    description: "The terms that govern use of Automatoro's website and services.",
    path: "/terms",
  }),
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main className="flex w-full max-w-3xl flex-col gap-6 px-6 py-16 sm:py-24 lg:px-12">
      <h1 className="text-4xl font-semibold tracking-tight text-on-surface sm:text-5xl">
        Terms of Service
      </h1>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6">
        <p className="text-base leading-7 text-on-surface-variant">
          <strong className="text-on-surface">Placeholder page.</strong> This is not a final,
          reviewed terms of service. Replace this content before relying on it or advertising it
          to visitors.
        </p>
      </div>

      <p className="text-lg leading-8 text-on-surface-variant">
        This page will describe the terms that govern your use of this website and Automatoro&apos;s
        automation services, including acceptable use, service scope, and liability.
      </p>

      <p className="text-lg leading-8 text-on-surface-variant">
        Questions in the meantime can be sent to{" "}
        <a
          href="mailto:elbeqqal.youssef@gmail.com"
          className="font-medium text-primary underline hover:opacity-80"
        >
          elbeqqal.youssef@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
