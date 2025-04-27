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
  const promptInputRef = useRef<HTMLInputElement>(null);
  
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
                placeholder="Briefly describe the website you want to build..." 
                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <button 
                className="bg-[#9c27b0] hover:bg-[#8e24aa] text-white font-proxima-bold py-3 px-5 rounded-full transition-all ml-2 flex items-center"
                onClick={handleFindTemplates}
                disabled={isRecommending || !userPrompt?.trim()}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.01-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116.001-1.46-.107-.345-.345-.624-.822-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45.28-.213.46-.536.82-1.182l.328-.588Z"/>
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
