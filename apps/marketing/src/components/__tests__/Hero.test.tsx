import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../Hero";

describe("Hero", () => {
  it("renders the headline and subhead", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Helping Every Child Reach Their Full Potential" })
    ).toBeInTheDocument();
    expect(screen.getByText(/we train exceptional tutors/i)).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("button", { name: "Find a Tutor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Become a Tutor" })).toBeInTheDocument();
  });

  it("renders the inline trust badge", () => {
    render(<Hero />);
    expect(screen.getByText(/95% parent satisfaction/i)).toBeInTheDocument();
  });
});
