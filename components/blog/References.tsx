// components/blog/References.tsx
import type { Reference } from "@/lib/blog";

export default function References({ references }: { references: Reference[] }) {
  if (references.length === 0) return null;

  return (
    <section className="mt-12 border-t border-outline-variant/30 pt-8">
      <h2 className="mb-4 text-xl font-semibold text-on-surface">References</h2>
      <ol className="flex flex-col gap-2">
        {references.map((ref, index) => (
          <li key={ref.url} className="text-sm leading-6 text-on-surface-variant">
            {index + 1}.{" "}
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline hover:opacity-80"
            >
              {ref.text}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
