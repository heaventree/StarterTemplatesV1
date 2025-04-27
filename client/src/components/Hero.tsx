import { useState, useRef } from "react";
import { stats } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import type { Template } from "@shared/schema";
import { getAIRecommendedTemplates, getTemplatesByCategory } from "@/services/templateRecommender";

export default function Hero() {
  // AI recommendation states
  const [userPrompt, setUserPrompt] = useState("");
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendedTemplates, setRecommendedTemplates] = useState<Template[]>([]);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Get actual template count from API
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });
  
  // Create dynamic stats with actual template count
  const dynamicStats = [
    { value: `${templates.length}+`, label: "Templates" },
    { value: "7+", label: "Categories" },
    { value: "100K+", label: "Happy Users" }
  ];
  
  // Handle AI template recommendation based on user prompt
  const handleFindTemplates = () => {
    if (!userPrompt?.trim()) return;
    
    setIsRecommending(true);
    
    // Get recommendations using our AI matching function
    const recommendations = getAIRecommendedTemplates(templates, userPrompt, 12);
    setRecommendedTemplates(recommendations);
    setIsRecommending(false);
    
    // Scroll to templates section
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
    
    // Publish event for TemplatesSection to pick up
    window.dispatchEvent(new CustomEvent('ai-recommendation', { 
      detail: { recommendations, prompt: userPrompt }
    }));
  };
  
  // Handle popular category selection
  const handleCategorySelect = (category: string) => {
    // Get templates for this category
    const categoryTemplates = getTemplatesByCategory(templates, category, 12);
    
    // Set recommendation prompt
    setUserPrompt(`I'm looking for a ${category} website`);
    if (promptInputRef.current) {
      promptInputRef.current.value = `I'm looking for a ${category} website`;
    }
    
    // Publish event for TemplatesSection to pick up
    window.dispatchEvent(new CustomEvent('ai-recommendation', { 
      detail: { recommendations: categoryTemplates, prompt: `I'm looking for a ${category} website` }
    }));
    
    // Scroll to templates section
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="pt-28 pb-16 lg:pt-40 lg:pb-24 relative bg-gradient-to-br from-[#dd4f93] via-[#8c21a1] to-[#1e056f] overflow-hidden">
      {/* Hero overlay pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://startertemplates.com/wp-content/uploads/2025/03/st-hero-overlay-scaled.webp" 
          alt="Background pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#dd4f93]/80 via-[#8c21a1]/80 to-[#1e056f]/80 opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-lexend font-bold text-white mb-6 leading-tight">
            Beautiful Website <span className="text-[#edf6f9]">Templates</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Choose from <span className="text-white font-semibold">{templates.length}+</span> ready-to-use website templates.
          </p>
          
          {/* AI Recommendation - Simple Pill Input */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden pl-6 pr-2 py-2">
              <input
                ref={promptInputRef}
                placeholder="Describe your business or the website you want to build..." 
                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <button 
                className="bg-[#00c6a2] hover:bg-[#00b392] text-white font-proxima-bold py-3 px-5 rounded-full transition-all ml-2 flex items-center"
                onClick={handleFindTemplates}
                disabled={isRecommending || !userPrompt?.trim()}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.25 14.25L17.25 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9.75C9 8.5074 9.5074 8 10.75 8H13.25C14.4926 8 15 8.5074 15 9.75V10.25C15 11.4926 14.4926 12 13.25 12H10.75C9.5074 12 9 12.5074 9 13.75V14.25C9 15.4926 9.5074 16 10.75 16H13.25C14.4926 16 15 15.4926 15 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {isRecommending ? 'Thinking...' : 'Get AI Recommendations'}
              </button>
            </div>
            
            {/* Popular Template Categories */}
            <div className="mt-6 flex flex-col items-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1 border border-white/20 mb-3">
                <span className="text-sm font-medium text-white mr-3">Popular themes:</span>
                <div className="h-4 w-px bg-white/30 mr-3"></div>
                <div className="flex items-center gap-x-3">
                  {['eCommerce', 'Corporate', 'Portfolio', 'Blog', 'Landing Page'].map((category) => (
                    <button
                      key={category}
                      className="px-3 py-1 text-sm whitespace-nowrap rounded-full font-proxima-bold transition-all transform duration-200 text-white hover:text-[#dd4f93] hover:scale-110 hover:bg-white/10"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mt-8">
            {dynamicStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 count-animation">
                  {stat.value}
                </div>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
