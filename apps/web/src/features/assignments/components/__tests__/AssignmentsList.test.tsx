import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Assignment } from "@brightpath/types";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const { AssignmentsList } = await import("../AssignmentsList.js");

function buildAssignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: "assignment_1",
    status: "ACTIVE",
    assignedById: "admin_user_1",
    assignedAt: "2026-01-01T00:00:00.000Z",
    endedAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    student: { id: "student_1", name: "Amaka Obi" },
    tutor: { id: "tutor_1", name: "Ngozi Adeyemi", subjects: ["Mathematics"] },
    ...overrides,
  };
}

describe("AssignmentsList", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("shows an empty state with a create CTA when there are no assignments", () => {
    render(<AssignmentsList assignments={[]} />);
    expect(screen.getByText("No assignments yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Assign a tutor/ })).toHaveAttribute(
      "href",
      "/admin/assignments/new"
    );
  });

  it("renders the pairing as a table with the student, tutor, and an Active badge", () => {
    render(<AssignmentsList assignments={[buildAssignment()]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(/Amaka Obi/)).toBeInTheDocument();
    expect(screen.getByText(/Ngozi Adeyemi/)).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("shows an Ended badge for an ended assignment", () => {
    render(
      <AssignmentsList
        assignments={[buildAssignment({ status: "ENDED", endedAt: "2026-02-01T00:00:00.000Z" })]}
      />
    );
    expect(screen.getByText("Ended")).toBeInTheDocument();
  });

  it("links the pairing to the assignment's detail page", () => {
    render(<AssignmentsList assignments={[buildAssignment()]} />);
    expect(screen.getByRole("link", { name: /Amaka Obi/ })).toHaveAttribute(
      "href",
      "/admin/assignments/assignment_1"
    );
  });

  it("navigates to the detail page when the row itself is clicked", () => {
    render(<AssignmentsList assignments={[buildAssignment()]} />);

    fireEvent.click(screen.getByText("Active"));

    expect(push).toHaveBeenCalledWith("/admin/assignments/assignment_1");
  });
});
