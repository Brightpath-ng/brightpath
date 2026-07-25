import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footnotes } from "../Footnotes";

describe("Footnotes", () => {
  it("resolves both footnote markers used elsewhere on the page", () => {
    render(<Footnotes />);
    expect(screen.getByText(/1\. Baseline vs\. latest assessment score/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Based on verified parent reviews/)).toBeInTheDocument();
  });
});
