import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const endAssignment = vi.fn();

vi.mock("../../api/actions.js", () => ({
  endAssignment: (id: string) => endAssignment(id),
}));

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const { EndAssignmentButton } = await import("../EndAssignmentButton.js");

describe("EndAssignmentButton", () => {
  beforeEach(() => {
    refresh.mockReset();
    endAssignment.mockReset().mockResolvedValue({ id: "assignment_1", status: "ENDED" });
  });

  it("does not show the confirmation dialog until clicked", () => {
    render(
      <EndAssignmentButton assignmentId="assignment_1" studentName="Amaka" tutorName="Ngozi" />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a confirmation dialog naming both people before ending", () => {
    render(
      <EndAssignmentButton assignmentId="assignment_1" studentName="Amaka" tutorName="Ngozi" />
    );

    fireEvent.click(screen.getByRole("button", { name: "End assignment" }));

    expect(screen.getByRole("dialog")).toHaveTextContent("Ngozi");
    expect(screen.getByRole("dialog")).toHaveTextContent("Amaka");
    expect(endAssignment).not.toHaveBeenCalled();
  });

  it("does not call endAssignment when cancelled", () => {
    render(
      <EndAssignmentButton assignmentId="assignment_1" studentName="Amaka" tutorName="Ngozi" />
    );

    fireEvent.click(screen.getByRole("button", { name: "End assignment" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(endAssignment).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls endAssignment and refreshes on confirm", async () => {
    render(
      <EndAssignmentButton assignmentId="assignment_1" studentName="Amaka" tutorName="Ngozi" />
    );

    fireEvent.click(screen.getByRole("button", { name: "End assignment" }));
    fireEvent.click(screen.getAllByRole("button", { name: "End assignment" })[1]!);

    await waitFor(() => expect(endAssignment).toHaveBeenCalledWith("assignment_1"));
    expect(refresh).toHaveBeenCalled();
  });

  it("shows an error message when endAssignment fails", async () => {
    endAssignment.mockRejectedValue(new Error("network down"));
    render(
      <EndAssignmentButton assignmentId="assignment_1" studentName="Amaka" tutorName="Ngozi" />
    );

    fireEvent.click(screen.getByRole("button", { name: "End assignment" }));
    fireEvent.click(screen.getAllByRole("button", { name: "End assignment" })[1]!);

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't end/i);
  });
});
