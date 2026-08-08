"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  TrendingUp,
  CreditCard,
  ClipboardCheck,
  Wallet,
  ShieldAlert,
  UserCog,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

// Server Component layouts define nav items, but a raw component reference
// (e.g. `icon: LayoutDashboard`) can't cross the Server -> Client boundary as
// a plain prop -- only rendered JSX elements or Server Actions can. Layouts
// pass an icon *name* instead, resolved against this client-side registry.
const ICONS = {
  LayoutDashboard,
  Users,
  BookOpen,
  TrendingUp,
  CreditCard,
  ClipboardCheck,
  Wallet,
  ShieldAlert,
  UserCog,
} as const;

export type AppIconName = keyof typeof ICONS;

export interface AppNavItem {
  label: string;
  href: string;
  icon: AppIconName;
}

export interface AppPlannedItem {
  label: string;
  icon: AppIconName;
}

interface AppShellProps {
  brandLabel: string;
  accountRoleLabel: string;
  navItems: AppNavItem[];
  plannedItems?: AppPlannedItem[];
  children: ReactNode;
}

export function AppShell({
  brandLabel,
  accountRoleLabel,
  navItems,
  plannedItems = [],
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <button
        type="button"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
        aria-controls="app-sidebar"
        onClick={() => setIsMobileOpen((open) => !open)}
        className="fixed top-4 left-4 z-30 flex size-9 items-center justify-center rounded-[var(--radius-md)] lg:hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border-subtle)", color: "var(--text-primary)" }}
      >
        {isMobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(13,13,26,0.4)" }}
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={
          "fixed inset-y-0 left-0 z-20 flex w-[272px] shrink-0 flex-col p-4 transition-transform duration-200 lg:static lg:translate-x-0 " +
          (isMobileOpen ? "translate-x-0" : "-translate-x-full")
        }
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--bg-border-subtle)" }}
      >
        <div className="flex items-center gap-2.5 px-1 pb-5">
          <span className="size-6 shrink-0 rounded-[var(--radius-sm)]" style={{ background: "var(--accent)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {brandLabel}
          </span>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Main">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors"
                style={
                  isActive
                    ? { background: "var(--accent-dim)", color: "var(--accent)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {plannedItems.length > 0 ? (
          <nav className="mt-4 flex flex-col gap-1" aria-label="Planned">
            {plannedItems.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                  <span
                    className="ml-auto rounded-[var(--radius-full)] px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border-subtle)", color: "var(--text-tertiary)" }}
                  >
                    Soon
                  </span>
                </div>
              );
            })}
          </nav>
        ) : null}

        <div className="flex-1" />

        <div
          className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5"
          style={{ borderTop: "1px solid var(--bg-border-subtle)" }}
        >
          <UserButton />
          <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            {accountRoleLabel}
          </span>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
