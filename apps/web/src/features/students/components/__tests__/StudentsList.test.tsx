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

  it("renders each student's name, initial, and learning track", () => {
    render(<StudentsList students={[buildStudent()]} />);
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("Tutor-led")).toBeInTheDocument();
  });

  it("renders one row per student", () => {
    render(
      <StudentsList
        students={[buildStudent(), buildStudent({ id: "student_2", name: "David Chukwu" })]}
      />
    );
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("David Chukwu")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });
});
