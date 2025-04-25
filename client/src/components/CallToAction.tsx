export default function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-white mb-6">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
            Get access to 600+ premium templates and start creating your website today. No coding skills required!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#templates" 
              className="bg-white text-primary hover:bg-gray-100 font-proxima-bold py-3 px-8 rounded-md text-center transition-colors"
            >
              BROWSE TEMPLATES
            </a>
            <a 
              href="#" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-proxima-bold py-3 px-8 rounded-md text-center transition-colors"
            >
              GET STARTED
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
