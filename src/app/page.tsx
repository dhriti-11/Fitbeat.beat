import { LandingIntroGate } from "@/components/intro/LandingIntroGate";
import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { Marquee } from "@/components/marketing/Marquee";
import { ShowcaseSection } from "@/components/marketing/ShowcaseSection";
import { AboutSection } from "@/components/marketing/AboutSection";
import { ProgramsSection } from "@/components/marketing/ProgramsSection";
import { TrainersSection } from "@/components/marketing/TrainersSection";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { BranchesSection } from "@/components/marketing/BranchesSection";
import { BookSection } from "@/components/marketing/BookSection";
import { ContactSection } from "@/components/marketing/ContactSection";
import { Footer } from "@/components/marketing/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CtaBanner } from "@/components/marketing/CtaBanner";

export default function HomePage() {
  return (
    <LandingIntroGate>
      <main className="relative z-10">
        <ScrollProgress />
        <Navbar />
        <HeroSection />
        <Marquee />
        <ShowcaseSection />
        <AboutSection />
        <ProgramsSection />
        <ServicesSection />
        <TrainersSection />
        <TestimonialsSection />
        <BranchesSection />
        <CtaBanner />
        <BookSection />
        <ContactSection />
        <Footer />
      </main>
    </LandingIntroGate>
  );
}
