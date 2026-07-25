import { render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/react";
import { FaqAccordion, faqs } from "../FaqAccordion";

function getFaqById(id: string) {
  const faq = faqs.find((item) => item.id === id);
  if (!faq) throw new Error(`No seed FAQ with id "${id}"`);
  return faq;
}

describe("FaqAccordion", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  afterEach(() => {
    window.location.hash = "";
  });

  it("renders every question collapsed by default", () => {
    render(<FaqAccordion />);
    for (const faq of faqs) {
      const button = screen.getByRole("button", { name: faq.question });
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByText(faq.answer)).not.toBeInTheDocument();
    }
  });

  it("expands a question's answer when clicked, and collapses it again on a second click", () => {
    const pricing = getFaqById("pricing");
    render(<FaqAccordion />);
    const pricingButton = screen.getByRole("button", { name: pricing.question });

    fireEvent.click(pricingButton);
    expect(pricingButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(pricing.answer)).toBeVisible();

    fireEvent.click(pricingButton);
    expect(pricingButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(pricing.answer)).not.toBeInTheDocument();
  });

  it("keeps other questions collapsed when one is opened", () => {
    const pricing = getFaqById("pricing");
    const verification = getFaqById("verification");
    render(<FaqAccordion />);
    fireEvent.click(screen.getByRole("button", { name: pricing.question }));
    expect(screen.getByRole("button", { name: verification.question })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("auto-expands and highlights the question matching the URL hash on mount", () => {
    const deepLinkedFaq = getFaqById("refunds");
    window.location.hash = `#faq-${deepLinkedFaq.id}`;

    render(<FaqAccordion />);

    const button = screen.getByRole("button", { name: deepLinkedFaq.question });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(deepLinkedFaq.answer)).toBeVisible();

    const container = document.getElementById(`faq-${deepLinkedFaq.id}`);
    expect(container).toHaveStyle({ outline: "2px solid var(--accent)" });
  });
});
