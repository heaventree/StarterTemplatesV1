/**
 * Reliable mapping of template URLs based on template name
 * This ensures consistent behavior for template previews
 * 
 * IMPORTANT: URLs come directly from the original site and don't follow a consistent pattern
 * Some end with -02, some with -04, etc. based on the actual live site.
 */

// Map of template names to their VERIFIED working demo URLs
// These have been extracted from the original site
export const TEMPLATE_URLS: Record<string, string> = {
  "Yoga Instructor": "https://websitedemos.net/yoga-instructor-02/",
  "Wedding": "https://websitedemos.net/wedding-02/",
  "Accountant": "https://websitedemos.net/accountant-02/",
  "Digital Agency": "https://websitedemos.net/digital-agency-02/",
  "Fashion Designer": "https://websitedemos.net/fashion-designer-02/",
  "Home Decor": "https://websitedemos.net/home-decor-02/",
  "Hair Salon": "https://websitedemos.net/hair-salon-02/",
  "Finance": "https://websitedemos.net/finance-02/",
  "Photography": "https://websitedemos.net/photography-agency-02/",
  "Carpenter": "https://websitedemos.net/carpenter-02/",
  "Gardener": "https://websitedemos.net/gardener-02/",
  "Electrician": "https://websitedemos.net/electrician-02/",
  "Charity": "https://websitedemos.net/charity-02/",
  "Tennis Club": "https://websitedemos.net/tennis-club-02/",
  "Plumber": "https://websitedemos.net/plumber-02/",
  "Investment Company": "https://websitedemos.net/investment-company-02/",
  "Mechanic": "https://websitedemos.net/mechanic-02/",
  "Restaurant": "https://websitedemos.net/restaurant-02/",
  "Coach": "https://websitedemos.net/coach-02/",
  "IT Company": "https://websitedemos.net/it-company-02/",
  "Luxury Hotel": "https://websitedemos.net/luxury-hotel-02/",
  "Architecture": "https://websitedemos.net/architecture-firm-02/",
  "Landscaper": "https://websitedemos.net/landscaper-02/",
  "Water Company": "https://websitedemos.net/water-company-02/",
  "Online Education": "https://websitedemos.net/online-education-02/",
  "Fitness": "https://websitedemos.net/fitness-02/",
  "Doctors": "https://websitedemos.net/doctors-02/",
  "Bakery": "https://websitedemos.net/bakery-shop-02/",
  "Car Rental": "https://websitedemos.net/car-rental-02/",
  "Marketing": "https://websitedemos.net/marketing-agency-02/",
  "Real Estate": "https://websitedemos.net/real-estate-02/",
  "Local Business": "https://websitedemos.net/local-business-02/",
  "Coffee Shop": "https://websitedemos.net/coffee-shop-02/",
  "Interior Design": "https://websitedemos.net/interior-design-02/",
  "Resume": "https://websitedemos.net/resume-02/",
  "Cleaning": "https://websitedemos.net/cleaning-services-02/",
  "Florist": "https://websitedemos.net/florist-02/",
  "Handyman": "https://websitedemos.net/handyman-02/",
  "IT Consultant": "https://websitedemos.net/it-consultant-02/",
  "Locksmith": "https://websitedemos.net/locksmith-02/",
  "Art Gallery": "https://websitedemos.net/art-gallery-02/",
  "Pet Care": "https://websitedemos.net/pet-care-02/",
  "Earth": "https://websitedemos.net/earth-02/",
  "Brand Store": "https://websitedemos.net/brandstore-02/",
  "Main Spa": "https://websitedemos.net/main-spa-02/",
  "Mountain": "https://websitedemos.net/mountain-02/",
  
  // Templates with -04 suffix
  "Electronic Store": "https://websitedemos.net/electronic-store-04/",
  "Movie": "https://websitedemos.net/movie-04/",
  "Watch Shop": "https://websitedemos.net/watch-shop-04/",
  "Fashion Photography": "https://websitedemos.net/fashion-photography-04/",
  "Aquarium": "https://websitedemos.net/aquarium-04/",
  "BBQ Food Truck": "https://websitedemos.net/bbq-food-truck-04/",
  
  // Templates with special URL formats
  "Love Nature": "https://websitedemos.net/love-nature-02/",
  "Adventure": "https://websitedemos.net/outdoor-adventure-02/",
  "Alexandrina": "https://websitedemos.net/alexandrina-designer-bio-02/",
  "Bike Modification": "https://websitedemos.net/bike-modification-02/",
  "Bizpulse": "https://websitedemos.net/bizpulse-02/",
};

