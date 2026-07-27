import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TutorApplicationSummary } from "@brightpath/types";

const approveTutorApplication = vi.fn();
const rejectTutorApplication = vi.fn();

vi.mock("../../api/actions.js", () => ({
  approveTutorApplication: (id: string) => approveTutorApplication(id),
  rejectTutorApplication: (id: string) => rejectTutorApplication(id),
}));

const { TutorApplicationsList } = await import("../TutorApplicationsList.js");

function buildApplication(
  overrides: Partial<TutorApplicationSummary> = {}
): TutorApplicationSummary {
  return {
    id: "tutor_profile_1",
    userId: "db_user_1",
    subjects: ["Mathematics"],
    qualifications: "BSc Mathematics",
    bio: null,
    status: "PENDING",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    name: "Ngozi Adeyemi",
    email: "ngozi@example.com",
    ...overrides,
  };
}

describe("TutorApplicationsList", () => {
  beforeEach(() => {
    approveTutorApplication.mockReset().mockResolvedValue(undefined);
    rejectTutorApplication.mockReset().mockResolvedValue(undefined);
  });

  it("shows an empty state when there are no pending applications", () => {
    render(<TutorApplicationsList applications={[]} />);
    expect(screen.getByText("No pending applications.")).toBeInTheDocument();
  });

  it("renders each application's details", () => {
    render(<TutorApplicationsList applications={[buildApplication()]} />);
    expect(screen.getByText("Ngozi Adeyemi")).toBeInTheDocument();
    expect(screen.getByText("ngozi@example.com")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("BSc Mathematics")).toBeInTheDocument();
  });

  it("calls approveTutorApplication when Approve is clicked", async () => {
    render(<TutorApplicationsList applications={[buildApplication()]} />);

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => expect(approveTutorApplication).toHaveBeenCalledWith("tutor_profile_1"));
  });

  it("calls rejectTutorApplication when Reject is clicked", async () => {
    render(<TutorApplicationsList applications={[buildApplication()]} />);

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => expect(rejectTutorApplication).toHaveBeenCalledWith("tutor_profile_1"));
  });

  it("shows an error message when approving fails", async () => {
    approveTutorApplication.mockRejectedValue(new Error("network error"));
    render(<TutorApplicationsList applications={[buildApplication()]} />);

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't approve/i);
  });
});
