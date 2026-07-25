import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhyChooseUs, reasons } from "../WhyChooseUs";

describe("WhyChooseUs", () => {
  it("renders exactly eight reasons, each as an icon + heading + one line", () => {
    render(<WhyChooseUs />);
    expect(reasons).toHaveLength(8);
    for (const reason of reasons) {
      expect(screen.getByRole("heading", { name: reason.title })).toBeInTheDocument();
      expect(screen.getByText(reason.description)).toBeInTheDocument();
    }
  });

  it("never uses 'platform' or 'agency' language in copy", () => {
    for (const reason of reasons) {
      expect(`${reason.title} ${reason.description}`).not.toMatch(/platform|agency/i);
    }
  });
});
