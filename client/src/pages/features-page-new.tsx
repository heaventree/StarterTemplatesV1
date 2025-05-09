import React from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Check } from "lucide-react";

interface FeatureHighlight {
  title: string;
  description: string;
}

interface Feature {
  id: number;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  image: string;
  highlights: FeatureHighlight[];
}

interface FeatureOverview {
  title: string;
  icon: string;
  description: string;
  features: string[];
}

export default function FeaturesPage() {
  // Feature highlights data
  const featuresOverview: FeatureOverview[] = [
    {
      title: "Easy Customization",
      icon: "/images/features/icons/Colors-Typography.svg",
      description: "Customize every aspect of your website with intuitive controls and options",
      features: [
        "Global color controls",
        "Typography options",
        "Spacing controls",
        "Layout customization"
      ]
    },
    {
      title: "Performance Optimized",
      icon: "/images/features/icons/Advanced-Header.svg",
      description: "Build websites that load quickly and provide a smooth experience for visitors",
      features: [
        "Lightweight code",
        "Optimized assets",
        "Caching integration",
        "Mobile optimization"
      ]
    },
    {
      title: "SEO Friendly",
      icon: "/images/features/icons/Blog-Pro.svg",
      description: "Rank higher in search results with built-in SEO optimizations",
      features: [
        "Schema markup",
        "Fast loading times",
        "Mobile-friendly designs",
        "Clean code structure"
      ]
    }
  ];

  // Main features data
  const features: Feature[] = [
    {
      id: 1,
      title: "Header Builder",
      slug: "header-builder",
      icon: "/images/features/icons/Advanced-Header.svg",
      shortDescription: "Customize your site header with flexible options",
      image: "/images/features/sticky-header-pro-new.png",
      highlights: [
        { title: "Sticky Headers", description: "Headers that stay visible while scrolling" },
        { title: "Transparent Headers", description: "For beautiful hero sections with overlays" },
        { title: "Multiple Layouts", description: "Choose from various header designs" }
      ]
    },
    {
      id: 2,
      title: "Footer Builder",
      slug: "footer-builder",
      icon: "/images/features/icons/footer-builder-icon.svg",
      shortDescription: "Design professional footers that match your brand",
      image: "/images/features/footer-builder.png",
      highlights: [
        { title: "Multiple Columns", description: "Flexible column layouts" },
        { title: "Widget Areas", description: "Add widgets to any footer section" },
        { title: "Copyright Bar", description: "Customizable copyright section" }
      ]
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Web Designer",
      company: "Creative Studios",
      quote: "The templates and features have completely transformed my workflow. I can now build beautiful websites in half the time it used to take me.",
      avatar: "/images/avatars/testimonial-1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Agency Owner",
      company: "Digital Spark",
      quote: "My team relies on these templates for all our client projects. The customization options and performance are unmatched.",
      avatar: "/images/avatars/testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Freelancer",
      company: "Self-employed",
      quote: "As a solo designer, these templates have been a game-changer for my business. I can deliver professional results to my clients quickly.",
      avatar: "/images/avatars/testimonial-3.jpg"
    }
  ];

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
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Site Builder Section */}
        <section className="py-20 bg-[#f9f9ff]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Build Beautiful Site Layouts
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Create professional websites with pre-designed layouts
                and customize them to match your brand.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <img 
                  src="/images/features/Build-Beautiful-Site-Layouts.png" 
                  alt="Site Layouts" 
                  className="rounded-xl shadow-xl max-w-full h-auto"
                />
              </div>
              <div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Layout Customization</h3>
                  
                  <div className="space-y-6">
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#f0f7ff] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4a8cff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Full Width Layout</h4>
                        <p className="text-gray-600 text-sm">Stretch content across the entire width of the browser window</p>
                      </div>
                    </div>
                    
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#fff2f0] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Container Layout</h4>
                        <p className="text-gray-600 text-sm">Content contained within a centered container with max width</p>
                      </div>
                    </div>
                    
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#f4ffef] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#66c657]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Custom Width</h4>
                        <p className="text-gray-600 text-sm">Set custom widths for different sections of your website</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                Join thousands of web designers and developers who are already building
                amazing websites with our templates and features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-[#6f42c1]">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-r from-[#5e2eff] to-[#a66fff] text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <img 
              src="https://startertemplates.com/wp-content/uploads/2025/03/st-hero-overlay-scaled.webp" 
              alt="Background pattern" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Create Amazing Websites?
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-90">
                Get started today and transform your web design workflow with our
                powerful templates and features.
              </p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">280+</div>
                    <div className="text-sm">Ready-to-use Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">50,000+</div>
                    <div className="text-sm">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">4.9/5</div>
                    <div className="text-sm">Customer Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="px-8 py-6 rounded-full bg-[#ff6f61] text-white hover:bg-[#ff5e50] border-0 text-lg font-semibold">
                  Get Started Today
                </Button>
                <Button variant="outline" className="px-8 py-6 rounded-full bg-transparent text-white border-white border-2 hover:bg-white/10 text-lg font-semibold">
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}