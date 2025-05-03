import React from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Check } from "lucide-react";

interface FeatureHighlight {
  title: string;
  description: string;
  icon?: string;
  iconBgColor?: string;
  iconColor?: string;
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

export default function FeaturesPage() {
  // Feature highlights data (will be fetched from API in future)
  const featuresOverview = [
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

  // Main features data (will be fetched from API in future)
  const features = [
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 lg:order-1">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Header Customization</h3>
                  
                  <div className="space-y-6">
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#f0f7ff] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4a8cff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Sticky Headers</h4>
                        <p className="text-gray-600 text-sm">Keep your navigation visible as visitors scroll down the page</p>
                      </div>
                    </div>
                    
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#fff2f0] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Transparent Headers</h4>
                        <p className="text-gray-600 text-sm">Create stunning hero sections with transparent navigation overlays</p>
                      </div>
                    </div>
                    
                    <div className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-24 shrink-0">
                        <div className="w-16 h-16 bg-[#f4ffef] rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#66c657]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Header Layout Options</h4>
                        <p className="text-gray-600 text-sm">Choose from multiple header layouts to match your website style</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <img 
                  src="/images/features/sticky-header-pro-new.png" 
                  alt="Header Options" 
                  className="rounded-xl shadow-xl max-w-full h-auto"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/features/colors-typography.jpg" 
                  alt="Colors and Typography" 
                  className="rounded-xl shadow-xl max-w-full h-auto"
                />
              </div>
              <div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Colors & Typography</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Global Color Control</h4>
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 shadow-md"></div>
                        <div className="w-12 h-12 rounded-full bg-pink-600 shadow-md"></div>
                        <div className="w-12 h-12 rounded-full bg-yellow-500 shadow-md"></div>
                        <div className="w-12 h-12 rounded-full bg-green-500 shadow-md"></div>
                        <div className="w-12 h-12 rounded-full bg-purple-600 shadow-md"></div>
                      </div>
                      <p className="text-gray-600 text-sm">Set your brand colors once and apply them consistently throughout your entire website</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <h4 className="font-semibold text-lg">Typography Options</h4>
                      <div className="space-y-3">
                        <p className="text-3xl font-bold text-gray-900">Heading 1</p>
                        <p className="text-2xl font-bold text-gray-900">Heading 2</p>
                        <p className="text-xl font-bold text-gray-900">Heading 3</p>
                        <p className="text-base text-gray-700">Body Text - Choose from hundreds of web fonts and customize sizes, weights, and styles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog & WooCommerce Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Powerful Blog & WooCommerce Features
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Create engaging content and build professional online stores with our
                specialized features for blogs and e-commerce
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-[#f9f9ff] p-8 rounded-xl">
                <div className="mb-6">
                  <img src="/images/features/icons/Blog-Pro.svg" alt="Blog Layouts" className="h-14 w-14" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Blog Layouts & Features</h3>
                <p className="text-gray-700 mb-6">Create beautiful blog pages with multiple layout options and customization features.</p>
                
                <div className="mb-8">
                  <img 
                    src="/images/features/blog-layouts.png" 
                    alt="Blog Layouts" 
                    className="rounded-xl shadow-lg max-w-full h-auto"
                  />
                </div>
                
                <ul className="space-y-3">
                  {[
                    "Multiple blog layout options (grid, list, masonry)",
                    "Custom post templates for different content types",
                    "Advanced typography and color controls",
                    "Featured posts and content organization options"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#6f42c1] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#f9f9ff] p-8 rounded-xl">
                <div className="mb-6">
                  <img src="/images/features/icons/WooCommerce.svg" alt="WooCommerce" className="h-14 w-14" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">WooCommerce Integration</h3>
                <p className="text-gray-700 mb-6">Build professional e-commerce stores with our deep WooCommerce integration.</p>
                
                <div className="mb-8">
                  <img 
                    src="/images/features/white-lable-visual.png" 
                    alt="WooCommerce Integration" 
                    className="rounded-xl shadow-lg max-w-full h-auto"
                  />
                </div>
                
                <ul className="space-y-3">
                  {[
                    "Beautiful product page layouts and galleries",
                    "Customizable shop pages and category displays",
                    "Optimized checkout process for higher conversions",
                    "Cart and mini-cart customization options"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#6f42c1] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* All-in-One Site Builder Section */}
        <section className="py-20 bg-[#f9f9ff]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              All-in-One Site Builder
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-16">
              A complete toolkit to craft a unique, visually engaging site, all from one place.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {siteBuilderFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#f3f1ff] rounded-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Join thousands of happy users who build websites with Heaventree Quickstart Templates
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-[#f9f9ff] p-8 rounded-xl shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center mb-6">
                    <div className="mr-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-purple-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role}</p>
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
              Ready to Create Your Website?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Explore our collection of professional templates and start building your dream website today
            </p>
            <div className="flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0">
              <Link href="/">
                <Button className="px-8 py-6 rounded-full bg-[#ff6f61] text-white hover:bg-[#ff5e50] border-0 text-lg font-semibold">
                  Explore Templates <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <a href="https://heaventree.ie" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 text-lg font-semibold">
                  Visit Main Site
                </Button>
              </a>
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
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-[#6f42c1]">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
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

// Features overview data
const featuresOverview = [
  {
    icon: "/images/features/icons/Advanced-Header.svg",
    title: "Headers & Navigation",
    description: "Create unique, fully customizable headers for your website with advanced options and effects.",
    features: [
      "Sticky headers that stay visible while scrolling",
      "Transparent headers for beautiful hero sections",
      "Multiple header layouts to choose from",
      "Mobile-friendly navigation menus"
    ]
  },
  {
    icon: "/images/features/icons/footer-builder-icon.svg",
    title: "Footer Builder",
    description: "Design custom footers that match your brand identity with our flexible footer builder.",
    features: [
      "Multiple column layouts for footers",
      "Widget areas for dynamic content",
      "Copyright text customization",
      "Social media integration"
    ]
  },
  {
    icon: "/images/features/icons/Colors-Typography.svg",
    title: "Colors & Typography",
    description: "Take complete control of your website's appearance with extensive color and typography options.",
    features: [
      "Global color controls for consistent branding",
      "Hundreds of web fonts to choose from",
      "Typography customization for all elements",
      "Easy-to-use visual controls"
    ]
  },
  {
    icon: "/images/features/icons/Blog-Pro.svg",
    title: "Blog Layouts",
    description: "Create beautiful blog pages with multiple layout options and powerful customization features.",
    features: [
      "Grid, list, and masonry layout options",
      "Custom post templates for different content",
      "Featured posts and organization options",
      "Related posts and navigation controls"
    ]
  },
  {
    icon: "/images/features/icons/WooCommerce.svg",
    title: "WooCommerce Integration",
    description: "Build professional online stores with customizable product pages, shop layouts, and more.",
    features: [
      "Beautiful product page layouts",
      "Customizable shop pages and categories",
      "Optimized checkout process",
      "Cart and mini-cart customization"
    ]
  },
  {
    icon: "/images/features/icons/Colors-Typography.svg",
    title: "Responsive Design",
    description: "Create websites that look beautiful on all devices with comprehensive responsive controls.",
    features: [
      "Mobile-first responsive design",
      "Device-specific customization options",
      "Preview your site on different screen sizes",
      "Touch-friendly interactive elements"
    ]
  }
];

// Site builder features data
const siteBuilderFeatures = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>,
    title: "Layout Control",
    description: "Full control over page layouts with intuitive controls for spacing, alignment, and organization."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>,
    title: "Global Colors",
    description: "Set your brand colors once and apply them consistently across your entire website with ease."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
    title: "Typography Settings",
    description: "Choose from hundreds of web fonts and customize sizes, weights, and styles for a perfect typographic design."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>,
    title: "Mobile Optimization",
    description: "Ensure your website looks perfect on all devices with built-in responsive design controls."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>,
    title: "Live Customizer",
    description: "See changes in real-time as you customize your website with the intuitive visual editor."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6f42c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>,
    title: "Custom Widgets",
    description: "Add functionality to your website with a wide range of widgets and content elements."
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    avatar: "/images/testimonials/testimonial-1.jpg",
    quote: "Heaventree Quickstart Templates saved me thousands of dollars on web design. I was able to create a professional website for my business in just a few hours."
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    avatar: "/images/testimonials/testimonial-2.jpg",
    quote: "As a designer, I appreciate the clean code and flexibility. It allows me to create custom websites for clients without starting from scratch."
  },
  {
    name: "Emma Williams",
    role: "E-commerce Entrepreneur",
    avatar: "/images/testimonials/testimonial-3.jpg",
    quote: "The WooCommerce templates are fantastic. I launched my online store in a weekend and sales have been growing steadily ever since."
  }
];