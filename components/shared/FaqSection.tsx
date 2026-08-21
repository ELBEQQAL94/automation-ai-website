// components/shared/FaqSection.tsx
export type Faq = {
  question: string;
  answer: string;
};

export default function FaqSection({
  faqs,
  heading = "Frequently asked questions",
}: {
  faqs: Faq[];
  heading?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="mb-6 text-2xl font-medium text-on-surface">{heading}</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-outline-variant/30 bg-surface-container-low p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-primary marker:content-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
