import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Assignment } from "@brightpath/types";
import { AssignmentDetail } from "../AssignmentDetail";

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

describe("AssignmentDetail", () => {
  it("renders the student, tutor, their subjects, and Active status", () => {
    render(<AssignmentDetail assignment={buildAssignment()} />);
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("Ngozi Adeyemi")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Not ended")).toBeInTheDocument();
  });

  it("shows the ended date and Ended status for an ended assignment", () => {
    render(
      <AssignmentDetail
        assignment={buildAssignment({ status: "ENDED", endedAt: "2026-02-01T00:00:00.000Z" })}
      />
    );
    // "Ended" appears twice: the status badge and the field label -- both
    // are expected here, so assert the count rather than a single match.
    expect(screen.getAllByText("Ended")).toHaveLength(2);
    expect(screen.getByText("2/1/2026")).toBeInTheDocument();
    expect(screen.queryByText("Not ended")).not.toBeInTheDocument();
  });
});
