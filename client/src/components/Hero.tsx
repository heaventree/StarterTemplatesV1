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
          
          {/* AI Recommendation Text Area - Stunning Modern Design */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] backdrop-blur-lg border border-white/20">
              <div className="relative">
                <textarea 
                  ref={promptInputRef}
                  placeholder="Describe your business or the website you want to build..." 
                  className="w-full resize-none p-6 min-h-[90px] bg-white/95 text-gray-700 placeholder-gray-500 focus:outline-none font-medium text-base"
                  rows={2}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
                {userPrompt.length > 0 && (
                  <button 
                    onClick={() => setUserPrompt("")}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div 
                className="flex justify-between items-center px-6 py-4" 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(221, 79, 147, 0.9) 0%, rgba(140, 33, 161, 0.9) 100%)' 
                }}
              >
                <div className="flex items-center text-white text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.493 2.853a1 1 0 00-1.986 0A5.5 5.5 0 003.5 8a1 1 0 00.5.866V17a1 1 0 001 1h10a1 1 0 001-1V8.866A1 1 0 0016.5 8a5.5 5.5 0 00-4.007-5.147zM12 18H8v-5h4v5zm1-6H7v-2h6v2z" clipRule="evenodd" />
                  </svg>
                  AI-powered recommendations
                </div>
                <button 
                  className="bg-white hover:bg-gray-50 text-[#8c21a1] hover:text-[#dd4f93] font-proxima-bold py-2.5 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-lg"
                  onClick={handleFindTemplates}
                  disabled={isRecommending || !userPrompt?.trim()}
                >
                  {isRecommending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#8c21a1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finding...
                    </span>
                  ) : (
                    'Find Templates'
                  )}
                </button>
              </div>
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
