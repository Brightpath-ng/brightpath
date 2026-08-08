import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Assignment, StudentProfile, TutorApplicationSummary } from "@brightpath/types";

const assignTutor = vi.fn();

vi.mock("../../api/actions.js", () => ({
  assignTutor: (input: unknown) => assignTutor(input),
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const { AssignmentForm } = await import("../AssignmentForm.js");

const students: StudentProfile[] = [
  {
    id: "student_1",
    parentId: "parent_1",
    name: "Amaka Obi",
    school: null,
    class: null,
    learningGoals: null,
    learningChallenges: null,
    learningTrack: "tutor_led",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const tutors: TutorApplicationSummary[] = [
  {
    id: "tutor_1",
    userId: "tutor_user_1",
    subjects: ["Mathematics"],
    qualifications: "BSc Mathematics",
    bio: null,
    status: "APPROVED",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    name: "Ngozi Adeyemi",
    email: "ngozi@example.com",
  },
];

function buildActiveAssignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: "assignment_existing",
    status: "ACTIVE",
    assignedById: "admin_user_1",
    assignedAt: "2026-01-01T00:00:00.000Z",
    endedAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    student: { id: "student_1", name: "Amaka Obi" },
    tutor: { id: "tutor_2", name: "Chukwuemeka Obi", subjects: [] },
    ...overrides,
  };
}

function selectOption(labelText: string, optionName: string | RegExp) {
  fireEvent.click(screen.getByLabelText(labelText));
  fireEvent.click(screen.getByRole("option", { name: optionName }));
}

describe("AssignmentForm", () => {
  beforeEach(() => {
    push.mockReset();
    assignTutor.mockReset().mockResolvedValue({ id: "assignment_1" });
  });

  it("renders the student and tutor selects", () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);
    expect(screen.getByLabelText("Student")).toBeInTheDocument();
    expect(screen.getByLabelText("Tutor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign tutor" })).toBeInTheDocument();
  });

  it("shows a message instead of the form when there are no students", () => {
    render(<AssignmentForm students={[]} tutors={tutors} assignments={[]} />);
    expect(screen.getByText("No students have been added yet.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Student")).not.toBeInTheDocument();
  });

  it("shows a message instead of the form when there are no approved tutors", () => {
    render(<AssignmentForm students={students} tutors={[]} assignments={[]} />);
    expect(screen.getByText(/No approved tutors yet/)).toBeInTheDocument();
  });

  it("shows a validation error when submitted without selecting both", () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    expect(screen.getByRole("alert")).toHaveTextContent(/choose both/i);
    expect(assignTutor).not.toHaveBeenCalled();
  });

  it("opens the student select with a search box and avatar-prefixed options", () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    fireEvent.click(screen.getByLabelText("Student"));

    expect(screen.getByRole("listbox", { name: "Select a student" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Amaka Obi/ })).toBeInTheDocument();
  });

  it("filters options as you type in the select's search box", () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    fireEvent.click(screen.getByLabelText("Student"));
    fireEvent.change(screen.getByLabelText("Search select a student"), {
      target: { value: "zzz" },
    });

    expect(screen.getByText("No matches")).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Amaka Obi/ })).not.toBeInTheDocument();
  });

  it("shows a live preview once both are selected", () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    selectOption("Student", /Amaka Obi/);
    selectOption("Tutor", /Ngozi Adeyemi/);

    expect(screen.getByText("Ready to assign.")).toBeInTheDocument();
  });

  it("warns when the student already has an active assignment to a different tutor", () => {
    render(
      <AssignmentForm
        students={students}
        tutors={tutors}
        assignments={[buildActiveAssignment()]}
      />
    );

    selectOption("Student", /Amaka Obi/);
    selectOption("Tutor", /Ngozi Adeyemi/);

    expect(
      screen.getByText(/Currently assigned to Chukwuemeka Obi.*will end that assignment/)
    ).toBeInTheDocument();
  });

  it("shows a neutral message when the selected tutor already matches the active assignment", () => {
    render(
      <AssignmentForm
        students={students}
        tutors={tutors}
        assignments={[buildActiveAssignment({ tutor: { id: "tutor_1", name: "Ngozi Adeyemi", subjects: [] } })]}
      />
    );

    selectOption("Student", /Amaka Obi/);
    selectOption("Tutor", /Ngozi Adeyemi/);

    expect(screen.getByText("Already assigned to Ngozi Adeyemi.")).toBeInTheDocument();
  });

  it("submits the selected student and tutor and navigates to the detail page", async () => {
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    selectOption("Student", /Amaka Obi/);
    selectOption("Tutor", /Ngozi Adeyemi/);
    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    await waitFor(() =>
      expect(assignTutor).toHaveBeenCalledWith({ studentId: "student_1", tutorId: "tutor_1" })
    );
    expect(push).toHaveBeenCalledWith("/admin/assignments/assignment_1");
  });

  it("shows an error message when assignTutor fails", async () => {
    assignTutor.mockRejectedValue(new Error("network down"));
    render(<AssignmentForm students={students} tutors={tutors} assignments={[]} />);

    selectOption("Student", /Amaka Obi/);
    selectOption("Tutor", /Ngozi Adeyemi/);
    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't create/i);
    expect(push).not.toHaveBeenCalled();
  });
});
