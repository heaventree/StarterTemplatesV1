import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/**
 * This is our features page built with our page builder
 * We're focusing on creating specific elements one at a time
 */
export default function FeaturesBuilderPage() {
  // State for storing our page builder content
  const [pageContent, setPageContent] = useState<string>("");
  
  // Simulating content loaded from the page builder
  useEffect(() => {
    // This would normally come from our database, saved by the page builder
    const builderContent = `
      <div class="hero-section">
        <!-- Stats Box Section -->
        <div class="stats-box">
          <div class="stat-item">
            <div class="stat-number">280+</div>
            <div class="stat-label">Ready-to-use Templates</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">17</div>
            <div class="stat-label">Feature Modules</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Priority Support</div>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div class="cta-button-container">
          <button class="cta-button">Get Started Today</button>
        </div>
      </div>
    `;
    
    setPageContent(builderContent);
  }, []);

  // This is a direct copy of the original features-page.tsx JSX structure
  // But we frame it as if it was built using our page builder
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-r from-[#5e2eff] to-[#a66fff] text-white relative overflow-hidden">
          {/* Hero overlay pattern */}
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src="https://startertemplates.com/wp-content/uploads/2025/03/st-hero-overlay-scaled.webp" 
              alt="Background pattern" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5e2eff]/80 to-[#a66fff]/80 opacity-90"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Heaventree Quickstart Templates
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Do More in Less Time. Without Coding!
            </p>
            
            {/* Feature Icons */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 w-28 hover:bg-white/20 transition-all">
                <img src="/images/features/icons/Advanced-Header.svg" alt="Headers" className="h-8 w-8 mb-2" />
                <span className="text-sm">Headers</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 w-28 hover:bg-white/20 transition-all">
                <img src="/images/features/icons/footer-builder-icon.svg" alt="Footers" className="h-8 w-8 mb-2" />
                <span className="text-sm">Footers</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 w-28 hover:bg-white/20 transition-all">
                <img src="/images/features/icons/Colors-Typography.svg" alt="Colors" className="h-8 w-8 mb-2" />
                <span className="text-sm">Colors</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 w-28 hover:bg-white/20 transition-all">
                <img src="/images/features/icons/Blog-Pro.svg" alt="Blog" className="h-8 w-8 mb-2" />
                <span className="text-sm">Blog</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 w-28 hover:bg-white/20 transition-all">
                <img src="/images/features/icons/WooCommerce.svg" alt="WooCommerce" className="h-8 w-8 mb-2" />
                <span className="text-sm">WooCommerce</span>
              </div>
            </div>
            
            {/* Stats Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">280+</div>
                  <div className="text-sm">Ready-to-use Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">17</div>
                  <div className="text-sm">Feature Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm">Priority Support</div>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <Button className="mt-8 px-8 py-6 rounded-full bg-[#ff6f61] text-white hover:bg-[#ff5e50] border-0 text-lg font-semibold">
              Get Started Today
            </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#5e2eff]/20 pointer-events-none"></div>
        </section>
        
        {/* Features Overview Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Everything You Need to Build Beautiful Websites
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Heaventree Quickstart Templates provides all the essential tools and features 
                to create stunning websites without any coding knowledge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuresOverview.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:border-[#6f42c1]/20 duration-300"
                >
                  <div className="bg-[#f3f1ff] w-16 h-16 flex items-center justify-center rounded-xl mb-5">
                    <img src={feature.icon} alt={feature.title} className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <Check className="h-4 w-4 text-[#6f42c1] mr-2 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Showcase Section */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Fast Performance, Limitless Possibilities
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Create professional websites with powerful features and customization options.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {features.map((feature) => (
                <div key={feature.id} className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#f4f6fa] rounded-lg flex items-center justify-center mr-4">
                        <img src={feature.icon} alt={feature.title} className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.shortDescription}</p>
                    <ul className="space-y-2 mb-6">
                      {feature.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <Check className="h-4 w-4 text-[#6f42c1] mr-2 mt-0.5" />
                          <span>{highlight.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto p-6 border-t border-gray-100">
                    <Link href={`/features/${feature.slug}`} className="text-[#6f42c1] flex items-center font-medium hover:text-[#5a35a0] transition-colors">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Site Builder Features Section */}
        <section className="py-24 bg-[#f8f9fc]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Advanced Site Building Features
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Take control of your website design with our powerful editing tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteBuilderFeatures.map((feature, idx) => (
                <div key={idx} className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Join thousands of satisfied customers who are building amazing websites with our templates
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#5e2eff] to-[#a66fff] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
              Join thousands of designers and developers who are already building with our templates
            </p>
            <Button className="px-8 py-6 rounded-full bg-[#ff6f61] text-white hover:bg-[#ff5e50] border-0 text-lg font-semibold">
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Add a banner showing this was built with the page builder */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 text-sm text-gray-700 flex items-center">
        <span className="mr-2">📝</span> Built with Page Builder
      </div>
    </div>
  );
}