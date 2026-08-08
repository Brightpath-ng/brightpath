import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { StudentProfile, TutorApplicationSummary } from "@brightpath/types";

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

describe("AssignmentForm", () => {
  beforeEach(() => {
    push.mockReset();
    assignTutor.mockReset().mockResolvedValue({ id: "assignment_1" });
  });

  it("renders the student and tutor selects", () => {
    render(<AssignmentForm students={students} tutors={tutors} />);
    expect(screen.getByLabelText("Student")).toBeInTheDocument();
    expect(screen.getByLabelText("Tutor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign tutor" })).toBeInTheDocument();
  });

  it("shows a message instead of the form when there are no students", () => {
    render(<AssignmentForm students={[]} tutors={tutors} />);
    expect(screen.getByText("No students have been added yet.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Student")).not.toBeInTheDocument();
  });

  it("shows a message instead of the form when there are no approved tutors", () => {
    render(<AssignmentForm students={students} tutors={[]} />);
    expect(screen.getByText(/No approved tutors yet/)).toBeInTheDocument();
  });

  it("shows a validation error when submitted without selecting both", () => {
    render(<AssignmentForm students={students} tutors={tutors} />);

    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    expect(screen.getByRole("alert")).toHaveTextContent(/choose both/i);
    expect(assignTutor).not.toHaveBeenCalled();
  });

  it("submits the selected student and tutor and navigates to the detail page", async () => {
    render(<AssignmentForm students={students} tutors={tutors} />);

    fireEvent.change(screen.getByLabelText("Student"), { target: { value: "student_1" } });
    fireEvent.change(screen.getByLabelText("Tutor"), { target: { value: "tutor_1" } });
    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    await waitFor(() =>
      expect(assignTutor).toHaveBeenCalledWith({ studentId: "student_1", tutorId: "tutor_1" })
    );
    expect(push).toHaveBeenCalledWith("/admin/assignments/assignment_1");
  });

  it("shows an error message when assignTutor fails", async () => {
    assignTutor.mockRejectedValue(new Error("network down"));
    render(<AssignmentForm students={students} tutors={tutors} />);

    fireEvent.change(screen.getByLabelText("Student"), { target: { value: "student_1" } });
    fireEvent.change(screen.getByLabelText("Tutor"), { target: { value: "tutor_1" } });
    fireEvent.click(screen.getByRole("button", { name: "Assign tutor" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't create/i);
    expect(push).not.toHaveBeenCalled();
  });
});
