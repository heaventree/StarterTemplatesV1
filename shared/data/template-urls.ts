/**
 * This file provides utility functions for working with template URLs
 * It helps map template names to their demo URLs
 * If a template's demo URL is not in the database, we can generate a fallback URL
 */

// Common URL patterns for websitedemos.net templates
const WEBSITE_DEMOS_PATTERN = 'https://websitedemos.net/';

// Common suffixes for template URLs
const COMMON_SUFFIXES = ['-02', '-04', ''];

/**
 * Converts a template title to a slug format for URLs
 * e.g. "Love Nature" -> "love-nature"
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Generates a template URL based on the template title
 * Uses our API proxy to avoid CORS issues
 */
export function getTemplateUrl(title: string): string {
  if (!title) return '';
  
  const slug = titleToSlug(title);
  
  // First try common pattern with websitedemos.net
  const targetUrl = `${WEBSITE_DEMOS_PATTERN}${slug}${COMMON_SUFFIXES[0]}`;
  
  // Return the URL through our proxy
  return `/api/template-proxy?url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Opens a template URL in a new tab
 * Uses direct URLs rather than the proxy for external viewing
 */
export function openTemplateInNewTab(title: string, demoUrl?: string): void {
  if (demoUrl) {
    window.open(demoUrl, '_blank');
    return;
  }
  
  if (!title) return;
  
  const slug = titleToSlug(title);
  const targetUrl = `${WEBSITE_DEMOS_PATTERN}${slug}${COMMON_SUFFIXES[0]}`;
  
  window.open(targetUrl, '_blank');
}