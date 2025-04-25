import { features } from "@/lib/data";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
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
          {features.map((feature) => (
            <div key={feature.id} className="p-6 bg-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className={`fas fa-${feature.icon} text-xl text-primary`}></i>
              </div>
              <h3 className="text-xl font-proxima-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
