/**
 * Known working template URLs for previews
 * Maps from template title to confirmed working URLs
 */
export const TEMPLATE_URL_MAP: Record<string, string> = {
  // Travel & Hospitality Templates
  "Travel Agency": "https://websitedemos.net/travel-agency-04/",
  "Travel and Tourism": "https://websitedemos.net/travel-and-tourism-02/",
  "Travel Blogger": "https://websitedemos.net/travel-blog-02/",
  "Budget Hotel": "https://websitedemos.net/budget-hotel-04/",
  "Mountain Hotel": "https://websitedemos.net/mountain-hotel-02/",
  "Cafe Library": "https://websitedemos.net/cafe-library-02/",
  "Wine Bar and Restaurant": "https://websitedemos.net/wine-bar-04/",
  "BBQ Food Truck": "https://websitedemos.net/bbq-food-truck-04/",
  "Cake Shop": "https://websitedemos.net/cake-shop-04/",
  "Cafe": "https://websitedemos.net/cafe-04/",
  
  // Business Templates
  "Brand Store": "https://websitedemos.net/brandstore-02/",
  "Tech Startup": "https://websitedemos.net/tech-startup-04/",
  "Business Consulting": "https://websitedemos.net/business-consulting-02/",
  "Business Consultancy Firm": "https://websitedemos.net/business-consultancy-04/",
  "Construction Company": "https://websitedemos.net/construction-company-02/",
  "Corporate Business": "https://websitedemos.net/corporate-business-02/",
  "SaaS Company": "https://websitedemos.net/saas-startup-04/",
  "Digital Agency": "https://websitedemos.net/digital-agency-02/",
  "Marketing Agency": "https://websitedemos.net/marketing-agency-02/",
  "Legal Attorney": "https://websitedemos.net/legal-attorney-02/",
  
  // Online Store Templates
  "Electronic Store": "https://websitedemos.net/electronic-store-04/",
  "Beauty Products Store": "https://websitedemos.net/beauty-products-store-04/",
  "Book Store": "https://websitedemos.net/book-store-02/",
  "Fashion Store": "https://websitedemos.net/fashion-designer-store-04/",
  "Sports Store": "https://websitedemos.net/sports-store-04/",
  "Furniture Store": "https://websitedemos.net/furniture-store-04/",
  
  // Creative Templates
  "Photographer": "https://websitedemos.net/photographer-02/",
  "Web Designer": "https://websitedemos.net/web-design-agency-02/",
  "Fashion Photographer": "https://websitedemos.net/fashion-photography-04/",
  "Graphic Designer": "https://websitedemos.net/graphic-design-portfolio/",
  "Wedding Invitation": "https://websitedemos.net/wedding-invitation-04/",
  "Artist Portfolio": "https://websitedemos.net/artist-portfolio-02/",
  "Vlogger": "https://websitedemos.net/vlogger-02/",
  
  // Others
  "Love Nature": "https://websitedemos.net/love-nature-02/",
  "Charity": "https://websitedemos.net/charity-02/",
  "App Landing Page": "https://websitedemos.net/app-landing-page-04/",
  "University": "https://websitedemos.net/university-04/",
  "Yoga Studio": "https://websitedemos.net/yoga-studio-04/",
  "Wellness Coach": "https://websitedemos.net/wellness-coach-02/",
  "Medical": "https://websitedemos.net/medical-02/",
  "Home Renovation": "https://websitedemos.net/home-renovation-02/",
};

/**
 * Get a working URL for a template
 * Falls back to the provided URL if no mapping exists
 */
export function getWorkingTemplateUrl(title: string, fallbackUrl: string): string {
  // Clean the title - remove 'Template' suffix if present
  const cleanTitle = title.replace(/\s+Template$/, '').trim();
  
  // Check if we have a known working URL for this template
  if (TEMPLATE_URL_MAP[cleanTitle]) {
    return TEMPLATE_URL_MAP[cleanTitle];
  }
  
  // If not found, return the fallback URL
  return fallbackUrl;
}