import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("renders the title and description", () => {
    render(<PageHeader title="My Students" description="The children you manage." />);
    expect(screen.getByRole("heading", { name: "My Students" })).toBeInTheDocument();
    expect(screen.getByText("The children you manage.")).toBeInTheDocument();
  });

  it("renders the action slot when provided", () => {
    render(
      <PageHeader title="My Students" description="..." action={<button>Add child</button>} />
    );
    expect(screen.getByRole("button", { name: "Add child" })).toBeInTheDocument();
  });

  it("renders no action slot when omitted", () => {
    render(<PageHeader title="My Students" description="..." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a back link when backHref is provided", () => {
    render(
      <PageHeader
        title="Amaka Obi"
        description="..."
        backHref="/parent/students"
        backLabel="My Students"
      />
    );
    expect(screen.getByRole("link", { name: /My Students/ })).toHaveAttribute(
      "href",
      "/parent/students"
    );
  });

  it("renders no back link when backHref is omitted", () => {
    render(<PageHeader title="My Students" description="..." />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
