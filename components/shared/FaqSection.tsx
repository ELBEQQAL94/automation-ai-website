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
          <div
            key={faq.question}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5"
          >
            <h3 className="mb-1 font-semibold text-primary">{faq.question}</h3>
            <p className="text-sm leading-6 text-on-surface-variant">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
