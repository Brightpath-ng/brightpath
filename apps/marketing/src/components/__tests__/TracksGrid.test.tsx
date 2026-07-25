import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TracksGrid } from "../TracksGrid";

describe("TracksGrid", () => {
  it("renders all three tracks as headings", () => {
    render(<TracksGrid />);
    expect(screen.getByRole("heading", { name: "Tutor-led" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hybrid" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Self-directed" })).toBeInTheDocument();
  });

  it("gives each track its own explore CTA link", () => {
    render(<TracksGrid />);
    expect(screen.getByRole("link", { name: "Explore Tutor-led" })).toHaveAttribute(
      "href",
      "/tracks/tutor-led"
    );
    expect(screen.getByRole("link", { name: "Explore Hybrid" })).toHaveAttribute(
      "href",
      "/tracks/hybrid"
    );
    expect(screen.getByRole("link", { name: "Explore Self-directed" })).toHaveAttribute(
      "href",
      "/tracks/self-directed"
    );
  });

  it("renders a description for each track", () => {
    render(<TracksGrid />);
    expect(screen.getByText(/matched and assigned by brightpath/i)).toBeInTheDocument();
    expect(screen.getByText(/reduced tutor frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/past-paper drills/i)).toBeInTheDocument();
  });
});
