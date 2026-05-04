import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { EconomySection } from "@/components/sections/EconomySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <HeroSection />
        <HowItWorksSection />
        <EconomySection />
        <PartnersSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

