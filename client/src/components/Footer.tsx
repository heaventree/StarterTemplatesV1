import { footerLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Logo and About */}
          <div>
            <img 
              src="https://startertemplates.com/wp-content/uploads/2020/08/starter-templates-logo-light.svg" 
              alt="Starter Templates Logo" 
              className="h-8 mb-4"
            />
            <p className="text-gray-400 mb-4">
              Beautiful website templates for WordPress page builders. Build your website in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Templates */}
          <div>
            <h3 className="text-lg font-proxima-bold mb-4">Templates</h3>
            <ul className="space-y-2">
              {footerLinks.templates.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Resources */}
          <div>
            <h3 className="text-lg font-proxima-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4 - Company */}
          <div>
            <h3 className="text-lg font-proxima-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Starter Templates. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <img 
                src="https://startertemplates.com/wp-content/uploads/2020/08/payment-methods.png" 
                alt="Payment Methods" 
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
