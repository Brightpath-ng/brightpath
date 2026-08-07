import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { StudentProfile } from "@brightpath/types";

const addStudent = vi.fn();

vi.mock("../../api/actions.js", () => ({
  addStudent: (input: unknown) => addStudent(input),
}));

const { StudentsPageContent } = await import("../StudentsPageContent.js");

function buildStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: "student_1",
    parentId: "user_1",
    name: "Amaka Obi",
    school: "Corona School",
    class: "JSS 2",
    learningGoals: null,
    learningChallenges: null,
    learningTrack: "tutor_led",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("StudentsPageContent", () => {
  beforeEach(() => {
    addStudent.mockReset().mockResolvedValue(undefined);
  });

  it("renders the page header and the students list", () => {
    render(<StudentsPageContent students={[buildStudent()]} />);
    expect(screen.getByRole("heading", { name: "My Students" })).toBeInTheDocument();
    expect(screen.getByText("Amaka Obi")).toBeInTheDocument();
  });

  it("opens the Add child sheet when the header action is clicked", () => {
    render(<StudentsPageContent students={[]} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(screen.getByRole("dialog", { name: "Add a child" })).toBeInTheDocument();
  });

  it("closes the sheet and shows a toast after a successful submission", async () => {
    render(<StudentsPageContent students={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Chidinma" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add child" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(await screen.findByRole("status")).toHaveTextContent("Child added.");
  });

  it("doesn't leak field values into a freshly reopened sheet", () => {
    render(<StudentsPageContent students={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Add child" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Stale name" } });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
  });
});
