import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TemplatesSection from "@/components/TemplatesSection";
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
