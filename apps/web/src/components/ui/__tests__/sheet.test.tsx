import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sheet } from "../sheet";

function OpenableSheet() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Add a child">
        <p>Form</p>
      </Sheet>
    </>
  );
}

describe("Sheet", () => {
  it("renders the title, description, and children", () => {
    render(
      <Sheet open onClose={vi.fn()} title="Add a child" description="Fill in the details.">
        <p>Form goes here</p>
      </Sheet>
    );

    expect(screen.getByRole("dialog", { name: "Add a child" })).toBeInTheDocument();
    expect(screen.getByText("Fill in the details.")).toBeInTheDocument();
    expect(screen.getByText("Form goes here")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="Add a child">
        <p>Form</p>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="Add a child">
        <p>Form</p>
      </Sheet>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the panel when opened", () => {
    render(
      <Sheet open onClose={vi.fn()} title="Add a child">
        <p>Form</p>
      </Sheet>
    );

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("restores focus to the previously focused element on close", () => {
    render(<OpenableSheet />);
    const openButton = screen.getByRole("button", { name: "Open" });
    openButton.focus();
    fireEvent.click(openButton);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(openButton).toHaveFocus();
  });
});
