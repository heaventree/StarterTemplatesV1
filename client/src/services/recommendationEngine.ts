import { Template } from "@shared/schema";

// User activity tracking
interface ViewActivity {
  templateId: number;
  timestamp: number;
  duration: number; // in seconds
}

interface UserPreferences {
  categories: string[];
  pageBuilders: string[];
  viewedTemplates: ViewActivity[];
  explicitPreferences?: {
    industry?: string;
    style?: string;
    features?: string[];
  }
}

// Initialize empty user preferences if none exist in localStorage
const initializeUserPreferences = (): UserPreferences => {
  return {
    categories: [],
    pageBuilders: [],
    viewedTemplates: [],
    explicitPreferences: {
      industry: undefined,
      style: undefined,
      features: []
    }
  };
};

// Get or create user preferences from localStorage
export const getUserPreferences = (): UserPreferences => {
  const storedPreferences = localStorage.getItem('userPreferences');
  if (storedPreferences) {
    return JSON.parse(storedPreferences);
  }
  
  const newPreferences = initializeUserPreferences();
  localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  return newPreferences;
};

// Save user preferences to localStorage
export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Track template view
export const trackTemplateView = (templateId: number): void => {
  const preferences = getUserPreferences();
  
  // Log new view
  const timestamp = Date.now();
  
  // Find if this template is already being viewed (to calculate duration)
  const existingViewIndex = preferences.viewedTemplates.findIndex(
    v => v.templateId === templateId && !v.duration
  );
  
  if (existingViewIndex >= 0) {
    // Update existing activity
    preferences.viewedTemplates[existingViewIndex].duration = 
      (timestamp - preferences.viewedTemplates[existingViewIndex].timestamp) / 1000;
  } else {
    // Add new view activity
    preferences.viewedTemplates.push({
      templateId,
      timestamp,
      duration: 0 // Will be updated when view ends
    });
  }
  
  // Keep only the last 50 activities
  if (preferences.viewedTemplates.length > 50) {
    preferences.viewedTemplates = preferences.viewedTemplates.slice(-50);
  }
  
  saveUserPreferences(preferences);
};

// End template view (and calculate duration)
export const endTemplateView = (templateId: number): void => {
  const preferences = getUserPreferences();
  const timestamp = Date.now();
  
  // Find the ongoing view activity for this template
  const existingViewIndex = preferences.viewedTemplates.findIndex(
    v => v.templateId === templateId && !v.duration
  );
  
  if (existingViewIndex >= 0) {
    // Calculate duration
    preferences.viewedTemplates[existingViewIndex].duration = 
      (timestamp - preferences.viewedTemplates[existingViewIndex].timestamp) / 1000;
    
    saveUserPreferences(preferences);
  }
};

// Update category preference
export const trackCategoryView = (category: string): void => {
  const preferences = getUserPreferences();
  
  // Add category if not already tracked
  if (!preferences.categories.includes(category)) {
    preferences.categories.push(category);
  }
  
  // Move the category to the end (most recent)
  const index = preferences.categories.indexOf(category);
  if (index !== -1) {
    preferences.categories.splice(index, 1);
    preferences.categories.push(category);
  }
  
  // Keep only the last 10 categories
  if (preferences.categories.length > 10) {
    preferences.categories = preferences.categories.slice(-10);
  }
  
  saveUserPreferences(preferences);
};

// Update page builder preference
export const trackPageBuilderView = (pageBuilder: string): void => {
  const preferences = getUserPreferences();
  
  // Add page builder if not already tracked
  if (!preferences.pageBuilders.includes(pageBuilder)) {
    preferences.pageBuilders.push(pageBuilder);
  }
  
  // Move the page builder to the end (most recent)
  const index = preferences.pageBuilders.indexOf(pageBuilder);
  if (index !== -1) {
    preferences.pageBuilders.splice(index, 1);
    preferences.pageBuilders.push(pageBuilder);
  }
  
  // Keep only the last 5 page builders
  if (preferences.pageBuilders.length > 5) {
    preferences.pageBuilders = preferences.pageBuilders.slice(-5);
  }
  
  saveUserPreferences(preferences);
};

