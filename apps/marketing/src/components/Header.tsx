"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@brightpath/ui";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust & Safety", href: "/trust-safety" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 px-6"
      style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--bg-border-subtle)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <a href="/" className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          BrightPath
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="/sign-in" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Sign in
          </a>
          <Button size="md">Find a Tutor</Button>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex size-9 items-center justify-center lg:hidden"
          style={{ color: "var(--text-primary)" }}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t pb-6 pt-4 lg:hidden"
          style={{ borderColor: "var(--bg-border-subtle)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-md)] px-2 py-2.5 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sign-in"
            className="rounded-[var(--radius-md)] px-2 py-2.5 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in
          </a>
          <Button size="md" className="mt-2 w-full">
            Find a Tutor
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
