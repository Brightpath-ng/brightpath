import { z } from "zod";

const proofCardBase = {
  id: z.string(),
  footnote: z.number().int().positive().optional(),
  footnoteText: z.string().optional(),
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
