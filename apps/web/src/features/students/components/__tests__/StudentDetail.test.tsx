import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StudentProfile } from "@brightpath/types";
import { StudentDetail } from "../StudentDetail";

function buildStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: "student_1",
    parentId: "user_1",
    name: "Amaka Obi",
    school: "Corona School",
    class: "JSS 2",
    learningGoals: "Improve algebra",
    learningChallenges: "Struggles with word problems",
    learningTrack: "tutor_led",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("StudentDetail", () => {
  it("renders every field when set", () => {
    render(<StudentDetail student={buildStudent()} />);
    expect(screen.getByText("Corona School")).toBeInTheDocument();
    expect(screen.getByText("JSS 2")).toBeInTheDocument();
    expect(screen.getByText("Improve algebra")).toBeInTheDocument();
    expect(screen.getByText("Struggles with word problems")).toBeInTheDocument();
    expect(screen.getByText("Tutor-led")).toBeInTheDocument();
  });

  it("shows a fallback for fields that aren't set", () => {
    render(
      <StudentDetail
        student={buildStudent({
          school: null,
          class: null,
          learningGoals: null,
          learningChallenges: null,
        })}
      />
    );
    expect(screen.getAllByText("Not on file")).toHaveLength(4);
  });
});
