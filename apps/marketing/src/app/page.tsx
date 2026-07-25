import { Hero } from "@/components/Hero";
import { QuickLinksGrid } from "@/components/QuickLinksGrid";
import { ProofCarousel } from "@/components/ProofCarousel";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TracksGrid } from "@/components/TracksGrid";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { FaqAccordion } from "@/components/FaqAccordion";
import { TutorCTA } from "@/components/TutorCTA";
import { FinalCTA } from "@/components/FinalCTA";
import { Footnotes } from "@/components/Footnotes";

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickLinksGrid />
      <ProofCarousel />
      <TestimonialsSection />
      <TracksGrid />
      <WhyChooseUs />
      <GuidesTeaser />
      <FaqAccordion />
      <TutorCTA />
      <FinalCTA />
      <Footnotes />
    </main>
  );
}
