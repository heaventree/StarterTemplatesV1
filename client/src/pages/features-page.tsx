import React from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#8c21a1] to-[#dd4f93] py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Heaventree Quickstart Templates
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
              Professional Website Templates with Powerful Features
            </p>
            <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-8 py-6 rounded-full bg-white text-[#8c21a1] hover:bg-gray-100 text-lg">
                View Our Templates
              </Button>
              <Button variant="outline" className="px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Overview Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Build Beautiful Websites
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Heaventree Quickstart Templates provides all the essential tools and features 
                to create stunning websites without any coding knowledge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-8 rounded-lg transition-all hover:shadow-lg"
                >
                  <div className="text-[#dd4f93] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Detailed Features Sections */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            {detailedFeatures.map((section, sectionIndex) => (
              <div 
                key={sectionIndex} 
                className={`flex flex-col ${sectionIndex % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} mb-20 items-center`}
              >
                <div className="lg:w-1/2 mb-10 lg:mb-0">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="rounded-lg shadow-xl max-w-full"
                  />
                </div>
                <div className="lg:w-1/2 lg:px-12">
                  <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                  <p className="text-lg text-gray-600 mb-8">{section.description}</p>
                  <ul className="space-y-4">
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle2 className="h-6 w-6 text-[#dd4f93] mr-3 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of happy users who build websites with Heaventree Quickstart Templates
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#8c21a1] to-[#dd4f93] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your Website?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Explore our collection of professional templates and start building your dream website today with Heaventree Quickstart Templates
            </p>
            <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-8 py-6 rounded-full bg-white text-[#8c21a1] hover:bg-gray-100 text-lg">
                Explore Templates <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" className="px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 text-lg">
                View Main Site
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

// Mock data for features
const features = [
  {
    icon: <img src="/images/features/icons/Advanced-Header.svg" alt="Header Options" className="h-12 w-12" />,
    title: "Advanced Header Options",
    description: "Create sticky, transparent, and fully customizable headers that perfectly match your brand identity."
  },
  {
    icon: <img src="/images/features/icons/footer-builder-icon.svg" alt="Footer Builder" className="h-12 w-12" />,
    title: "Custom Footer Builder",
    description: "Design custom footers with multiple layouts, widget areas, and branding options."
  },
  {
    icon: <img src="/images/features/icons/Colors-Typography.svg" alt="Colors & Typography" className="h-12 w-12" />,
    title: "Colors & Typography",
    description: "Take complete control of your website's appearance with extensive color and typography options."
  },
  {
    icon: <img src="/images/features/icons/Blog-Pro.svg" alt="Blog Layouts" className="h-12 w-12" />,
    title: "Blog Layouts",
    description: "Create beautiful blog pages with multiple layout options like grid, list, and masonry."
  },
  {
    icon: <img src="/images/features/icons/WooCommerce.svg" alt="WooCommerce" className="h-12 w-12" />,
    title: "WooCommerce Integration",
    description: "Build professional online stores with customizable product pages, shop layouts, and more."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: "Performance Optimized",
    description: "Build fast-loading websites with clean code and best practices for optimal performance."
  }
];

const detailedFeatures = [
  {
    title: "Beautiful Site Layouts",
    description: "Build stunning, responsive layouts for any type of website with our ready-to-use components.",
    image: "/images/features/Build-Beautiful-Site-Layouts.png",
    features: [
      "Professionally designed templates for any business or personal website",
      "Drag and drop layout builder for custom designs",
      "Responsive layouts that look great on all devices",
      "Pre-built sections that can be mixed and matched"
    ]
  },
  {
    title: "Advanced Header Options",
    description: "Create the perfect header for your website with our advanced customization tools.",
    image: "/images/features/sticky-header-pro-new.png",
    features: [
      "Sticky headers that stay visible as users scroll",
      "Transparent headers for beautiful hero sections",
      "Custom navigation menus with multiple style options",
      "Mobile-friendly responsive headers"
    ]
  },
  {
    title: "Custom Footer Builder",
    description: "Design custom footers that match your brand and provide all the information your visitors need.",
    image: "/images/features/Footer-Builder-Video.png",
    features: [
      "Multiple footer layouts with customizable columns",
      "Widget areas for dynamic content",
      "Copyright text customization",
      "Social media integration options"
    ]
  },
  {
    title: "Blog Layouts & Customization",
    description: "Create beautiful blog pages with multiple layout options and customization features.",
    image: "/images/features/blog-layouts.png",
    features: [
      "Multiple blog layout options (grid, list, masonry)",
      "Custom post templates for different content types",
      "Advanced typography and color controls",
      "Featured posts and content organization options"
    ]
  },
  {
    title: "WooCommerce Integration",
    description: "Build professional e-commerce stores with our deep WooCommerce integration.",
    image: "/images/features/white-lable-visual.png",
    features: [
      "Beautiful product page layouts and galleries",
      "Customizable shop pages and category displays",
      "Optimized checkout process for higher conversions",
      "Cart and mini-cart customization options"
    ]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    avatar: "https://via.placeholder.com/100x100?text=Avatar1",
    quote: "Heaventree Quickstart Templates saved me thousands of dollars on web design. I was able to create a professional website for my business in just a few hours."
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    avatar: "https://via.placeholder.com/100x100?text=Avatar2",
    quote: "As a designer, I appreciate the clean code and flexibility. It allows me to create custom websites for clients without starting from scratch."
  },
  {
    name: "Emma Williams",
    role: "E-commerce Entrepreneur",
    avatar: "https://via.placeholder.com/100x100?text=Avatar3",
    quote: "The WooCommerce templates are fantastic. I launched my online store in a weekend and sales have been growing steadily ever since."
  }
];