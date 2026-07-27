import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorCTA } from "../TutorCTA";

describe("TutorCTA", () => {
  it("renders the headline and subhead", () => {
    render(<TutorCTA />);
    expect(
      screen.getByRole("heading", { name: "Teach With Us, On Your Terms" })
    ).toBeInTheDocument();
    expect(screen.getByText(/earn a steady income/i)).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    render(<TutorCTA />);
    expect(screen.getByRole("link", { name: "Apply to Teach" })).toHaveAttribute(
      "href",
      "/become-a-tutor"
    );
    expect(screen.getByRole("button", { name: "See How It Works" })).toBeInTheDocument();
  });

  it("never uses 'platform' or 'agency' language in copy", () => {
    render(<TutorCTA />);
    expect(document.body.textContent).not.toMatch(/platform|agency/i);
  });
});
