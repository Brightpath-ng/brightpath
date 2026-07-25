import {
  ShieldCheck,
  BadgeCheck,
  MapPin,
  TrendingUp,
  Laptop,
  Route,
  MessageCircle,
  Receipt,
  type LucideIcon,
} from "lucide-react";

interface Reason {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const reasons: Reason[] = [
  {
    id: "managed",
    icon: ShieldCheck,
    title: "Managed, not a marketplace",
    description: "We vet and assign every tutor — you never negotiate price or hunt for a match yourself.",
  },
  {
    id: "verified-tutors",
    icon: BadgeCheck,
    title: "Verified tutors",
    description: "Every tutor passes ID, reference, and interview checks before they ever teach your child.",
  },
  {
    id: "verified-checkins",
    icon: MapPin,
    title: "Verified check-ins",
    description: "Every lesson is checked in and out automatically, so you know it happened — on time, in the right place.",
  },
  {
    id: "measurable-progress",
    icon: TrendingUp,
    title: "Measurable progress",
    description: "See baseline vs. latest scores on one dashboard — not a vague promise.",
  },
  {
    id: "hybrid-delivery",
    icon: Laptop,
    title: "Hybrid delivery",
    description: "Choose online, in-person, or let us match whichever works best for your family.",
  },
  {
    id: "three-tracks",
    icon: Route,
    title: "Three tracks, one relationship",
    description: "From full tutoring to guided study to self-directed practice, without starting over.",
  },
  {
    id: "in-app-messaging",
    icon: MessageCircle,
    title: "In-app messaging",
    description: "All communication with your tutor stays inside BrightPath, giving you a safe, auditable record.",
  },
  {
    id: "transparent-billing",
    icon: Receipt,
    title: "Transparent billing",
    description: "Every charge, refund, and payout is tracked — no surprises, nothing lost in an inbox.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            Why parents choose BrightPath
          </h2>
          <p className="max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
            Every part of BrightPath is built around one question: how do we earn — and keep —
            your trust?
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ id, icon: Icon, title, description }) => (
            <div key={id} className="flex flex-col items-center gap-3 text-center">
              <span
                className="flex size-12 items-center justify-center rounded-[var(--radius-lg)]"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
