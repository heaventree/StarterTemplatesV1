import { footerLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#151823] text-white pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Column 1 - Logo and About */}
          <div className="lg:col-span-2">
            <img 
              src="https://startertemplates.com/wp-content/uploads/2020/08/starter-templates-logo-white.svg" 
              alt="Starter Templates Logo" 
              className="h-8 mb-6"
            />
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Beautiful website templates for WordPress page builders. Build your website in minutes without any coding skills. Import with a single click and start customizing.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-[#dd4f93] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#dd4f93] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#dd4f93] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3.75c2.347 0 2.625.01 3.546.052.864.039 1.331.184 1.643.305.413.16.708.35 1.017.66.31.309.5.604.66 1.017.121.312.266.779.305 1.642.042.922.052 1.2.052 3.548s-.01 2.625-.052 3.546c-.039.864-.184 1.331-.305 1.643-.16.413-.35.708-.66 1.017-.309.31-.604.5-1.017.66-.312.121-.78.266-1.642.305-.922.042-1.2.052-3.548.052s-2.625-.01-3.546-.052c-.864-.039-1.331-.184-1.643-.305-.413-.16-.708-.35-1.017-.66-.31-.309-.5-.604-.66-1.017-.121-.312-.266-.78-.305-1.642-.042-.922-.052-1.2-.052-3.548s.01-2.625.052-3.546c.039-.864.184-1.331.305-1.643.16-.413.35-.708.66-1.017.309-.31.604-.5 1.017-.66.312-.121.779-.266 1.642-.305.922-.042 1.2-.052 3.548-.052z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#dd4f93] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Templates */}
          <div>
            <h3 className="text-lg font-lexend font-semibold mb-6 text-white">Templates</h3>
            <ul className="space-y-3">
              {footerLinks.templates.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-[#dd4f93] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Resources */}
          <div>
            <h3 className="text-lg font-lexend font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-[#dd4f93] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4 - Company */}
          <div>
            <h3 className="text-lg font-lexend font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-[#dd4f93] transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Starter Templates. All rights reserved.
            </p>
            <div className="mt-6 md:mt-0 space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <span>Secured by</span>
              <img 
                src="https://startertemplates.com/wp-content/uploads/2023/03/stripe-logo.svg" 
                alt="Stripe" 
                className="h-4"
              />
              <img 
                src="https://startertemplates.com/wp-content/uploads/2023/03/paypal-logo.svg" 
                alt="PayPal" 
                className="h-4 ml-2"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
