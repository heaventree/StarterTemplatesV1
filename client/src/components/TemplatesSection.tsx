import { useState, useEffect, useRef, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // AI recommendation states
  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendationPrompt, setRecommendationPrompt] = useState("");

  // Using TanStack Query v5 with proper type annotations
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });

  // Filter templates when criteria change
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
    }
  }, [templates, activeCategory, searchTerm]);

  // Load more templates when scrolling
  const loadMoreTemplates = useCallback(() => {
    if (loading || displayCount >= filteredTemplates.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(prevCount => {
        const newCount = Math.min(prevCount + 12, filteredTemplates.length);
        return newCount;
      });
      setLoading(false);
    }, 500); // Short timeout to prevent multiple rapid loads
  }, [displayCount, filteredTemplates.length, loading]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && displayCount < filteredTemplates.length) {
          loadMoreTemplates();
        }
      },
      { threshold: 0.5 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [displayCount, filteredTemplates.length, loadMoreTemplates, loading]);
  
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
      
      // Reset display count
      setDisplayCount(12);
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
        {/* Title and subheading removed as requested */}
        <div className="mb-10">
          {/* Empty space to maintain layout spacing */}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 lucide-wand-sparkles">
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
                <path d="m14 7 3 3"/>
                <path d="M5 6v4"/>
                <path d="M19 14v4"/>
                <path d="M10 2v2"/>
                <path d="M7 8H3"/>
                <path d="M21 16h-4"/>
                <path d="M11 3H9"/>
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
        
        {/* Loading indicator and intersection observer target */}
        {!isLoading && displayCount < filteredTemplates.length && (
          <div 
            ref={observerTarget} 
            className="mt-12 text-center py-8"
          >
            {loading ? (
              <div className="inline-flex items-center justify-center space-x-2">
                <div className="h-4 w-4 bg-[#dd4f93] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-4 w-4 bg-[#8c21a1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-4 w-4 bg-[#dd4f93] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <span className="text-gray-400">Scroll for more templates</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
