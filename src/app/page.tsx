import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
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

export default function HomePage() {
  return (
    <main className="relative z-10">
      <Navbar />
      <HeroSection />
      <ShowcaseSection />
      <AboutSection />
      <ProgramsSection />
      <TrainersSection />
      <ServicesSection />
      <TestimonialsSection />
      <BranchesSection />
      <BookSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
