import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinalCTA } from "../FinalCTA";

describe("FinalCTA", () => {
  it("renders the question and a link to get help", () => {
    render(<FinalCTA />);
    expect(screen.getByRole("heading", { name: "Have a question?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get help" })).toHaveAttribute("href", "/support");
  });
});