// Map of template names to their image filenames 
export const TEMPLATE_IMAGES: Record<string, string> = {
  // Common patterns with -02 suffix
  "Love Nature": "love-nature-02.jpg",
  "Yoga Instructor": "yoga-instructor-02.jpg",
  "Wedding": "wedding-02.jpg",
  "Accountant": "accountant-02.jpg",
  "Digital Agency": "digital-agency-02.jpg",
  "Fashion Designer": "fashion-designer-02.jpg",
  "Main Spa": "main-spa-02.jpg",
  "Mountain": "mountain-02.jpg",
  "Home Decor": "home-decor-02.jpg",
  "Hair Salon": "hair-salon-02.jpg",
  "Finance": "finance-02.jpg",
  "Photography": "photography-agency-02.jpg",
  "Carpenter": "carpenter-02.jpg",
  "Gardener": "gardener-02.jpg",
  "Electrician": "electrician-02.jpg",
  "Charity": "charity-02.jpg",
  "Tennis Club": "tennis-club-02.jpg",
  "Plumber": "plumber-02.jpg",
  "Investment Company": "investment-company-02.jpg",
  "Mechanic": "mechanic-02.jpg",
  "Restaurant": "restaurant-02.jpg",
  "Coach": "coach-02.jpg",
  "IT Company": "it-company-02.jpg",
  "Luxury Hotel": "luxury-hotel-02.jpg",
  "Architecture": "architecture-firm-02.jpg",
  "Landscaper": "landscaper-02.jpg",
  "Water Company": "water-company-02.jpg",
  "Online Education": "online-education-02.jpg",
  "Fitness": "fitness-02.jpg",
  "Doctors": "doctors-02.jpg",
  "Bakery": "bakery-shop-02.jpg",
  "Car Rental": "car-rental-02.jpg",
  "Marketing": "marketing-agency-02.jpg",
  "Real Estate": "real-estate-02.jpg",
  "Local Business": "local-business-02.jpg",
  "Coffee Shop": "coffee-shop-02.jpg",
  "Adventure": "outdoor-adventure-02.jpg",
  "Interior Design": "interior-design-02.jpg",
  "Resume": "resume-02.jpg",
  "Cleaning": "cleaning-services-02.jpg",
  "Florist": "florist-02.jpg",
  "Handyman": "handyman-02.jpg",
  "IT Consultant": "it-consultant-02.jpg",
  "Locksmith": "locksmith-02.jpg",
  "Art Gallery": "art-gallery-02.jpg",
  "Pet Care": "pet-care-02.jpg",
  "Earth": "earth-02.jpg",
  "Brand Store": "brandstore-02.jpg",
  
  // Patterns with -04 suffix
  "Electronic Store": "electronic-store-04.jpg",
  "Movie": "movie-04.jpg",
  "Watch Shop": "watch-shop-04.jpg",
  "Fashion Photography": "fashion-photography-04.jpg",
  
  // Special cases with no suffix in image name
  "Aquarium": "aquarium.jpg", 
  "Alexandrina": "alexandrina-designer.jpg",
  "Bike Modification": "bike-modification.jpg",
  "Bizpulse": "bizpulse.jpg",
  "Politician": "politician-04.jpg"
};

/**
 * Get the correct image URL for a template 
 * @param title The template title
 * @returns The image path for the template
 */
