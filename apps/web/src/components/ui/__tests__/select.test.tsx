import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select, type SelectOption } from "../select";

const OPTIONS: SelectOption[] = [
  { id: "1", label: "Amaka Obi", meta: "Corona School · JSS 2" },
  { id: "2", label: "David Chukwu" },
];

function ControlledSelect() {
  const [value, setValue] = useState("");
  return (
    <Select
      id="testSelect"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      placeholder="Select a student"
    />
  );
}

describe("Select", () => {
  it("shows the placeholder when nothing is selected and no panel by default", () => {
    render(<Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />);
    expect(screen.getByRole("button", { name: "Select a student" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the panel on trigger click, showing a search box and every option", () => {
    render(<Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Amaka Obi/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "David Chukwu" })).toBeInTheDocument();
  });

  it("shows an option's meta line", () => {
    render(<Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));
    expect(screen.getByText("Corona School · JSS 2")).toBeInTheDocument();
  });

  it("filters options as the search box is typed into", () => {
    render(<Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));

    fireEvent.change(screen.getByLabelText("Search select a student"), { target: { value: "david" } });

    expect(screen.getByRole("option", { name: "David Chukwu" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Amaka Obi/ })).not.toBeInTheDocument();
  });

  it("shows an empty message when nothing matches", () => {
    render(<Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));

    fireEvent.change(screen.getByLabelText("Search select a student"), { target: { value: "zzz" } });

    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("selects an option on click, updates the trigger label, and closes the panel", () => {
    render(<ControlledSelect />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));
    fireEvent.click(screen.getByRole("option", { name: /David Chukwu/ }));

    expect(screen.getByRole("button", { name: "David Chukwu" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the currently selected option with aria-selected", () => {
    render(
      <Select id="s" options={OPTIONS} value="2" onChange={() => {}} placeholder="Select a student" />
    );
    fireEvent.click(screen.getByRole("button", { name: "David Chukwu" }));

    expect(screen.getByRole("option", { name: /David Chukwu/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: /Amaka Obi/ })).toHaveAttribute("aria-selected", "false");
  });

  it("selects the highlighted option on Enter after arrowing down", () => {
    render(<ControlledSelect />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));
    const search = screen.getByLabelText("Search select a student");

    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "Enter" });

    expect(screen.getByRole("button", { name: "David Chukwu" })).toBeInTheDocument();
  });

  it("closes on Escape without changing the selection", () => {
    render(<ControlledSelect />);
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select a student" })).toBeInTheDocument();
  });

  it("closes when clicking outside the panel", () => {
    render(
      <div>
        <Select id="s" options={OPTIONS} value="" onChange={() => {}} placeholder="Select a student" />
        <button>Outside</button>
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "Select a student" }));
    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
