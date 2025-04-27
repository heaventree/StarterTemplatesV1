/**
 * This file provides utility functions for working with template URLs
 * It helps map template names to their demo URLs
 * If a template's demo URL is not in the database, we can generate a fallback URL
 */

// Import comprehensive template URL map
import { TEMPLATE_URL_MAP, getWorkingTemplateUrl } from '@/utils/templateUrls';

// Common URL patterns for various template domains
const URL_PATTERNS = {
  websiteDemos: 'https://websitedemos.net/',
  astra: 'https://websitedemos.net/wp-content/uploads/',
  divi: 'https://www.elegantthemes.com/layouts/',
};

// Common suffixes for template URLs
const COMMON_SUFFIXES = ['-02', '-04', '', '/'];

// Common domains for templates
const TEMPLATE_DOMAINS = [
  'websitedemos.net',
  'elegantthemes.com',
  'wpengine.com',
  'wp-themes.com',
  'elementor.com',
  'beaverbuilder.com',
  'wpbeaverbuilder.com',
  'websitedemos.net/wp-content/uploads',
];

// Use our comprehensive URL map as the source of truth for template URLs
const KNOWN_TEMPLATES: Record<string, string> = Object.entries(TEMPLATE_URL_MAP).reduce(
  (acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, 
  {} as Record<string, string>
);

/**
 * Converts a template title to a slug format for URLs
 * e.g. "Love Nature" -> "love-nature"
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/-$/, ''); // Remove trailing hyphens
}

/**
 * Generates a list of possible template URLs for a given title
 */
export function generatePossibleUrls(title: string): string[] {
  if (!title) return [];
  
  const normalizedTitle = title.toLowerCase().trim();
  
  // Check if we have a known URL for this template
  if (KNOWN_TEMPLATES[normalizedTitle]) {
    return [KNOWN_TEMPLATES[normalizedTitle]];
  }
  
  const slug = titleToSlug(title);
  const urls: string[] = [];
  
  // Generate URL variants with different domains and suffixes
  for (const pattern of Object.values(URL_PATTERNS)) {
    for (const suffix of COMMON_SUFFIXES) {
      urls.push(`${pattern}${slug}${suffix}`);
    }
  }
  
  // Add variations with common alternatives
  urls.push(`https://websitedemos.net/${slug}-elementor`);
  urls.push(`https://websitedemos.net/${slug}-beaver`);
  urls.push(`https://websitedemos.net/${slug}-gutenberg`);
  
  return urls;
}

/**
 * Generates a template URL based on the template title
 * Uses our API proxy to avoid CORS issues and our comprehensive URL map
 */
export function getTemplateUrl(title: string, demoUrl?: string | null): string {
  // If we already have a demo URL, use it
  if (demoUrl) {
    return `/api/template-proxy?url=${encodeURIComponent(demoUrl)}`;
  }
  
  if (!title) return '';
  
  // First check if we have a direct mapping using the comprehensive URL map
  const mappedUrl = getWorkingTemplateUrl(title, '');
  if (mappedUrl) {
    return `/api/template-proxy?url=${encodeURIComponent(mappedUrl)}`;
  }
  
  // Check known templates as backup (legacy approach)
  const normalizedTitle = title.toLowerCase().trim();
  if (KNOWN_TEMPLATES[normalizedTitle]) {
    return `/api/template-proxy?url=${encodeURIComponent(KNOWN_TEMPLATES[normalizedTitle])}`;
  }
  
  // Generate slug and use pattern based on words in the title
  const slug = titleToSlug(title);
  
  // For template titles with "template" in them, try removing that
  const cleanSlug = slug.replace(/-template$/, '');
  
  // Try both patterns with the -02 suffix which is more common
  const targetUrl = `${URL_PATTERNS.websiteDemos}${cleanSlug}-02/`;
  
  // Return the URL through our proxy
  return `/api/template-proxy?url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Opens a template URL in a new tab
 * Uses direct URLs rather than the proxy for external viewing
 */
export function openTemplateInNewTab(title: string, demoUrl?: string | null): void {
  if (demoUrl) {
    window.open(demoUrl, '_blank');
    return;
  }
  
  if (!title) return;
  
  // First check if we have a direct mapping using the comprehensive URL map
  const mappedUrl = getWorkingTemplateUrl(title, '');
  if (mappedUrl) {
    window.open(mappedUrl, '_blank');
    return;
  }
  
  // Check known templates as fallback
  const normalizedTitle = title.toLowerCase().trim();
  if (KNOWN_TEMPLATES[normalizedTitle]) {
    window.open(KNOWN_TEMPLATES[normalizedTitle], '_blank');
    return;
  }
  
  const slug = titleToSlug(title);
  // For template titles with "template" in them, try removing that
  const cleanSlug = slug.replace(/-template$/, '');
  const targetUrl = `${URL_PATTERNS.websiteDemos}${cleanSlug}-02/`;
  
  window.open(targetUrl, '_blank');
}