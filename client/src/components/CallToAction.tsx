export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#8c21a1] to-[#1e056f] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/20 translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lexend font-bold text-white mb-6">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            Get access to 600+ premium templates and start creating your website today. No coding skills required!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a 
              href="#templates" 
              className="bg-white text-[#8c21a1] hover:bg-gray-100 font-proxima-bold py-3.5 px-8 rounded-full text-center transition-colors shadow-md hover:shadow-lg"
            >
              BROWSE TEMPLATES
            </a>
            <a 
              href="#" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-proxima-bold py-3.5 px-8 rounded-full text-center transition-colors"
            >
              GET STARTED
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
            <div className="text-white/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="text-white/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="text-white/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm">Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
