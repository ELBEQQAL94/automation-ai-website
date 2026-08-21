// components/blog/ArticleCTA.tsx
import Link from "next/link";

export default function ArticleCTA() {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-on-surface">
        Facing something like this?
      </h2>
      <p className="max-w-lg text-lg leading-8 text-on-surface-variant">
        Contact us now for more details about your problem.
      </p>
      <Link
        href="/contact"
        className="mt-2 cursor-pointer rounded-full bg-primary-container px-8 py-3 text-lg font-medium text-on-primary-container shadow-lg transition-transform hover:scale-[1.02]"
      >
        Contact us
      </Link>
    </div>
  );
}
