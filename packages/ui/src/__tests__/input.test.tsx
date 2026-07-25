import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";

describe("Input", () => {
  it("renders as a text input by default", () => {
    render(<Input placeholder="Postcode" />);
    expect(screen.getByPlaceholderText("Postcode")).toBeInTheDocument();
  });

  it("applies the accent border by default", () => {
    render(<Input placeholder="Name" />);
    expect(screen.getByPlaceholderText("Name").className).toContain("border-[var(--bg-border)]");
  });

  it("switches to the red error border when error is true", () => {
    render(<Input placeholder="Email" error />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.className).toContain("border-[var(--red)]");
    expect(input.className).not.toContain("border-[var(--bg-border)]");
  });
});
