import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LayoutDashboard, Users } from "lucide-react";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

const usePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, onClick, className, style }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <a href={href} onClick={onClick} className={className} style={style}>
      {children}
    </a>
  ),
}));

const { AppShell } = await import("../AppShell.js");

const NAV_ITEMS = [
  { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
  { label: "My Students", href: "/parent/students", icon: Users },
];

const PLANNED_ITEMS = [{ label: "Lessons", icon: Users }];

describe("AppShell", () => {
  it("renders the brand label and nav items", () => {
    usePathname.mockReturnValue("/parent");
    render(
      <AppShell brandLabel="BrightPath" accountRoleLabel="Parent" navItems={NAV_ITEMS}>
        <p>Content</p>
      </AppShell>
    );

    expect(screen.getByText("BrightPath")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("href", "/parent");
    expect(screen.getByRole("link", { name: /My Students/ })).toHaveAttribute(
      "href",
      "/parent/students"
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders the Clerk user button and role label", () => {
    usePathname.mockReturnValue("/parent");
    render(
      <AppShell brandLabel="BrightPath" accountRoleLabel="Parent" navItems={NAV_ITEMS}>
        <p>Content</p>
      </AppShell>
    );

    expect(screen.getByTestId("user-button")).toBeInTheDocument();
    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("highlights the nav item matching the current pathname", () => {
    usePathname.mockReturnValue("/parent/students");
    render(
      <AppShell brandLabel="BrightPath" accountRoleLabel="Parent" navItems={NAV_ITEMS}>
        <p>Content</p>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: /My Students/ })).toHaveStyle({
      color: "var(--accent)",
    });
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveStyle({
      color: "var(--text-secondary)",
    });
  });

  it("renders planned items as disabled with a Soon tag, not as links", () => {
    usePathname.mockReturnValue("/parent");
    render(
      <AppShell
        brandLabel="BrightPath"
        accountRoleLabel="Parent"
        navItems={NAV_ITEMS}
        plannedItems={PLANNED_ITEMS}
      >
        <p>Content</p>
      </AppShell>
    );

    expect(screen.queryByRole("link", { name: /Lessons/ })).not.toBeInTheDocument();
    expect(screen.getByText("Lessons")).toBeInTheDocument();
    expect(screen.getByText("Soon")).toBeInTheDocument();
  });

  it("keeps the mobile drawer closed by default and toggles it open/closed", () => {
    usePathname.mockReturnValue("/parent");
    render(
      <AppShell brandLabel="BrightPath" accountRoleLabel="Parent" navItems={NAV_ITEMS}>
        <p>Content</p>
      </AppShell>
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
