import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../modal";

function OpenableModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)} title="End this assignment?">
        <p>Confirm</p>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="End this assignment?">
        <p>Confirm</p>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the title, description, and children when open", () => {
    render(
      <Modal open onClose={vi.fn()} title="End this assignment?" description="This can't be undone.">
        <p>Confirm this</p>
      </Modal>
    );

    expect(screen.getByRole("dialog", { name: "End this assignment?" })).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
    expect(screen.getByText("Confirm this")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="End this assignment?">
        <p>Confirm</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="End this assignment?">
        <p>Confirm</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the panel when opened", () => {
    render(
      <Modal open onClose={vi.fn()} title="End this assignment?">
        <p>Confirm</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("restores focus to the previously focused element on close", () => {
    render(<OpenableModal />);
    const openButton = screen.getByRole("button", { name: "Open" });
    openButton.focus();
    fireEvent.click(openButton);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(openButton).toHaveFocus();
  });
});
