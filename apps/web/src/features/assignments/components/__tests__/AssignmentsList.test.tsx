import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Assignment } from "@brightpath/types";
import { AssignmentsList } from "../AssignmentsList";

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
  it("shows an empty state with a create CTA when there are no assignments", () => {
    render(<AssignmentsList assignments={[]} />);
    expect(screen.getByText("No assignments yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Assign a tutor/ })).toHaveAttribute(
      "href",
      "/admin/assignments/new"
    );
  });

  it("renders the student and tutor names and an Active badge", () => {
    render(<AssignmentsList assignments={[buildAssignment()]} />);
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

  it("links each row to the assignment's detail page", () => {
    render(<AssignmentsList assignments={[buildAssignment()]} />);
    expect(screen.getByRole("link", { name: /Amaka Obi/ })).toHaveAttribute(
      "href",
      "/admin/assignments/assignment_1"
    );
  });
});
