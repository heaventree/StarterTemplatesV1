import { useState } from "react";
import type { Template } from "@shared/schema";
import TemplatePreviewButton from "./TemplatePreviewButton";
import { Dialog } from "@/components/ui/dialog";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  // Helper function to normalize image paths
  const getImagePath = (path: string): string => {
    if (!path) return '/images/templates-cta-img-scaled.webp';
    
    // If it's already a full path or external URL, return as is
    if (path.startsWith('http')) return path;
    
    // Fix attached_assets path to use /images/ instead
    if (path.includes('attached_assets/images/')) {
      return path.replace('attached_assets/images/', 'images/');
    }
    
    return path;
  };

  // Get page builder color
  const getPageBuilderColor = (builder: string) => {
    switch(builder.toLowerCase()) {
      case 'elementor':
        return 'text-[#92003B]';
      case 'gutenberg':
        return 'text-[#4F1A89]';
      case 'beaver builder':
        return 'text-[#2271B1]';
      case 'brizy':
        return 'text-[#D92C33]';
      default:
        return 'text-[#8c21a1]';
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full max-w-sm mx-auto">
      {/* Page builder label removed as requested */}

      <div className="relative overflow-hidden flex-1">
        {/* Template Image - click for preview instead of external link */}
        <div 
          className="block aspect-[1/1] sm:aspect-[4/5] cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          <img 
            src={getImagePath(template.imageUrl)} 
            alt={template.title} 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image doesn't load
              const target = e.target as HTMLImageElement;
              target.src = '/images/templates-cta-img-scaled.webp'; 
            }}
          />
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dd4f93]/80 to-[#8c21a1]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button 
              className="text-white font-semibold bg-white/20 backdrop-blur-sm rounded-full py-2.5 px-6 hover:bg-white/30 transition-colors"
              onClick={() => setShowPreview(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>
        </div>
        
        {/* Preview Dialog */}
        {showPreview && (
          <TemplatePreviewButton 
            template={template} 
            showText={false} 
            isOpen={showPreview} 
            onOpenChange={setShowPreview} 
          />
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#dd4f93] transition-colors">
            {template.title}
          </h3>
          
          <span className={`text-xs py-1 px-3 rounded-full font-semibold ml-auto ${
            template.isPro 
              ? 'bg-[#dd4f93]/10 text-[#dd4f93]' 
              : 'bg-emerald-100 text-emerald-600'
          }`}>
            {template.isPro ? 'Pro' : 'Free'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {template.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {template.tags && template.tags.length > 2 && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              +{template.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
