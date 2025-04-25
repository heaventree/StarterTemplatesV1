import { useQuery } from "@tanstack/react-query";
import type { PageBuilder } from "@shared/schema";

export default function PageBuildersSection() {
  const { data: pageBuilders = [], isLoading } = useQuery<PageBuilder[]>({
    queryKey: ["/api/page-builders"],
  });

  return (
    <section id="page-builders" className="py-16 bg-gray-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageBuilders.map((builder) => (
              <div key={builder.id} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                <img 
                  src={builder.logoUrl} 
                  alt={`${builder.name} Logo`} 
                  className="h-16 mx-auto mb-4"
                />
                <h3 className="text-xl font-proxima-bold text-gray-800 mb-3">{builder.name}</h3>
                <p className="text-gray-600 mb-6">{builder.description}</p>
                <div className="flex justify-center space-x-2 text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-primary rounded-full">{builder.templateCount}+ Templates</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">{builder.feature}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
