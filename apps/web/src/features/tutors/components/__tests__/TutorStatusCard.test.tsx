import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorStatusCard } from "../TutorStatusCard";

describe("TutorStatusCard", () => {
  it("shows an under-review message for a PENDING application", () => {
    render(<TutorStatusCard status="PENDING" />);
    expect(screen.getByText("Application under review")).toBeInTheDocument();
  });

  it("shows a not-approved message for a REJECTED application", () => {
    render(<TutorStatusCard status="REJECTED" />);
    expect(screen.getByText("Application not approved")).toBeInTheDocument();
  });

  it("shows the dashboard placeholder for an APPROVED application", () => {
    render(<TutorStatusCard status="APPROVED" />);
    expect(
      screen.getByText("Your schedule, assigned students, and lesson reports will land here.")
    ).toBeInTheDocument();
  });
});
