import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PendingPage from "../page.js";

describe("PendingPage", () => {
  it("explains the wait and offers a way to refresh", () => {
    render(<PendingPage />);
    expect(screen.getByRole("heading", { name: /setting up your account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Refresh" })).toHaveAttribute("href", "/");
  });
});
