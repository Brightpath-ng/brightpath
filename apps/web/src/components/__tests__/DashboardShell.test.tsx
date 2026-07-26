import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

const { DashboardShell } = await import("../DashboardShell.js");

describe("DashboardShell", () => {
  it("renders the brand label, greeting, and description", () => {
    render(
      <DashboardShell
        brandLabel="BrightPath Admin"
        greeting="Welcome, Ada"
        description="Tutor approvals will land here."
      />
    );

    expect(screen.getByText("BrightPath Admin")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome, Ada" })).toBeInTheDocument();
    expect(screen.getByText("Tutor approvals will land here.")).toBeInTheDocument();
  });

  it("renders the Clerk user button for signing out", () => {
    render(<DashboardShell brandLabel="BrightPath" greeting="Hi" description="..." />);
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
