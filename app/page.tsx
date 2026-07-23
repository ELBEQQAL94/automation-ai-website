import { HeroDiagram } from "./hero-diagram";
import {
  AlertTriangleIcon,
  BotIcon,
  ChecklistIcon,
  ClockIcon,
  CloudSyncIcon,
  DatabaseIcon,
  GaugeIcon,
  PlugIcon,
  SparkleIcon,
  TrendingUpIcon,
  UnlockIcon,
  UserMinusIcon,
} from "./icons";

// TODO: replace with the live Task Router demo link once the demo is finished
const DEMO_LINK = "#";
// TODO: replace with a real contact address
const CONTACT_EMAIL = "hello@example.com";

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
    body: "Take on more volume without adding staff — the coordination overhead stops scaling linearly.",
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
    <div className="flex flex-col flex-1 items-center bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <BotIcon className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-on-surface">
              AutomateX
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#solution"
              className="text-base text-on-surface-variant transition-colors hover:text-primary"
            >
              Services
            </a>
            <a
              href="#solution"
              className="text-base text-on-surface-variant transition-colors hover:text-primary"
            >
              Solutions
            </a>
            <a
              href="#benefits"
              className="text-base text-on-surface-variant transition-colors hover:text-primary"
            >
              Results
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-full bg-primary-container px-5 py-2 text-base font-bold text-on-primary-container transition-opacity hover:opacity-90"
          >
            Live Demo
          </a>
        </div>
      </header>

      <main className="flex w-full max-w-5xl flex-col gap-20 px-6 py-16 sm:gap-24 sm:px-8 sm:py-24 lg:px-12">
        {/* Hero */}
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary sm:text-sm">
              B2B Process Automation
            </span>
            <h1 className="mb-5 text-4xl font-semibold leading-[1.1] tracking-tight text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">
              Eliminate manual busywork.{" "}
              <span className="text-primary">Automatically.</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-8 text-on-surface-variant sm:text-xl sm:leading-9">
              Connect your tools, automate the retyping, and scale your ops
              without adding headcount. Our tailored AI workflows do the
              heavy lifting for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#demo"
                className="rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-transform hover:scale-[1.02] active:scale-95"
              >
                See it in action
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full border border-outline-variant px-8 py-4 text-lg font-medium text-on-surface transition-colors hover:bg-surface-container-low"
              >
                Talk to an expert
              </a>
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
                <h4 className="mb-2 text-xl font-medium text-on-surface">
                  {item.title}
                </h4>
                <p className="text-lg leading-7 text-on-surface-variant">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section id="solution" className="flex flex-col gap-10 scroll-mt-24">
          <div className="text-center">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary sm:text-sm">
              Our Framework
            </h2>
            <h3 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
              Enterprise-grade automation made simple.
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-8 md:col-span-7 md:p-10">
              <div>
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary sm:text-sm">
                  Integrations
                </span>
                <h4 className="mb-4 text-2xl font-medium text-on-surface">
                  Tool Connectivity
                </h4>
                <p className="max-w-md text-lg leading-7 text-on-surface-variant">
                  Deep integrations with ClickUp, Airtable, and your existing
                  stack. We bridge the gap between siloed data pools
                  effortlessly.
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
              <h4 className="mb-4 text-2xl font-medium">Human-in-the-Loop</h4>
              <p className="text-lg leading-7 opacity-90">
                Automation with an approval step. You keep full control while
                AI handles the mundane pre-processing.
              </p>
            </div>
            <div className="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 sm:p-8 md:col-span-12 md:flex-row md:p-10">
              <div className="flex-1">
                <h4 className="mb-4 text-2xl font-medium text-on-surface">
                  Seamless Fit
                </h4>
                <p className="text-lg leading-7 text-on-surface-variant">
                  We adapt to your workflows, not the other way around. We
                  build custom adapters for the unique way you do business.
                </p>
              </div>
              <div className="relative h-32 w-full flex-1 overflow-hidden rounded-xl border border-outline-variant/30">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-transparent">
                  <span className="animate-pulse font-mono text-xs text-on-surface-variant sm:text-sm">
                    Scanning infrastructure...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="flex flex-col gap-10 scroll-mt-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {benefits.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-highest sm:h-14 sm:w-14">
                  <item.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="mb-1 text-xl font-medium text-on-surface">
                    {item.title}
                  </h4>
                  <p className="text-lg leading-7 text-on-surface-variant">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          id="demo"
          className="relative flex scroll-mt-24 flex-col items-center gap-4 overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container p-8 text-center sm:p-12 md:p-16 lg:p-20"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
            Ready to see how it works?
          </h2>
          <p className="max-w-xl text-lg leading-8 text-on-surface-variant sm:text-xl">
            See AutomateX in action with Task Router — a live example of a
            multi-step automation with a human approval step built in.
          </p>
          <a
            href={DEMO_LINK}
            className="mt-2 rounded-full bg-primary-container px-10 py-4 text-lg font-medium text-on-primary-container shadow-lg transition-transform hover:scale-[1.02]"
          >
            View the demo
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/40 bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-10 sm:px-8 md:flex-row md:justify-between lg:px-12">
          <div className="flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary" />
            <span className="font-mono text-base font-bold text-on-surface">
              AutomateX
            </span>
          </div>
          <div className="flex gap-6 text-base text-secondary">
            <a
              href={DEMO_LINK}
              className="transition-colors hover:text-on-surface hover:underline"
            >
              Task Router Demo
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors hover:text-on-surface hover:underline"
            >
              Contact
            </a>
          </div>
          <p className="text-base text-secondary">
            © 2026 AutomateX Consultancy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
