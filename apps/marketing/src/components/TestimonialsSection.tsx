import { Star } from "lucide-react";
import type { Testimonial } from "@brightpath/types";

const aggregateRating = 4.8;
const reviewCount = 240;

export const testimonials: Testimonial[] = [
  {
    id: "ngozi-a",
    quote:
      "My son moved from struggling with Further Maths to top of his class in one term. The dashboard let me see every lesson report, so I always knew exactly what was covered.",
    authorName: "Ngozi A.",
    authorContext: "Parent of an SS2 student, Lagos",
    rating: 5,
  },
  {
    id: "tunde-o",
    quote:
      "The check-in notifications gave me real peace of mind for in-person lessons. I knew exactly when the tutor arrived and left, every single time.",
    authorName: "Tunde O.",
    authorContext: "Parent of a JSS1 student, Abuja",
    rating: 5,
  },
  {
    id: "blessing-e",
    quote:
      "We started on the Self-directed track for WAEC revision. It was exactly the structure my daughter needed without committing to a full tutor package.",
    authorName: "Blessing E.",
    authorContext: "Parent of an SS3 student, Port Harcourt",
    rating: 4,
  },
];

function StarRating({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" style={{ color: "var(--accent)" }}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={size}
            strokeWidth={1.5}
            fill={index < Math.round(rating) ? "currentColor" : "none"}
          />
        ))}
      </div>
      <span className="sr-only">Rated {rating} out of 5</span>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <StarRating rating={aggregateRating} size="size-6" />
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {aggregateRating.toFixed(1)} out of 5
            <sup className="ml-0.5 text-sm font-semibold" aria-hidden="true">
              2
            </sup>
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Based on {reviewCount} parent reviews
            <span className="sr-only"> (see footnote 2)</span>
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col gap-4 p-6"
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--mkt-radius-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <StarRating rating={testimonial.rating} />
              <blockquote className="text-base" style={{ color: "var(--text-primary)" }}>
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {testimonial.authorName}
                </span>{" "}
                — {testimonial.authorContext}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
