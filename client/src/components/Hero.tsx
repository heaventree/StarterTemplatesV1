import { stats } from "@/lib/data";

export default function Hero() {
  return (
    <section className="pt-28 pb-16 lg:pt-40 lg:pb-24 relative bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-lexend font-bold text-gray-800 mb-6 leading-tight">
            Beautiful Website Templates for <span className="text-primary">Every Builder</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Build a stunning website in minutes with Starter Templates. Choose from 600+ ready-to-use website templates and blocks for your favorite page builder.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <a 
              href="#templates" 
              className="bg-primary hover:bg-blue-600 text-white font-proxima-bold py-3 px-8 rounded-md text-center transition-colors"
            >
              BROWSE TEMPLATES
            </a>
            <a 
              href="#page-builders" 
              className="bg-white border border-gray-200 hover:border-primary text-gray-800 hover:text-primary font-proxima-bold py-3 px-8 rounded-md text-center transition-colors"
            >
              EXPLORE PAGE BUILDERS
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1 count-animation">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
