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
  it("always renders an Add child card, even with no students", () => {
    render(<StudentsList students={[]} />);
    expect(screen.getByRole("link", { name: /Add child/ })).toHaveAttribute(
      "href",
      "/parent/students/new"
    );
  });

  it("renders each student's name, school/class, and learning track on a profile card", () => {
    render(<StudentsList students={[buildStudent()]} />);
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("Corona School · JSS 2")).toBeInTheDocument();
    expect(screen.getByText("Tutor-led")).toBeInTheDocument();
  });

  it("links each card to the student's detail page", () => {
    render(<StudentsList students={[buildStudent()]} />);
    expect(screen.getByRole("link", { name: /Amaka Obi/ })).toHaveAttribute(
      "href",
      "/parent/students/student_1"
    );
  });

  it("shows a fallback line when neither school nor class is set", () => {
    render(<StudentsList students={[buildStudent({ school: null, class: null })]} />);
    expect(screen.getByText("No school on file")).toBeInTheDocument();
  });

  it("renders one card per student plus the Add child card", () => {
    render(
      <StudentsList
        students={[buildStudent(), buildStudent({ id: "student_2", name: "David Chukwu" })]}
      />
    );
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
    expect(screen.getByText("David Chukwu")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
