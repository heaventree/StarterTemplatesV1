import type { Template } from "@shared/schema";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="template-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={`${template.imageUrl}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`} 
          alt={template.title} 
          className="w-full h-48 object-cover"
        />
        <div className="hover-overlay absolute inset-0 bg-primary/80 opacity-0 transition-opacity flex items-center justify-center">
          <a href="#" className="text-white font-proxima-bold bg-white/20 backdrop-blur-sm rounded-md py-2 px-4 hover:bg-white/30 transition-colors">
            Preview
          </a>
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-proxima-bold text-primary">
          {template.pageBuilder}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-proxima-bold text-gray-800 mb-1">{template.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{template.tags.join(', ')}</span>
          <span className="text-xs py-1 px-2 bg-gray-100 rounded text-gray-800">
            {template.isPro ? 'Pro' : 'Free'}
          </span>
        </div>
      </div>
    </div>
  );
}
