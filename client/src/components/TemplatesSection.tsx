import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import TemplateCard from "@/components/TemplateCard";
import { categories } from "@/lib/data";
import type { Template } from "@shared/schema";
import { getAIRecommendedTemplates, getTemplatesByCategory } from "@/services/templateRecommender";

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [displayCount, setDisplayCount] = useState(12); // Initial display count
  const [showViewMore, setShowViewMore] = useState(true);
  
  // AI recommendation states
  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendationPrompt, setRecommendationPrompt] = useState("");

  // Using TanStack Query v5 with proper type annotations
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });

  useEffect(() => {
    if (templates && templates.length > 0) {
      let filtered = [...templates];
      
      // Apply category filter if not 'all'
      if (activeCategory !== "all") {
        filtered = filtered.filter(template => {
          // Convert spaces to hyphens and lowercase for comparison
          const normalizedTemplateCategory = template.category.toLowerCase().replace(/\s+/g, '-');
          return normalizedTemplateCategory === activeCategory;
        });
      }
      
      // Apply search filter
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(template => 
          template.title.toLowerCase().includes(lowerSearch) || 
          template.tags?.some((tag: string) => tag.toLowerCase().includes(lowerSearch)) || false
        );
      }
      
      setFilteredTemplates(filtered);
      
      // Reset display count when filters change
      setDisplayCount(12);
      // Update view more button visibility
      setShowViewMore(filtered.length > 12);
    }
  }, [templates, activeCategory, searchTerm]);

  const handleViewMore = () => {
    // Increase display count by 14 (as suggested)
    const newCount = Math.min(displayCount + 14, filteredTemplates.length);
    setDisplayCount(newCount);
    
    // Hide button if all templates are displayed
    if (newCount >= filteredTemplates.length) {
      setShowViewMore(false);
    }
  };
  
  // Listen for AI recommendation events from Hero component
  useEffect(() => {
    const handleAIRecommendation = (event: CustomEvent) => {
      const { recommendations, prompt } = event.detail;
      
      // Update filtered templates with AI recommendations
      setFilteredTemplates(recommendations);
      setShowRecommended(true);
      setRecommendationPrompt(prompt);
      
      // Reset other filters
      setActiveCategory("all");
      setSearchTerm("");
      
      // Reset display count and show more button
      setDisplayCount(12);
      setShowViewMore(recommendations.length > 12);
    };
    
    // Add event listener
    window.addEventListener('ai-recommendation', handleAIRecommendation as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('ai-recommendation', handleAIRecommendation as EventListener);
    };
  }, [templates]);

  return (
    <section id="templates" className="py-16 bg-[#f9fafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-gray-800 mb-4">
            Beautiful Website Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from <span className="text-[#dd4f93] font-semibold">{templates.length}+</span> ready-to-use website templates and blocks.
          </p>
          
          {/* Empty space since we've moved the AI recommendation to Hero section */}
        </div>
        
        {/* Filters */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full font-proxima-bold transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#8c21a1] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="relative max-w-md mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pr-10 rounded-full shadow-sm border border-gray-200 focus:border-[#dd4f93] focus:ring-2 focus:ring-[#dd4f93]/20 focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Recommendation Results Label */}
        {showRecommended && !isLoading && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f0f4ff] text-[#5469d4] border border-[#cbd5e1]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="font-proxima-bold">AI Recommended Templates</span>
              <button 
                onClick={() => {
                  setShowRecommended(false);
                  setActiveCategory("all");
                  setRecommendationPrompt("");
                  setFilteredTemplates(templates);
                }} 
                className="ml-3 text-gray-500 hover:text-gray-700"
                title="Clear recommendations"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {[...Array(12)].map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-lg aspect-[1/1] sm:aspect-[4/5] animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
              {filteredTemplates.slice(0, displayCount).map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                />
              ))}
            </div>
            
            {/* Template Count Display */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              Showing {Math.min(displayCount, filteredTemplates.length)} of {filteredTemplates.length} templates
              {showRecommended && <span> based on your requirements</span>}
            </div>
          </>
        )}
        
        {/* View More Button */}
        {showViewMore && !isLoading && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleViewMore}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#dd4f93] to-[#8c21a1] hover:from-[#8c21a1] hover:to-[#dd4f93] text-white font-proxima-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              VIEW ALL TEMPLATES
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
