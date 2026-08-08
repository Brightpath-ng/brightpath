"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, User } from "lucide-react";
import { cn } from "@brightpath/utils";

export type SelectOption = {
  id: string;
  label: string;
  meta?: string;
};

type SelectPosition = { top: number; left: number; width: number };

type SelectProps = {
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

// Trigger + floating searchable listbox, avatar-prefixed rows -- the
// "assign a person" pattern Linear/GitHub/Notion converge on, which a plain
// <select> can't render past its own closed trigger.
export function Select({
  id,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Search...",
  emptyMessage = "No matches",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [position, setPosition] = useState<SelectPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
  const selected = options.find((option) => option.id === value) ?? null;

  function computePosition(): SelectPosition | null {
    if (!triggerRef.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  }

  function openPanel() {
    const next = computePosition();
    if (!next) return;
    setPosition(next);
    setQuery("");
    setHighlighted(0);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
  }

  function selectOption(option: SelectOption) {
    onChange(option.id);
    closePanel();
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => setHighlighted(0), [query]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    }

    function handleKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function reposition() {
      const next = computePosition();
      if (next) setPosition(next);
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlighted];
      if (option) selectOption(option);
    }
  }

  const highlightedOption = filtered[highlighted];
  const activeDescendant = highlightedOption ? `${listboxId}-option-${highlightedOption.id}` : undefined;

  const panel =
    open && position
      ? createPortal(
          <div
            ref={panelRef}
            className="fixed z-[100] flex flex-col overflow-hidden rounded-[var(--radius-lg)]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border-subtle)",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
            >
              <Search aria-hidden="true" className="size-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <input
                ref={searchRef}
                type="text"
                aria-label={`Search ${placeholder.toLowerCase()}`}
                aria-controls={listboxId}
                aria-activedescendant={activeDescendant}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-full border-none bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
            <ul id={listboxId} role="listbox" aria-label={placeholder} className="max-h-56 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <li className="px-2.5 py-4 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {emptyMessage}
                </li>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.id === value;
                  const isHighlighted = index === highlighted;
                  return (
                    <li
                      key={option.id}
                      id={`${listboxId}-option-${option.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-2",
                        isHighlighted && "bg-[var(--bg-elevated)]"
                      )}
                    >
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                      >
                        <User aria-hidden="true" className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {option.label}
                        </span>
                        {option.meta ? (
                          <span className="block truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                            {option.meta}
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
                      ) : null}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closePanel() : openPanel())}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-[var(--radius-md)] border border-[var(--bg-border)]",
          "bg-[var(--bg-surface)] px-3 text-sm outline-none transition-all duration-150",
          "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]",
          open && "border-[var(--accent)] ring-2 ring-[var(--accent-dim)]"
        )}
        style={{ color: selected ? "var(--text-primary)" : "var(--text-tertiary)" }}
      >
        <span className="min-w-0 flex-1 truncate text-left">{selected ? selected.label : placeholder}</span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
      </button>
      {panel}
    </>
  );
}
