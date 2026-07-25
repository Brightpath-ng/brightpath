import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Verified tutor</Badge>);
    expect(screen.getByText("Verified tutor")).toBeInTheDocument();
  });

  it("applies the default variant styling", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toHaveStyle({ background: "var(--bg-elevated)" });
  });

  it("applies success variant styling using token-based colors, not inline rgba", () => {
    render(<Badge variant="success">Approved</Badge>);
    const badge = screen.getByText("Approved");
    expect(badge).toHaveStyle({ background: "var(--green-bg)", color: "var(--green)" });
  });

  it("applies the accent variant using the brand accent, not an unrelated color", () => {
    render(<Badge variant="accent">Featured</Badge>);
    const badge = screen.getByText("Featured");
    expect(badge).toHaveStyle({ color: "var(--accent)" });
    // toHaveStyle can't resolve var() inside a shorthand like `border` under jsdom,
    // so check the raw inline style string for the border color directly.
    expect(badge.getAttribute("style")).toContain("border: 1px solid var(--accent-border)");
  });

  it("lets a caller override style via the style prop", () => {
    render(
      <Badge variant="accent" style={{ color: "red" }}>
        Overridden
      </Badge>
    );
    // jsdom normalizes the "red" keyword to its rgb() form.
    expect(screen.getByText("Overridden")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });
});
