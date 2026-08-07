"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

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

// apps/web is a separate deployed app (separate origin) -- a relative /sign-in
// href would 404 here, so this always links out to web's own absolute URL.
const signInHref = `${process.env.NEXT_PUBLIC_WEB_APP_URL ?? "http://localhost:3001"}/sign-in`;

// No dedicated tutor-search page exists yet -- "Find a Tutor" is the parent-facing
// CTA, so it goes to the same parent sign-in/sign-up flow as "Sign in" does.
const findTutorLinkClassName =
  "inline-flex h-9 items-center justify-center gap-2 rounded-[var(--radius-button)] " +
  "px-4 text-sm font-medium text-white transition-all duration-150 " +
  "bg-[var(--accent)] hover:bg-[var(--accent-hover)]";

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
          <a href={signInHref} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Sign in
          </a>
          <a href={signInHref} className={findTutorLinkClassName}>
            Find a Tutor
          </a>
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
            href={signInHref}
            className="rounded-[var(--radius-md)] px-2 py-2.5 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in
          </a>
          <a href={signInHref} className={`${findTutorLinkClassName} mt-2 w-full`}>
            Find a Tutor
          </a>
        </nav>
      ) : null}
    </header>
  );
}
