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
    expect(screen.getByRole("link", { name: "Find a Tutor" })).toHaveAttribute(
      "href",
      "http://localhost:3001/sign-in"
    );
    expect(screen.getByRole("link", { name: "Become a Tutor" })).toHaveAttribute(
      "href",
      "/become-a-tutor"
    );
  });

  it("renders the inline trust badge", () => {
    render(<Hero />);
    expect(screen.getByText(/95% parent satisfaction/i)).toBeInTheDocument();
  });
});
