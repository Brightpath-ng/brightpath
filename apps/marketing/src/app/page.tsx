import { Hero } from "@/components/Hero";
import { QuickLinksGrid } from "@/components/QuickLinksGrid";
import { ProofCarousel } from "@/components/ProofCarousel";

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickLinksGrid />
      <ProofCarousel />
    </main>
  );
}
