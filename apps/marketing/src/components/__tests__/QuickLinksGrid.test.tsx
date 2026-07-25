import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickLinksGrid } from "../QuickLinksGrid";

describe("QuickLinksGrid", () => {
  it("renders all four quick link cards as accessible links", () => {
    render(<QuickLinksGrid />);

    expect(screen.getByRole("link", { name: /book an assessment/i })).toHaveAttribute(
      "href",
      "/assessment"
    );
    expect(screen.getByRole("link", { name: /track my child's progress/i })).toHaveAttribute(
      "href",
      "/sign-in"
    );
    expect(screen.getByRole("link", { name: /become a tutor/i })).toHaveAttribute(
      "href",
      "/become-a-tutor"
    );
    expect(screen.getByRole("link", { name: /find my tutor's report/i })).toHaveAttribute(
      "href",
      "/sign-in"
    );
  });

  it("renders each card's heading and description", () => {
    render(<QuickLinksGrid />);

    expect(screen.getByRole("heading", { name: "Book an Assessment" })).toBeInTheDocument();
    expect(
      screen.getByText(/start with a quick diagnostic to find the right track/i)
    ).toBeInTheDocument();
  });

  it("renders a call-to-action label on every card", () => {
    render(<QuickLinksGrid />);

    expect(screen.getByText("Get started")).toBeInTheDocument();
    expect(screen.getByText("View dashboard")).toBeInTheDocument();
    expect(screen.getByText("Apply now")).toBeInTheDocument();
    expect(screen.getByText("See report")).toBeInTheDocument();
  });
});
