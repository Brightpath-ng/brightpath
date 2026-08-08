import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const addStudent = vi.fn();
const updateStudent = vi.fn();

vi.mock("../../api/actions.js", () => ({
  addStudent: (input: unknown) => addStudent(input),
  updateStudent: (id: string, input: unknown) => updateStudent(id, input),
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const { AddStudentForm } = await import("../AddStudentForm.js");

describe("AddStudentForm (create mode)", () => {
  beforeEach(() => {
    push.mockReset();
    addStudent.mockReset().mockResolvedValue({ id: "student_1", name: "Chidinma" });
    updateStudent.mockReset();
  });

  it("renders all fields, empty, with the create button label", () => {
    render(<AddStudentForm />);
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText(/School/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Class/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Learning goals/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Learning challenges/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add child" })).toBeInTheDocument();
  });

  it("shows a validation error and doesn't call addStudent when name is missing", async () => {
    render(<AddStudentForm />);

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(addStudent).not.toHaveBeenCalled();
  });

  it("submits with only the required name field", async () => {
    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma" } });

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    await waitFor(() =>
      expect(addStudent).toHaveBeenCalledWith({
        name: "Chidinma",
      })
    );
  });

  it("navigates to the new student's detail page on success", async () => {
    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma" } });

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/parent/students/student_1"));
  });

  it("shows an error message when addStudent fails", async () => {
    addStudent.mockRejectedValue(new Error("network down"));
    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma" } });

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't add/i);
    expect(push).not.toHaveBeenCalled();
  });
});

describe("AddStudentForm (edit mode)", () => {
  beforeEach(() => {
    push.mockReset();
    addStudent.mockReset();
    updateStudent.mockReset().mockResolvedValue({ id: "student_1", name: "Chidinma Eze" });
  });

  it("pre-fills fields from initialValues and shows the save button label", () => {
    render(
      <AddStudentForm
        studentId="student_1"
        initialValues={{ name: "Chidinma", school: "Corona School" }}
      />
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Chidinma");
    expect(screen.getByLabelText(/School/)).toHaveValue("Corona School");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("calls updateStudent, not addStudent, and navigates back to the detail page", async () => {
    render(<AddStudentForm studentId="student_1" initialValues={{ name: "Chidinma" }} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma Eze" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(updateStudent).toHaveBeenCalledWith("student_1", { name: "Chidinma Eze" })
    );
    expect(addStudent).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/parent/students/student_1");
  });

  it("shows an edit-specific error message when updateStudent fails", async () => {
    updateStudent.mockRejectedValue(new Error("network down"));
    render(<AddStudentForm studentId="student_1" initialValues={{ name: "Chidinma" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't save/i);
    expect(push).not.toHaveBeenCalled();
  });
});
