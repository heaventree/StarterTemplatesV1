import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Template } from "@shared/schema";
import { getAIRecommendedTemplates, getTemplatesByCategory } from "@/services/templateRecommender";
import AwardsCarousel from "@/components/AwardsCarousel";

export default function Hero() {
  // AI recommendation states
  const [userPrompt, setUserPrompt] = useState("");
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendedTemplates, setRecommendedTemplates] = useState<Template[]>([]);
  const promptInputRef = useRef<HTMLInputElement>(null);
  
  // Get actual template count from API
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });
  
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
          
          {/* AI Recommendation - Enhanced Pill Input */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="p-[3px] bg-gradient-to-r from-[#ff87d8] via-[#a657ef] to-[#9c27b0] rounded-full shadow-[0_4px_24px_rgba(156,39,176,0.3)] overflow-hidden">
              <div className="flex items-center bg-white rounded-full overflow-hidden pl-6 pr-2 py-2">
                <input
                  ref={promptInputRef}
                  placeholder="Briefly describe the website you want to build..." 
                  className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
                <button 
                  className="bg-gradient-to-r from-[#a657ef] to-[#9c27b0] hover:from-[#9c27b0] hover:to-[#a657ef] text-white font-proxima-bold py-3 px-6 rounded-full transition-all ml-2 flex items-center shadow-[0_4px_15px_rgba(156,39,176,0.35)]"
                  onClick={handleFindTemplates}
                  disabled={isRecommending || !userPrompt?.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 lucide-wand-sparkles"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                  {isRecommending ? 'Thinking...' : 'Get AI Recommendations'}
                </button>
              </div>
            </div>
            
            {/* Popular Template Categories */}
            <div className="mt-6 flex flex-col items-center">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-md rounded-full px-4 py-1 border border-white/30 mb-3 shadow-[0_4px_24px_rgba(255,255,255,0.15)]">
                <span className="text-sm font-medium text-white mr-3">Popular themes:</span>
                <div className="h-4 w-px bg-white/40 mr-3"></div>
                <div className="flex items-center gap-x-3">
                  {['eCommerce', 'Corporate', 'Portfolio', 'Blog', 'Landing Page'].map((category) => (
                    <button
                      key={category}
                      className="px-3 py-1 text-sm whitespace-nowrap rounded-full font-proxima-bold transition-all transform duration-200 text-white hover:text-[#ff87d8] hover:scale-110 hover:bg-white/20"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Award Logos */}
          <div className="mt-4">
            <h3 className="text-white text-lg font-semibold mb-2">Award Winning Templates</h3>
            <AwardsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
