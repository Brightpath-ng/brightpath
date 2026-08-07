import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StudentProfile } from "@brightpath/types";
import { StudentsList } from "../StudentsList";

function buildStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: "student_1",
    parentId: "user_1",
    name: "Amaka Obi",
    school: "Corona School",
    class: "JSS 2",
    learningGoals: "Improve algebra",
    learningChallenges: null,
    learningTrack: "tutor_led",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("StudentsList", () => {
  it("shows an empty state when there are no students", () => {
    render(<StudentsList students={[]} />);
    expect(screen.getByText("No children added yet.")).toBeInTheDocument();
  });

  it("renders each student's details", () => {
    render(<StudentsList students={[buildStudent()]} />);
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("Corona School · JSS 2")).toBeInTheDocument();
    expect(screen.getByText("Goals: Improve algebra")).toBeInTheDocument();
    expect(screen.getByText("Tutor-led")).toBeInTheDocument();
  });

  it("omits the school/class line and challenges when not set", () => {
    render(
      <StudentsList
        students={[buildStudent({ school: null, class: null, learningGoals: null })]}
      />
    );
    expect(screen.queryByText("Corona School · JSS 2")).not.toBeInTheDocument();
    expect(screen.queryByText(/Goals:/)).not.toBeInTheDocument();
  });
});
