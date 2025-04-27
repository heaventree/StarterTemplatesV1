/**
 * Template URLs mapping
 * This file serves as a backup reference for demo URLs in case of database issues
 * It maps template titles to their corresponding demo URLs
 */

type TemplateUrlMapping = {
  [key: string]: string;
};

/**
 * Map of template titles to their demo URLs
 * The keys are the exact template titles
 * The values are the fully qualified demo URLs
 */
export const templateUrlMap: TemplateUrlMapping = {
  "Love Nature": "https://websitedemos.net/love-nature-02",
  "Outdoor Adventure": "https://websitedemos.net/outdoor-adventure-02",
  "Brandstore": "https://websitedemos.net/brandstore-02",
  "Electronic Store": "https://websitedemos.net/electronic-store-04",
  "Wellness Coach": "https://websitedemos.net/wellness-coach-02",
  "Planet Earth": "https://websitedemos.net/earth-02",
  "Fashion Photography Portfolio": "https://websitedemos.net/fashion-photography-04",
  "Hope": "https://websitedemos.net/hope",
  "Politician": "https://websitedemos.net/politician-04",
  "Alexandrina Kennedy – Designer": "https://websitedemos.net/alexandrina-designer",
  "Lifestyle Blogger": "https://websitedemos.net/lifestyle-blogger-04",
  "Planet Earth Store": "https://websitedemos.net/earth-store-02",
  "Nexus News": "https://websitedemos.net/news-blog-04",
  "Black Friday": "https://websitedemos.net/black-friday-bonanza-04",
  "Earthly Elegance": "https://websitedemos.net/gardening-and-landscape-02",
  "Accountant": "https://websitedemos.net/accountant-02",
  "AC Technician": "https://websitedemos.net/ac-technician",
  "Animal Welfare": "https://websitedemos.net/animal-welfare",
  "App Landing Page": "https://websitedemos.net/appplus-landing-page-04",
  "Aquarium": "https://websitedemos.net/aquarium-04",
  "Architects": "https://websitedemos.net/architects",
  "Arch Masters": "https://websitedemos.net/archmasters-architecture-02",
  "Artist Christine": "https://websitedemos.net/artist-christine",
  "Artist Feb 20": "https://websitedemos.net/artist-feb-20",
  "Artist Multipurpose": "https://websitedemos.net/artist-multipurpose-02",
  "Author": "https://websitedemos.net/author",
  "Ayurveda": "https://websitedemos.net/ayurveda-04",
  "Baby Store": "https://websitedemos.net/baby-stores-04",
  "Barber Shop": "https://websitedemos.net/barber-shop-02",
  "BBQ Food Truck": "https://websitedemos.net/bbq-food-truck-04",
  "Adham Hoffman Designer": "https://websitedemos.net/adham-hoffman-designer",
  "Alexandrina Designer": "https://websitedemos.net/alexandrina-designer",
  "App Plus Landing Page": "https://websitedemos.net/appplus-landing-page-04",
  "Archmasters Architecture": "https://websitedemos.net/archmasters-architecture-02",
  "Artist Feb": "https://websitedemos.net/artist-feb-20",
  "Author Home": "https://websitedemos.net/author",
  "Baby Stores": "https://websitedemos.net/baby-stores-04",
  "Beauty Products Store": "https://websitedemos.net/beauty-products-store-02",
  "Be Bold Beauty Store": "https://websitedemos.net/be-bold-beauty-store-04",
  "Beer Launch": "https://websitedemos.net/beer-launch-02",
  "Bestselling Author": "https://websitedemos.net/bestselling-author-02",
  "Bike Modification": "https://websitedemos.net/bike-modification-04",
  "Bizpulse": "https://websitedemos.net/bizpulse-04",
  "Black Friday Sale": "https://websitedemos.net/black-friday-sale-04",
  "Blingg Jewellery": "https://websitedemos.net/blingg-jewellery-04",
  "Blockchain Technology": "https://websitedemos.net/blockchain-technology-04",
  "Blog": "https://websitedemos.net/blog-02",
  "Book Store": "https://websitedemos.net/book-store-02",
  "Budget Hotel": "https://websitedemos.net/budget-hotel-04",
  "Business Blog": "https://websitedemos.net/business-blog-04",
  "Business Consultancy": "https://websitedemos.net/business-consultancy-firm-04",
  "Business Consulting": "https://websitedemos.net/business-consulting-02",
  // Add more templates as needed
};

/**
 * Function to get demo URL for a template
 * @param title Template title
 * @returns The demo URL for the template if found, otherwise a generated URL based on the title
 */
export function getTemplateUrl(title: string): string {
  // Check if the title exists in our mapping
  if (templateUrlMap[title]) {
    return templateUrlMap[title];
  }
  
  // Fall back to a generated URL based on the title pattern
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  
  // Try to determine if it's more likely to have a -02 or -04 suffix based on patterns
  const suffix = title.includes("New") || title.includes("Store") || 
                title.includes("Shop") || title.includes("Business") ? 
                "-02" : "-04";
  
  return `https://websitedemos.net/${slug}${suffix}`;
}