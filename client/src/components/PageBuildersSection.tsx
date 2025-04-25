import { useQuery } from "@tanstack/react-query";
import type { PageBuilder } from "@shared/schema";

export default function PageBuildersSection() {
  const { data: pageBuilders = [], isLoading } = useQuery<PageBuilder[]>({
    queryKey: ["/api/page-builders"],
  });

  return (
    <section id="page-builders" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-gray-800 mb-4">
            Choose Your Page Builder
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our templates work seamlessly with your favorite page builder. Import with a single click and start customizing.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageBuilders.map((builder) => (
              <div 
                key={builder.id} 
                className="hover-lift bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
              >
                <div className="mb-6 h-16 flex items-center justify-center">
                  <img 
                    src={builder.logoUrl} 
                    alt={`${builder.name} Logo`} 
                    className="h-12 max-w-[140px] object-contain"
                  />
                </div>
                <h3 className="text-xl font-lexend font-semibold text-gray-800 mb-3">{builder.name}</h3>
                <p className="text-gray-600 mb-6 text-sm">{builder.description}</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-[#8c21a1]/10 text-[#8c21a1] rounded-full font-proxima-bold">
                    {builder.templateCount}+ Templates
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-proxima-bold">
                    {builder.feature}
                  </span>
                </div>
                <div className="mt-6">
                  <a 
                    href="#" 
                    className="text-[#dd4f93] hover:text-[#8c21a1] font-proxima-bold text-sm inline-flex items-center transition-colors"
                  >
                    View Templates
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
