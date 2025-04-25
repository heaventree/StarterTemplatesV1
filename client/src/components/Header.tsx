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
    <header className={`fixed w-full bg-white z-50 ${scrolled ? "shadow" : "shadow-sm"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="https://startertemplates.com/wp-content/uploads/2020/08/starter-templates-logo.svg" 
              alt="Starter Templates Logo" 
              className="h-8"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#templates" className="text-textDark hover:text-primary font-proxima-bold text-sm transition-colors">TEMPLATES</a>
            <a href="#page-builders" className="text-textDark hover:text-primary font-proxima-bold text-sm transition-colors">PAGE BUILDERS</a>
            <a href="#" className="text-textDark hover:text-primary font-proxima-bold text-sm transition-colors">PRICING</a>
            <a href="#" className="text-textDark hover:text-primary font-proxima-bold text-sm transition-colors">BLOG</a>
            <a href="#" className="text-textDark hover:text-primary font-proxima-bold text-sm transition-colors">SUPPORT</a>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="#" 
              className="bg-primary hover:bg-blue-600 text-white font-proxima-bold py-2 px-6 rounded-md transition-colors"
            >
              GET STARTED
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-gray-800 focus:outline-none"
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
            className="block text-gray-800 hover:text-primary font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            TEMPLATES
          </a>
          <a 
            href="#page-builders" 
            className="block text-gray-800 hover:text-primary font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            PAGE BUILDERS
          </a>
          <a 
            href="#" 
            className="block text-gray-800 hover:text-primary font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            PRICING
          </a>
          <a 
            href="#" 
            className="block text-gray-800 hover:text-primary font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            BLOG
          </a>
          <a 
            href="#" 
            className="block text-gray-800 hover:text-primary font-proxima-bold text-sm py-2 transition-colors"
            onClick={closeMobileMenu}
          >
            SUPPORT
          </a>
          <a 
            href="#" 
            className="block bg-primary hover:bg-blue-600 text-white font-proxima-bold py-2 px-6 rounded-md transition-colors text-center"
            onClick={closeMobileMenu}
          >
            GET STARTED
          </a>
        </div>
      </div>
    </header>
  );
}
