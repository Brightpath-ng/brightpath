import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Book a tutor</Button>);
    expect(screen.getByRole("button", { name: "Book a tutor" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the button and shows a spinner when loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>
    );
    const button = screen.getByRole("button", { name: /saving/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).not.toBeNull();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("respects the disabled prop independent of loading", () => {
    render(<Button disabled>Can&apos;t click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards a ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref target</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges a custom className without dropping variant styles", () => {
    render(<Button className="my-custom-class">Styled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("my-custom-class");
    expect(button.className).toContain("var(--accent)");
  });

  it("renders the outline variant with a transparent background and accent border", () => {
    render(<Button variant="outline">Become a Tutor</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-[var(--accent)]");
    expect(button.className).toContain("bg-transparent");
  });
});
