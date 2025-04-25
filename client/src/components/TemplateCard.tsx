import type { Template } from "@shared/schema";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
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
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Page builder label at top */}
      <div className={`${getPageBuilderColor(template.pageBuilder)} text-xs font-medium px-2 py-1 text-center sticky top-0 z-10`}>
        {template.pageBuilder}
      </div>

      <div className="relative overflow-hidden flex-1">
        {/* Template Image - align to top with object-top */}
        <a 
          href={template.demoUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block aspect-[2/3]"
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
        </a>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dd4f93]/80 to-[#8c21a1]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a 
            href={template.demoUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white font-semibold bg-white/20 backdrop-blur-sm rounded-full py-2.5 px-6 hover:bg-white/30 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            Preview
          </a>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#dd4f93] transition-colors">
          {template.title}
        </h3>
        
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
          
        <span className={`text-xs py-1 px-3 rounded-full font-semibold ${
          template.isPro 
            ? 'bg-[#dd4f93]/10 text-[#dd4f93]' 
            : 'bg-emerald-100 text-emerald-600'
        }`}>
          {template.isPro ? 'Pro' : 'Free'}
        </span>
      </div>
    </div>
  );
}
