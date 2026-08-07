import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const addStudent = vi.fn();

vi.mock("../../api/actions.js", () => ({
  addStudent: (input: unknown) => addStudent(input),
}));

const { AddStudentForm } = await import("../AddStudentForm.js");

describe("AddStudentForm", () => {
  beforeEach(() => {
    addStudent.mockReset().mockResolvedValue(undefined);
  });

  it("renders all fields", () => {
    render(<AddStudentForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
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

  it("shows a confirmation message on a successful submission", async () => {
    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma" } });

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(await screen.findByText("Added Chidinma.")).toBeInTheDocument();
  });

  it("shows an error message when addStudent fails", async () => {
    addStudent.mockRejectedValue(new Error("network down"));
    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Chidinma" } });

    fireEvent.click(screen.getByRole("button", { name: "Add child" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't add/i);
  });
});
