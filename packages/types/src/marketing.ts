import { z } from "zod";

const proofCardBase = {
  id: z.string(),
};

export const ProofCardSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("stat"),
    value: z.string(),
    label: z.string(),
    ...proofCardBase,
  }),
  z.object({
    type: z.literal("trust_moment"),
    imageAlt: z.string(),
    headline: z.string(),
    body: z.string(),
    ...proofCardBase,
  }),
  z.object({
    type: z.literal("track"),
    trackName: z.string(),
    description: z.string(),
    ctaLabel: z.string(),
    href: z.string(),
    ...proofCardBase,
  }),
]);

export type ProofCard = z.infer<typeof ProofCardSchema>;

export const ProofCarouselResponseSchema = z.object({
  cards: z.array(ProofCardSchema),
});

export type ProofCarouselResponse = z.infer<typeof ProofCarouselResponseSchema>;

export const TestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  authorName: z.string(),
  authorContext: z.string(),
  rating: z.number().int().min(1).max(5),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

export const TestimonialsResponseSchema = z.object({
  aggregateRating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  testimonials: z.array(TestimonialSchema),
});

export type TestimonialsResponse = z.infer<typeof TestimonialsResponseSchema>;