export function getTemplateImageUrl(title: string): string {
  // Default fallback image
  const defaultImage = "/images/templates-cta-img-scaled.webp";
  
  if (!title) return defaultImage;
  
  // Try to find direct match
  if (TEMPLATE_IMAGES[title]) {
    return `/images/${TEMPLATE_IMAGES[title]}`;
  }
  
  // Try with normalized title (lowercase, trimmed)
  const normalizedTitle = title.trim();
  for (const [templateTitle, imagePath] of Object.entries(TEMPLATE_IMAGES)) {
    if (templateTitle.toLowerCase() === normalizedTitle.toLowerCase()) {
      return `/images/${imagePath}`;
    }
  }
  
  // Try matching without "Template" suffix
  const titleWithoutSuffix = title.replace(/\s+Template$/, '').trim();
  if (TEMPLATE_IMAGES[titleWithoutSuffix]) {
    return `/images/${TEMPLATE_IMAGES[titleWithoutSuffix]}`;
  }
  
  // If no match found, use the filename pattern based on slug
  const slug = titleToSlug(title);
  return `/images/${slug}-02.jpg`;
}

/**
 * Get template preview URL
 * @param title The template title
 * @param demoUrl Optional demo URL if already provided
 * @returns The template preview URL through our proxy
 */
export function getTemplateUrl(title: string, demoUrl?: string | null): string {
  // If we already have a demo URL, use it
  if (demoUrl) {
    return `/api/template-proxy?url=${encodeURIComponent(demoUrl)}`;
  }
  
  if (!title) return '';
  
  // Try to find direct match
  if (TEMPLATE_URLS[title]) {
    return `/api/template-proxy?url=${encodeURIComponent(TEMPLATE_URLS[title])}`;
  }
  
  // Try with normalized title (lowercase, trimmed)
  const normalizedTitle = title.trim();
  for (const [templateTitle, url] of Object.entries(TEMPLATE_URLS)) {
    if (templateTitle.toLowerCase() === normalizedTitle.toLowerCase()) {
      return `/api/template-proxy?url=${encodeURIComponent(url)}`;
    }
  }
  
  // Try matching without "Template" suffix
  const titleWithoutSuffix = title.replace(/\s+Template$/, '').trim();
  if (TEMPLATE_URLS[titleWithoutSuffix]) {
    return `/api/template-proxy?url=${encodeURIComponent(TEMPLATE_URLS[titleWithoutSuffix])}`;
  }
  
  // Try to generate a URL based on known working patterns
  const slug = titleToSlug(title);

  // Test a series of patterns in order of likelihood
  const patterns = [
    `https://websitedemos.net/${slug}-02/`,
    `https://websitedemos.net/${slug}/`,
    `https://websitedemos.net/${slug}-04/`,
    `https://websitedemos.net/${slug}`,
  ];
  
  // Use the first pattern as the fallback
  return `/api/template-proxy?url=${encodeURIComponent(patterns[0])}`;
}

/**
 * Opens a template in a new tab with direct URL (no proxy)
 */
export function openTemplateInNewTab(title: string, demoUrl?: string | null): void {
  // If we already have a demo URL, use it
  if (demoUrl) {
    window.open(demoUrl, '_blank');
    return;
  }
  
  if (!title) return;
  
  // Try to find direct match
  if (TEMPLATE_URLS[title]) {
    window.open(TEMPLATE_URLS[title], '_blank');
    return;
  }
  
  // Try with normalized title (lowercase, trimmed)
  const normalizedTitle = title.trim();
  for (const [templateTitle, url] of Object.entries(TEMPLATE_URLS)) {
    if (templateTitle.toLowerCase() === normalizedTitle.toLowerCase()) {
      window.open(url, '_blank');
      return;
    }
  }
  
  // Try matching without "Template" suffix
  const titleWithoutSuffix = title.replace(/\s+Template$/, '').trim();
  if (TEMPLATE_URLS[titleWithoutSuffix]) {
    window.open(TEMPLATE_URLS[titleWithoutSuffix], '_blank');
    return;
  }
  
  // Fallback to URL pattern based on slug
  const slug = titleToSlug(title);
  const targetUrl = `https://websitedemos.net/${slug}-02/`;
  
  window.open(targetUrl, '_blank');
}

/**
 * Convert a title to a slug
 */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}