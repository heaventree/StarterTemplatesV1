import type { Template } from "@shared/schema";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {/* Template Image */}
        <img 
          src={template.imageUrl} 
          alt={template.title} 
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dd4f93]/80 to-[#8c21a1]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a 
            href="#" 
            className="text-white font-proxima-bold bg-white/20 backdrop-blur-sm rounded-full py-2.5 px-6 hover:bg-white/30 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            Preview
          </a>
        </div>
        
        {/* Page builder badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-proxima-bold text-[#8c21a1]">
          {template.pageBuilder}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-lexend font-semibold text-gray-800 mb-2 group-hover:text-[#dd4f93] transition-colors">
          {template.title}
        </h3>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
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
          
          <span className={`text-xs py-1 px-3 rounded-full font-proxima-bold ${
            template.isPro 
              ? 'bg-[#dd4f93]/10 text-[#dd4f93]' 
              : 'bg-emerald-100 text-emerald-600'
          }`}>
            {template.isPro ? 'Pro' : 'Free'}
          </span>
        </div>
      </div>
    </div>
  );
}
