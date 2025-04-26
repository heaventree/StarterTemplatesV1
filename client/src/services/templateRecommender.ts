import { Template } from "@shared/schema";

/**
 * Simple AI recommendation function that matches user input text
 * against template properties to find the most suitable templates
 */
export function getAIRecommendedTemplates(
  templates: Template[],
  userInput: string,
  limit: number = 6
): Template[] {
  if (!userInput || !templates.length) {
    return [];
  }

  // Normalize user input
  const input = userInput.toLowerCase();
  
  // Keywords that might indicate different industries/categories
  const categoryKeywords: Record<string, string[]> = {
    "ecommerce": ["shop", "store", "sell", "product", "commerce", "retail", "business", "online store"],
    "blog": ["blog", "article", "post", "write", "content", "news"],
    "portfolio": ["portfolio", "showcase", "work", "project", "art", "design", "photography"],
    "corporate": ["business", "company", "corporate", "enterprise", "office", "professional", "service"],
    "restaurant": ["restaurant", "food", "cafe", "menu", "catering", "chef", "dining"],
    "education": ["school", "education", "learn", "course", "teach", "training", "academy", "university"],
    "health": ["health", "medical", "doctor", "clinic", "fitness", "wellness", "hospital"],
    "real-estate": ["real estate", "property", "house", "apartment", "rent", "buy", "home"],
    "travel": ["travel", "tourism", "hotel", "vacation", "trip", "tour", "booking"],
    "personal": ["personal", "resume", "cv", "biography", "individual"]
  };
  
  // Score each template based on how well it matches the user's input
  const scoredTemplates = templates.map(template => {
    let score = 0;
    
    // Check if the template title matches any part of the input
    if (template.title.toLowerCase().includes(input)) {
      score += 15;
    }
    
    // Check if any of the template tags match any part of the input
    if (template.tags) {
      template.tags.forEach(tag => {
        if (input.includes(tag.toLowerCase())) {
          score += 10;
        }
      });
    }
    
    // Check if the template category matches any part of the input
    if (input.includes(template.category.toLowerCase())) {
      score += 20;
    }
    
    // Check for industry keywords in user input
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      // If the template category matches this keyword category
      if (template.category.toLowerCase() === category.toLowerCase()) {
        // Check if any keywords for this category appear in the user input
        keywords.forEach(keyword => {
          if (input.includes(keyword.toLowerCase())) {
            score += 10;
          }
        });
      }
    });
    
    // Add a small random factor to avoid identical scores
    score += Math.random() * 2;
    
    return { template, score };
  });
  
  // Sort by score (highest first) and return top matches
  return scoredTemplates
    .sort((a, b) => b.score - a.score)
    .map(item => item.template)
    .slice(0, limit);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  templates: Template[],
  category: string,
  limit: number = 6
): Template[] {
  if (!category || !templates.length) {
    return [];
  }
  
  // Find templates that match the category (case-insensitive)
  return templates
    .filter(template => 
      template.category.toLowerCase() === category.toLowerCase() ||
      template.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
    )
    .slice(0, limit);
}