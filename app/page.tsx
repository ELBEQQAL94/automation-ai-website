// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { HeroDiagram } from "./hero-diagram";
import {
  AlertTriangleIcon,
  ChecklistIcon,
  ClockIcon,
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
              className="cursor-pointer rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02] active:scale-95"
            >
              See it in action
            </a>
            <Link
              href="/contact"
              className="cursor-pointer rounded-full border border-outline-variant px-8 py-4 text-lg font-medium text-on-surface transition-colors hover:bg-surface-container-low"
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
          className="mt-2 cursor-pointer rounded-full bg-primary-container px-10 py-4 text-lg font-medium text-on-primary-container shadow-lg transition-transform hover:scale-[1.02]"
        >
          View the demo
        </a>
      </section>
    </main>
  );
}
