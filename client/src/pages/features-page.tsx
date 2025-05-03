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
              Do More in Less Time. Without Coding!
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="px-8 py-6 rounded-full bg-white text-[#8c21a1] hover:bg-gray-100 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="px-8 py-6 rounded-full border-white text-white hover:bg-white/10 text-lg">
                View Templates
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
              Ready to Get Started?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Join thousands of users who are building beautiful websites with Heaventree Quickstart Templates
            </p>
            <Button className="px-8 py-6 rounded-full bg-white text-[#8c21a1] hover:bg-gray-100 text-lg">
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
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
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    title: "Responsive Templates",
    description: "All templates are fully responsive and look great on any device from mobile to desktop."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    title: "Easy Customization",
    description: "Customize colors, fonts, layouts and more without writing a single line of code."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: "Fast Performance",
    description: "Optimized for speed with clean code and best practices for fast loading times."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    title: "Multiple Page Builders",
    description: "Compatible with popular page builders like Elementor, Gutenberg, Beaver Builder, and more."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    title: "Mobile-First Approach",
    description: "Designed with mobile users in mind, ensuring perfect display on smartphones and tablets."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    title: "Regular Updates",
    description: "Constant updates with new features and templates to keep your website on the cutting edge."
  }
];

const detailedFeatures = [
  {
    title: "Stunning Ready-Made Templates",
    description: "Choose from hundreds of professionally designed templates to kickstart your website.",
    image: "https://via.placeholder.com/800x500?text=Templates+Feature",
    features: [
      "Professionally designed templates for any business or personal website",
      "Regularly updated with fresh designs",
      "Categorized by industry and purpose for easy selection",
      "One-click import to get started instantly"
    ]
  },
  {
    title: "Powerful Customization Options",
    description: "Take complete control of your website's appearance without writing code.",
    image: "https://via.placeholder.com/800x500?text=Customization+Feature",
    features: [
      "Intuitive visual editor for real-time customization",
      "Extensive color and typography options",
      "Custom layouts and spacing controls",
      "Header and footer builder with multiple styles"
    ]
  },
  {
    title: "Performance Optimized",
    description: "Build websites that load fast and perform well on all devices.",
    image: "https://via.placeholder.com/800x500?text=Performance+Feature",
    features: [
      "Lightweight and clean code for fast loading",
      "Mobile-optimized for speed on all devices",
      "SEO friendly structure for better rankings",
      "Optimized image handling and lazy loading"
    ]
  },
  {
    title: "WooCommerce Ready",
    description: "Create stunning e-commerce stores with our WooCommerce integration.",
    image: "https://via.placeholder.com/800x500?text=WooCommerce+Feature",
    features: [
      "Beautiful product page layouts",
      "Customizable shop pages and categories",
      "Optimized checkout process",
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
    avatar: "/images/testimonials/avatar2.jpg",
    quote: "As a designer, I appreciate the clean code and flexibility. It allows me to create custom websites for clients without starting from scratch."
  },
  {
    name: "Emma Williams",
    role: "E-commerce Entrepreneur",
    avatar: "/images/testimonials/avatar3.jpg",
    quote: "The WooCommerce templates are fantastic. I launched my online store in a weekend and sales have been growing steadily ever since."
  }
];