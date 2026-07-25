import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "../Footer";

const expectedColumns = [
  "Contact",
  "About",
  "Terms & policies",
  "Tips & advice",
  "Resources",
  "For business",
];

describe("Footer", () => {
  it("renders all six spec'd columns with headings", () => {
    render(<Footer />);
    for (const title of expectedColumns) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("renders at least one working link per column", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "About BrightPath" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Exam prep tips" })).toHaveAttribute(
      "href",
      "/guides/exam-prep-tips"
    );
    expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute("href", "/guides");
    expect(screen.getByRole("link", { name: "School partnerships" })).toHaveAttribute(
      "href",
      "/schools"
    );
  });

  it("renders a labeled social link for every social platform", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "X" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("renders the current year in the copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} BrightPath`))).toBeInTheDocument();
  });
});
