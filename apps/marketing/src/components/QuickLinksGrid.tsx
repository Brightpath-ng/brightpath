import { ClipboardCheck, FileSearch, GraduationCap, TrendingUp, type LucideIcon } from "lucide-react";

interface QuickLink {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  icon: LucideIcon;
}

const quickLinks: QuickLink[] = [
  {
    title: "Book an Assessment",
    description: "Start with a quick diagnostic to find the right track for your child.",
    linkLabel: "Get started",
    href: "/assessment",
    icon: ClipboardCheck,
  },
  {
    title: "Track My Child's Progress",
    description: "See attendance, homework, and score trends in one dashboard.",
    linkLabel: "View dashboard",
    href: "/sign-in",
    icon: TrendingUp,
  },
  {
    title: "Become a Tutor",
    description: "Apply, get trained, and start teaching within a managed structure.",
    linkLabel: "Apply now",
    href: "/become-a-tutor",
    icon: GraduationCap,
  },
  {
    title: "Find My Tutor's Report",
    description: "Read the latest lesson report filed after your child's session.",
    linkLabel: "See report",
    href: "/sign-in",
    icon: FileSearch,
  },
];

export function QuickLinksGrid() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ title, description, linkLabel, href, icon: Icon }) => (
          <a
            key={title}
            href={href}
            className="group flex flex-col gap-4 p-6 transition-shadow hover:shadow-[var(--shadow-elevated)]"
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--mkt-radius-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span
              className="flex size-11 items-center justify-center rounded-[var(--radius-lg)]"
              style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              <Icon className="size-6" />
            </span>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            </div>

            <span
              className="mt-auto inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              {linkLabel}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
