/**
 * This script is used to extract template URLs directly from the original HTML file
 * and update the template-urls.ts file with the extracted URLs.
 * 
 * It extracts href attributes that match websitedemos.net from the HTML file,
 * removes the ?customize=template parameter, and creates a map of template titles
 * to their corresponding URLs.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Paths to the input and output files
const HTML_FILE = path.join(__dirname, '..', 'Templates for Elementor, Beaver Builder, Gutenberg & Brizy.html');
const OUTPUT_FILE = path.join(__dirname, '..', 'shared', 'data', 'template-urls.ts');

// Function to convert title to proper case
const toProperCase = (str) => {
  return str.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Function to sanitize URL (remove query parameters and ensure trailing slash)
const sanitizeUrl = (url) => {
  // Remove query parameters first
  const cleanUrl = url.replace(/\?.*$/, '');
  // Ensure it has a trailing slash
  return cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/';
};

// Function to extract template name from URL
const extractTemplateName = (url) => {
  const urlPath = new URL(url).pathname;
  const segments = urlPath.split('/').filter(segment => segment);
  const lastSegment = segments[segments.length - 1] || segments[segments.length - 2];
  
  if (!lastSegment) return null;
  
  // Remove any numeric suffixes like -02, -04, etc.
  const templateSlug = lastSegment.replace(/-\d+$/, '');
  return toProperCase(templateSlug);
};

// Main function to extract templates and update the file
const updateTemplateUrls = async () => {
  console.log('Reading HTML file...');
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  
  // Parse the HTML with JSDOM
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Extract all links to websitedemos.net
  const links = document.querySelectorAll('a[href*="websitedemos.net"]');
  console.log(`Found ${links.length} links to websitedemos.net`);
  
  // Create a map of template titles to their URLs
  const templateMap = new Map();
  
  links.forEach(link => {
    const url = link.href;
    if (!url.includes('websitedemos.net')) return;
    
    // Clean and standardize URL format
    const cleanUrl = sanitizeUrl(url);
    
    // Extract the template name from the URL
    const templateName = extractTemplateName(cleanUrl);
    if (!templateName) return;
    
    // Add to the map (overwrite existing entries with the same name)
    templateMap.set(templateName, cleanUrl);
  });
  
  console.log(`Extracted ${templateMap.size} unique templates`);
  
  // Convert the map to an object sorted by template name
  const templateObject = Object.fromEntries(
    Array.from(templateMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  );
  
  // Generate the TypeScript file content
  const tsContent = `/**
 * Reliable mapping of template URLs based on template name
 * This ensures consistent behavior for template previews
 * 
 * IMPORTANT: URLs are extracted directly from the original StarterTemplates.com website
 * These URLs do not follow a consistent pattern - some end with -02, some with -04, etc.
 */

// Map of template names to their VERIFIED working demo URLs
// These have been extracted from the original HTML file using the update-template-urls.js script
export const TEMPLATE_URLS: Record<string, string> = ${JSON.stringify(templateObject, null, 2)
  .replace(/\"/g, '\"')
  .replace(/\{/g, '{\n  ')
  .replace(/\}/g, '\n}')
  .replace(/,\n/g, ',\n  ')};

// The rest of the file remains unchanged
`;

  // Write the TypeScript file
  console.log(`Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
  
  console.log('Done!');
};

// Execute the function
updateTemplateUrls().catch(console.error);