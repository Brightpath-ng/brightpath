import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ProofCardSchema } from "@brightpath/types";
import { ProofCarousel, proofCards } from "../ProofCarousel";

describe("ProofCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("has seed data that conforms to the shared ProofCard schema", () => {
    for (const card of proofCards) {
      expect(() => ProofCardSchema.parse(card)).not.toThrow();
    }
  });

  it("renders the first card (the before/after stat) visibly by default, others hidden", () => {
    render(<ProofCarousel />);
    expect(screen.getByText("42% → 84%")).toBeVisible();
    expect(screen.getByText("Every lesson starts with a verified check-in")).not.toBeVisible();
    expect(screen.getByRole("link", { name: "Explore Self-directed", hidden: true })).not.toBeVisible();
  });

  it("advances to the next card when the next control is clicked", () => {
    render(<ProofCarousel />);
    fireEvent.click(screen.getByRole("button", { name: /next proof card/i }));
    expect(screen.getByText("Every lesson starts with a verified check-in")).toBeVisible();
    expect(screen.getByText("42% → 84%")).not.toBeVisible();
  });

  it("goes back to the previous card when the previous control is clicked", () => {
    render(<ProofCarousel />);
    fireEvent.click(screen.getByRole("button", { name: /previous proof card/i }));
    expect(screen.getByRole("link", { name: "Explore Self-directed" })).toBeVisible();
    expect(screen.getByText("42% → 84%")).not.toBeVisible();
  });

  it("jumps directly to a card via its dot indicator", () => {
    render(<ProofCarousel />);
    fireEvent.click(screen.getByRole("button", { name: /show proof card 3 of 3/i }));
    expect(screen.getByRole("link", { name: "Explore Self-directed" })).toBeVisible();
  });

  it("auto-advances to the next card after the interval elapses", () => {
    render(<ProofCarousel />);
    expect(screen.getByText("42% → 84%")).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText("Every lesson starts with a verified check-in")).toBeVisible();
    expect(screen.getByText("42% → 84%")).not.toBeVisible();
  });

  it("marks the inactive cards aria-hidden so screen readers skip them", () => {
    render(<ProofCarousel />);
    const trustHeadline = screen.getByText("Every lesson starts with a verified check-in");
    expect(trustHeadline.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
