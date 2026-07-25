import { Hero } from "@/components/Hero";
import { QuickLinksGrid } from "@/components/QuickLinksGrid";
import { ProofCarousel } from "@/components/ProofCarousel";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TracksGrid } from "@/components/TracksGrid";

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickLinksGrid />
      <ProofCarousel />
      <TestimonialsSection />
      <TracksGrid />
    </main>
  );
}
