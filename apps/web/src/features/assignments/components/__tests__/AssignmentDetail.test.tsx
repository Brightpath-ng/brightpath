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
    assignedBy: { id: "admin_user_1", name: "Femi Adisa" },
    ...overrides,
  };
}

describe("AssignmentDetail", () => {
  it("renders the student, tutor, their subjects, Active status, and who assigned it", () => {
    const assignment = buildAssignment();
    render(<AssignmentDetail assignment={assignment} allAssignments={[assignment]} />);
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("Ngozi Adeyemi")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Not ended")).toBeInTheDocument();
    expect(screen.getByText(/Assigned by Femi Adisa on/)).toBeInTheDocument();
  });

  it("shows the ended date and Ended status for an ended assignment", () => {
    const assignment = buildAssignment({ status: "ENDED", endedAt: "2026-02-01T00:00:00.000Z" });
    render(<AssignmentDetail assignment={assignment} allAssignments={[assignment]} />);
    // "Ended" appears twice: the status badge and the field label -- both
    // are expected here, so assert the count rather than a single match.
    expect(screen.getAllByText("Ended")).toHaveLength(2);
    expect(screen.getByText("2/1/2026")).toBeInTheDocument();
    expect(screen.queryByText("Not ended")).not.toBeInTheDocument();
  });

  it("shows a neutral message when the tutor has no other active students", () => {
    const assignment = buildAssignment();
    render(<AssignmentDetail assignment={assignment} allAssignments={[assignment]} />);
    expect(screen.getByText("Not currently tutoring any other students.")).toBeInTheDocument();
  });

  it("lists the tutor's other active students, excluding this assignment and ended ones", () => {
    const assignment = buildAssignment();
    const otherActive = buildAssignment({
      id: "assignment_2",
      student: { id: "student_2", name: "David Chukwu" },
    });
    const otherEnded = buildAssignment({
      id: "assignment_3",
      status: "ENDED",
      endedAt: "2026-01-05T00:00:00.000Z",
      student: { id: "student_3", name: "Tari Amadi" },
    });
    render(
      <AssignmentDetail
        assignment={assignment}
        allAssignments={[assignment, otherActive, otherEnded]}
      />
    );

    expect(screen.getByText("David Chukwu")).toBeInTheDocument();
    expect(screen.queryByText("Tari Amadi")).not.toBeInTheDocument();
  });

  it("shows a history timeline for the student, newest first", () => {
    const current = buildAssignment();
    const past = buildAssignment({
      id: "assignment_old",
      status: "ENDED",
      assignedAt: "2025-11-01T00:00:00.000Z",
      endedAt: "2026-01-01T00:00:00.000Z",
      tutor: { id: "tutor_2", name: "Chukwuemeka Obi", subjects: [] },
    });
    render(<AssignmentDetail assignment={current} allAssignments={[current, past]} />);

    expect(screen.getByText("Assigned to Ngozi Adeyemi")).toBeInTheDocument();
    expect(screen.getByText("Assigned to Chukwuemeka Obi")).toBeInTheDocument();
    expect(screen.getByText(/1\/1\/2026 · Active/)).toBeInTheDocument();
    expect(screen.getByText(/11\/1\/2025.*1\/1\/2026.*Ended/)).toBeInTheDocument();
  });
});
