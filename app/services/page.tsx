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
          className="mt-2 cursor-pointer rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02]"
        >
          Talk to an expert
        </Link>
      </div>
    </main>
  );
}