// Set explicit user preferences
export const setExplicitPreferences = (
  industry?: string,
  style?: string,
  features?: string[]
): void => {
  const preferences = getUserPreferences();
  
  preferences.explicitPreferences = {
    ...preferences.explicitPreferences,
    ...(industry && { industry }),
    ...(style && { style }),
    ...(features && { features })
  };
  
  saveUserPreferences(preferences);
};

// Get recommended templates based on user preferences
export const getRecommendedTemplates = (
  allTemplates: Template[],
  limit: number = 6
): Template[] => {
  const preferences = getUserPreferences();
  
  // If no preferences or templates, return random templates
  if (
    (!preferences.categories.length && 
     !preferences.pageBuilders.length && 
     !preferences.viewedTemplates.length) ||
    !allTemplates.length
  ) {
    // Return random templates if no preference data
    return shuffleArray(allTemplates).slice(0, limit);
  }
  
  // Calculate a score for each template
  const scoredTemplates = allTemplates.map(template => {
    let score = 0;
    
    // 1. Explicit preferences match (highest weight)
    if (preferences.explicitPreferences) {
      if (preferences.explicitPreferences.industry && 
          template.category === preferences.explicitPreferences.industry) {
        score += 50;
      }
      
      if (preferences.explicitPreferences.style && 
          template.title.toLowerCase().includes(preferences.explicitPreferences.style.toLowerCase())) {
        score += 30;
      }
      
      if (preferences.explicitPreferences.features && preferences.explicitPreferences.features.length) {
        // Simplified feature matching using template title and tags since we don't have descriptions
        preferences.explicitPreferences.features.forEach(feature => {
          if (template.title.toLowerCase().includes(feature.toLowerCase())) {
            score += 20;
          }
          // Also check tags if available
          if (template.tags && template.tags.some(tag => 
            tag.toLowerCase().includes(feature.toLowerCase())
          )) {
            score += 15;
          }
        });
      }
    }
    
    // 2. Category matches (high weight)
    const categoryIndex = preferences.categories.indexOf(template.category);
    if (categoryIndex !== -1) {
      // More recent categories get higher score
      score += 15 + (categoryIndex * 2);
    }
    
    // 3. Page builder matches (high weight)
    const pageBuilderIndex = preferences.pageBuilders.indexOf(template.pageBuilder);
    if (pageBuilderIndex !== -1) {
      // More recent page builders get higher score
      score += 15 + (pageBuilderIndex * 3);
    }
    
    // 4. Previously viewed templates (medium weight, but avoid showing the most recent ones)
    const viewActivities = preferences.viewedTemplates.filter(v => v.templateId === template.id);
    if (viewActivities.length) {
      // Don't recommend templates viewed in the last hour
      const mostRecentView = Math.max(...viewActivities.map(v => v.timestamp));
      const hourAgo = Date.now() - (60 * 60 * 1000);
      
      if (mostRecentView < hourAgo) {
        // Viewed templates get a boost
        const totalDuration = viewActivities.reduce((sum, act) => sum + act.duration, 0);
        
        // Higher score for templates with longer view duration
        if (totalDuration > 60) { // More than a minute
          score += 25;
        } else if (totalDuration > 30) {
          score += 15;
        } else if (totalDuration > 10) {
          score += 10;
        } else {
          score += 5;
        }
      } else {
        // Penalize recently viewed templates to avoid repetition
        score -= 20;
      }
    }
    
    // Add a small random factor to prevent the same recommendations each time
    score += Math.random() * 5;
    
    return { template, score };
  });
  
  // Sort by score (descending) and take the top ones
  return scoredTemplates
    .sort((a, b) => b.score - a.score)
    .map(item => item.template)
    .slice(0, limit);
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};