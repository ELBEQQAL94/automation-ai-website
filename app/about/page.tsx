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
