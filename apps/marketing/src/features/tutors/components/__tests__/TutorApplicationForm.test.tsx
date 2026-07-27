import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TutorApplicationForm } from "../TutorApplicationForm";

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ngozi" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Adeyemi" } });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ngozi@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+2348012345678" } });

  const subjectsInput = screen.getByLabelText("Subjects you teach");
  fireEvent.change(subjectsInput, { target: { value: "Mathematics" } });
  fireEvent.keyDown(subjectsInput, { key: "Enter" });

  fireEvent.change(screen.getByLabelText("Qualifications & experience"), {
    target: { value: "BSc Mathematics, 5 years tutoring experience" },
  });
}

describe("TutorApplicationForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders all fields", () => {
    render(<TutorApplicationForm />);
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Subjects you teach")).toBeInTheDocument();
    expect(screen.getByLabelText("Qualifications & experience")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit application" })).toBeInTheDocument();
  });

  it("adds a subject chip when Enter is pressed", () => {
    render(<TutorApplicationForm />);
    const subjectsInput = screen.getByLabelText("Subjects you teach");

    fireEvent.change(subjectsInput, { target: { value: "Mathematics" } });
    fireEvent.keyDown(subjectsInput, { key: "Enter" });

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(subjectsInput).toHaveValue("");
  });

  it("removes a subject chip when its remove button is clicked", () => {
    render(<TutorApplicationForm />);
    const subjectsInput = screen.getByLabelText("Subjects you teach");
    fireEvent.change(subjectsInput, { target: { value: "Mathematics" } });
    fireEvent.keyDown(subjectsInput, { key: "Enter" });

    fireEvent.click(screen.getByRole("button", { name: "Remove Mathematics" }));

    expect(screen.queryByText("Mathematics")).not.toBeInTheDocument();
  });

  it("shows a validation error and doesn't call fetch when required fields are missing", async () => {
    render(<TutorApplicationForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a confirmation message on a successful submission", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 201 }));
    render(<TutorApplicationForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    expect(await screen.findByText("Application received")).toBeInTheDocument();
  });

  it("shows a specific message on a 409 duplicate application", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 409 }));
    render(<TutorApplicationForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    expect(await screen.findByText(/application already exists/i)).toBeInTheDocument();
  });

  it("shows a generic error message on an unexpected failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));
    render(<TutorApplicationForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/couldn't reach/i));
  });
});
