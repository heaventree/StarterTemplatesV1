import type { Template } from "@shared/schema";
import TemplatePreviewButton from "./TemplatePreviewButton";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  // Helper function to normalize image paths and ensure consistent thumbnails
  const getImagePath = (path: string): string => {
    // Initial null check
    if (!path) {
      // Choose a specific fallback image from our list of thumbnails based on template ID
      const thumbnailIndex = (template.id || 0) % 6; // We have 6 thumbnail files
      return `/images/thumbnail${thumbnailIndex > 0 ? ` (${thumbnailIndex})` : ''}.jpg`;
    }
    
    // If it's already a full path or external URL, return as is
    if (path.startsWith('http')) return path;
    
    // Fix attached_assets path to use /images/ instead
    if (path.includes('attached_assets/images/')) {
      return path.replace('attached_assets/images/', 'images/');
    }
    
    // Handle bad image paths - if the path is too short or just a placeholder
    if (path.length < 15 || path.includes('placeholder')) {
      // Use a specific template image based on the template ID
      // This ensures each template always gets the same fallback image
      const thumbnailIndex = (template.id || 0) % 6; // We have 6 thumbnail files
      return `/images/thumbnail${thumbnailIndex > 0 ? ` (${thumbnailIndex})` : ''}.jpg`;
    }
    
    // If path starts with a slash, it's a relative path from the public folder
    if (path.startsWith('/')) {
      return path;
    }
    
    // Add leading slash if missing
    return path.startsWith('/') ? path : `/${path}`;
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
        {/* Template Image - align to top with object-top */}
        <a 
          href={`/api/template-proxy?url=${encodeURIComponent(template.demoUrl || '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block aspect-[1/1] sm:aspect-[4/5]"
        >
          <img 
            src={getImagePath(template.imageUrl || '')}
            alt={template.title} 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image doesn't load - use a consistent thumbnail based on template ID
              const target = e.target as HTMLImageElement;
              const thumbnailIndex = (template.id || 0) % 6; // We have 6 thumbnail files
              target.src = `/images/thumbnail${thumbnailIndex > 0 ? ` (${thumbnailIndex})` : ''}.jpg`;
              
              // If that also fails, use a general fallback
              target.onerror = () => { 
                target.src = '/images/templates-cta-img-scaled.webp';
                target.onerror = null; // Prevent infinite loop
              };
            }}
          />
        </a>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dd4f93]/80 to-[#8c21a1]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <TemplatePreviewButton template={template} />
          </div>
        </div>
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
