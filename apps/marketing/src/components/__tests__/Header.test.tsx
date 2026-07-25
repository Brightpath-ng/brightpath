import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "../Header";

describe("Header", () => {
  it("renders the logo link back to home", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "BrightPath" })).toHaveAttribute("href", "/");
  });

  it("renders the desktop nav links, sign-in link, and primary CTA", () => {
    render(<Header />);
    const mainNav = screen.getByRole("navigation", { name: "Main" });
    expect(within(mainNav).getByRole("link", { name: "How it Works" })).toHaveAttribute(
      "href",
      "/how-it-works"
    );
    expect(within(mainNav).getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing"
    );
    expect(within(mainNav).getByRole("link", { name: "Trust & Safety" })).toHaveAttribute(
      "href",
      "/trust-safety"
    );
    expect(within(mainNav).getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("button", { name: "Find a Tutor" })).toBeInTheDocument();
  });

  it("keeps the mobile menu closed by default", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("opens and closes the mobile menu when the toggle is clicked", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: "Open menu" });

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(mobileNav).getByRole("link", { name: "How it Works" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
