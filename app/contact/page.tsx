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
