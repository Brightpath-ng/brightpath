import { render, screen, act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToastContainer, useToast } from "../toast";

describe("ToastContainer", () => {
  it("renders nothing when there are no toasts", () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a toast message with a status live region", () => {
    render(
      <ToastContainer
        toasts={[{ id: "1", message: "Child added.", variant: "success" }]}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Child added.");
  });
});

describe("useToast", () => {
  it("adds and removes toasts", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast("Child added.");
    });
    expect(result.current.toasts).toHaveLength(1);

    const id = result.current.toasts[0]!.id;
    act(() => {
      result.current.removeToast(id);
    });
    expect(result.current.toasts).toHaveLength(0);
  });
});
