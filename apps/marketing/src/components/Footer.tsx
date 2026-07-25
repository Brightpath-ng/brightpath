import { Instagram, Facebook, Linkedin, X, type LucideIcon } from "lucide-react";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "Contact",
    links: [
      { label: "Get in touch", href: "/contact" },
      { label: "WhatsApp us", href: "/contact#whatsapp" },
      { label: "Find a tutor near you", href: "/find-a-tutor" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About BrightPath", href: "/about" },
      { label: "Trust & Safety", href: "/trust-safety" },
      { label: "Success stories", href: "/success-stories" },
    ],
  },
  {
    title: "Terms & policies",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  },
  {
    title: "Tips & advice",
    links: [
      { label: "Exam prep tips", href: "/guides/exam-prep-tips" },
      { label: "Parenting resources", href: "/guides/parenting-resources" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "FAQs", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "For business",
    links: [
      { label: "School partnerships", href: "/schools" },
      { label: "Corporate benefits", href: "/corporate" },
      { label: "Contact sales", href: "/contact-sales" },
    ],
  },
];

interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "X", href: "#", icon: X },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col items-center gap-6 border-t pt-8 sm:flex-row sm:justify-between"
          style={{ borderColor: "var(--bg-border-subtle)" }}
        >
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              BrightPath
            </span>
            <div className="flex items-center gap-3">
              <span
                className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-tertiary)",
                  border: "1px solid var(--bg-border-subtle)",
                }}
              >
                App Store — Coming soon
              </span>
              <span
                className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-tertiary)",
                  border: "1px solid var(--bg-border-subtle)",
                }}
              >
                Google Play — Coming soon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full"
                style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
              >
                <Icon aria-hidden="true" className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs sm:text-left" style={{ color: "var(--text-tertiary)" }}>
          © {year} BrightPath. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
