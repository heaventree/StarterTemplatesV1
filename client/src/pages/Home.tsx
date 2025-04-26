import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TemplatesSection from "@/components/TemplatesSection";
import { RecommendedTemplates } from "@/components/RecommendedTemplates";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CallToAction from "@/components/CallToAction";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <div className="bg-[#f9fafb] container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8">
          <RecommendedTemplates />
        </div>
        <TemplatesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToAction />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
