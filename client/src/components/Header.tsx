import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white shadow py-2" 
        : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src={scrolled 
                ? "/images/logos/heaventree-logo-color.png"
                : "/images/logos/heaventree-logo-white.png"
              }
              alt="Heaventree Logo" 
              className="h-10"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a 
              href="#templates" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              TEMPLATES
            </a>
            <a 
              href="#page-builders" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              PAGE BUILDERS
            </a>
            <a 
              href="#features" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              FEATURES
            </a>
            <Link 
              href="/roadmap" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              ROADMAP
            </Link>
            <a 
              href="#" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              BLOG
            </a>
            <a 
              href="#" 
              className={`font-proxima-bold text-sm transition-colors ${
                scrolled ? "text-gray-800 hover:text-[#dd4f93]" : "text-white hover:text-white/80"
              }`}
            >
              SUPPORT
            </a>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="#" 
              className={`font-proxima-bold py-2 px-6 rounded-md transition-colors ${
                scrolled 
                  ? "bg-[#dd4f93] hover:bg-[#8c21a1] text-white" 
                  : "bg-white hover:bg-gray-100 text-[#8c21a1]"
              }`}
            >
              GET STARTED
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={`lg:hidden focus:outline-none ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden bg-white shadow-md ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <a 
            href="#templates" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            TEMPLATES
          </a>
          <a 
            href="#page-builders" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            PAGE BUILDERS
          </a>
          <a 
            href="#features" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            FEATURES
          </a>
          <Link 
            href="/roadmap" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            ROADMAP
          </Link>
          <a 
            href="#" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            BLOG
          </a>
          <a 
            href="#" 
            className="block text-gray-800 hover:text-[#dd4f93] font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            SUPPORT
          </a>
          <a 
            href="#" 
            className="block bg-[#dd4f93] hover:bg-[#8c21a1] text-white font-proxima-bold py-2 px-6 rounded-md transition-colors text-center"
            onClick={closeMobileMenu}
          >
            GET STARTED
          </a>
        </div>
      </div>
    </header>
  );
}
