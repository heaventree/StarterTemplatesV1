import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TemplateCard from "@/components/TemplateCard";
import { categories } from "@/lib/data";
import type { Template } from "@shared/schema";

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  useEffect(() => {
    if (templates && templates.length > 0) {
      let filtered = [...templates];
      
      // Apply category filter if not 'all'
      if (activeCategory !== "all") {
        filtered = filtered.filter(
          template => template.category.toLowerCase() === activeCategory.toLowerCase()
        );
      }
      
      // Apply search filter
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(template => 
          template.title.toLowerCase().includes(lowerSearch) || 
          template.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
      }
      
      setFilteredTemplates(filtered);
    }
  }, [templates, activeCategory, searchTerm]);

  return (
    <section id="templates" className="py-16 bg-[#f9fafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-gray-800 mb-4">
            Beautiful Website Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from hundreds of professionally designed templates for any industry. Import with a single click and customize to your needs.
          </p>
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
        
        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-lg h-72 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <a 
            href="#" 
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#dd4f93] to-[#8c21a1] hover:from-[#8c21a1] hover:to-[#dd4f93] text-white font-proxima-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            VIEW ALL TEMPLATES
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
