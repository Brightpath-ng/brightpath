import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuidesTeaser, guides } from "../GuidesTeaser";

describe("GuidesTeaser", () => {
  it("renders a link for every guide with the right title and href", () => {
    render(<GuidesTeaser />);
    for (const guide of guides) {
      expect(screen.getByRole("link", { name: new RegExp(guide.title) })).toHaveAttribute(
        "href",
        guide.href
      );
    }
  });

  it("renders a teaser line for each guide", () => {
    render(<GuidesTeaser />);
    for (const guide of guides) {
      expect(screen.getByText(guide.teaser)).toBeInTheDocument();
    }
  });
});
