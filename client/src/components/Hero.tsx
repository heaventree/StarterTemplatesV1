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
          
          {/* AI Recommendation Text Area - Exactly as shown in screenshot */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="rounded-lg overflow-hidden">
              <textarea 
                ref={promptInputRef}
                placeholder="Describe your business or the website you want to build..." 
                className="w-full resize-none p-5 min-h-[80px] bg-white/95 text-gray-700 placeholder-gray-500 focus:outline-none"
                rows={2}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <div className="flex justify-between items-center px-5 py-3" style={{ backgroundColor: 'rgba(156, 39, 176, 0.8)' }}>
                <div className="text-white/90 text-sm">AI-powered recommendations</div>
                <button 
                  className="bg-white hover:bg-gray-50 text-[#9c27b0] font-proxima-bold py-2 px-8 rounded-full transition-all"
                  onClick={handleFindTemplates}
                  disabled={isRecommending || !userPrompt?.trim()}
                >
                  {isRecommending ? 'Finding...' : 'Find Templates'}
                </button>
              </div>
            </div>
            
            {/* Popular Template Categories - Exactly as shown in screenshot */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <span className="text-sm font-medium text-white">Popular themes:</span>
              <div className="flex items-center space-x-3 overflow-x-auto">
                {['eCommerce', 'Corporate', 'Portfolio', 'Blog', 'Landing Page'].map((category) => (
                  <button
                    key={category}
                    className="px-6 py-2 whitespace-nowrap rounded-full font-proxima-bold transition-colors text-white bg-[rgba(156,39,176,0.4)] hover:bg-[rgba(156,39,176,0.6)]"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
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
