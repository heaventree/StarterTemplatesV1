import { features } from "@/lib/data";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#f9fafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-gray-800 mb-4">
            Why Choose Starter Templates?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our templates stand out from the rest.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover-lift relative overflow-hidden"
            >
              {/* Decorative gradient circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-[#dd4f93]/10 to-[#8c21a1]/10 opacity-70"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#dd4f93]/20 to-[#8c21a1]/20 rounded-xl flex items-center justify-center mb-5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-[#8c21a1]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {getIconPath(feature.icon)}
                  </svg>
                </div>
                
                <h3 className="text-xl font-lexend font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to get SVG path for each icon type
function getIconPath(iconName: string) {
  switch (iconName) {
    case 'bolt':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      );
    case 'code':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      );
    case 'mobile':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      );
    case 'palette':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      );
    case 'sync':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      );
    case 'chart-bar':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      );
    default:
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      );
  }
}
