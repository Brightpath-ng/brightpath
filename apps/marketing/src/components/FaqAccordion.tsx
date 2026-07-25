"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    id: "pricing",
    question: "How much does BrightPath cost?",
    answer:
      "Pricing depends on how you'd like to pay — pay-as-you-go per lesson, a discounted prepaid package, or a monthly subscription. Every plan is priced and billed by BrightPath, never negotiated with your tutor directly.",
  },
  {
    id: "verification",
    question: "How are tutors vetted and verified?",
    answer:
      "Every tutor moves through a tiered verification process — ID and phone verification, a checked guarantor or professional reference, and a video or in-person interview assessing both subject knowledge and child-safety awareness — before they're eligible to teach.",
  },
  {
    id: "delivery-mode",
    question: "Can lessons be online, in-person, or both?",
    answer:
      "Both. You can choose online lessons, in-person lessons, or let us match whichever works best — and you can switch delivery mode lesson-to-lesson if your tutor supports both.",
  },
  {
    id: "refunds",
    question: "What happens if I need to cancel or get a refund?",
    answer:
      "Cancellations and refunds are resolved through our ledger — every charge, hold, and refund is tracked against the specific lesson affected, so a single cancellation never requires unwinding your whole plan.",
  },
  {
    id: "become-a-tutor",
    question: "How do I become a BrightPath tutor?",
    answer:
      "Apply through our tutor recruitment page with your qualifications and a short video introduction. You'll move through verification and our training modules before being matched with your first student — BrightPath assigns students, so you can focus on teaching.",
  },
  {
    id: "verified-checkins",
    question: "How do you make sure a lesson actually happened?",
    answer:
      "Every tutor checks in and out of each lesson, and in-person lessons record a location match against your registered address. You'll see exactly when a lesson started, ended, and where it happened.",
  },
];

function getHighlightedIdFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#faq-/, "");
  return faqs.some((faq) => faq.id === hash) ? hash : null;
}

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const idFromHash = getHighlightedIdFromHash();
    if (idFromHash) {
      setOpenIds((prev) => new Set(prev).add(idFromHash));
      setHighlightedId(idFromHash);
    }
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <h2
          className="text-center text-3xl font-bold sm:text-4xl"
          style={{ color: "var(--text-primary)" }}
        >
          Frequently asked questions
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            const isHighlighted = highlightedId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                id={`faq-${faq.id}`}
                className="overflow-hidden"
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--mkt-radius-card)",
                  boxShadow: "var(--shadow-card)",
                  outline: isHighlighted ? "2px solid var(--accent)" : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.question}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-5 shrink-0 transition-transform duration-200"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        color: "var(--accent)",
                      }}
                    />
                  </button>
                </h3>
                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-5 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
