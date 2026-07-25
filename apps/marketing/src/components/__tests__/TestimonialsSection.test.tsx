import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialSchema } from "@brightpath/types";
import { TestimonialsSection, testimonials } from "../TestimonialsSection";

describe("TestimonialsSection", () => {
  it("renders the trust-stats rating block", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/^4\.8 out of 5/)).toBeInTheDocument();
    expect(screen.getByText(/based on 240 parent reviews/i)).toBeInTheDocument();
  });

  it("marks the aggregate rating claim with a footnote reference", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/see footnote 2/i)).toBeInTheDocument();
  });

  it("renders all three testimonial quotes with author attribution", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/moved from struggling with further maths/i)).toBeInTheDocument();
    expect(screen.getByText("Ngozi A.")).toBeInTheDocument();
    expect(screen.getByText(/Parent of an SS2 student, Lagos/)).toBeInTheDocument();

    expect(screen.getByText(/check-in notifications gave me real peace of mind/i)).toBeInTheDocument();
    expect(screen.getByText(/self-directed track for waec revision/i)).toBeInTheDocument();
  });

  it("gives each star rating an accessible label", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Rated 4.8 out of 5")).toBeInTheDocument();
    expect(screen.getAllByText(/Rated \d(\.\d)? out of 5/)).toHaveLength(4);
  });

  it("has seed testimonials that conform to the shared schema", () => {
    for (const testimonial of testimonials) {
      expect(() => TestimonialSchema.parse(testimonial)).not.toThrow();
    }
  });
});
