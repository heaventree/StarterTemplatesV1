// Script to extract template data from the HTML file
import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML file
fs.readFile('Templates for Elementor, Beaver Builder, Gutenberg & Brizy.html', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the HTML
  const dom = new JSDOM(data);
  const document = dom.window.document;

  // Try to find template data in the HTML
  // Let's check if there's JSON data embedded in a script tag
  const scriptTags = document.querySelectorAll('script');
  let templates = [];
  let jsonFound = false;

  // First, let's try to find template HTML elements
  const templateElements = document.querySelectorAll('.astra-sites-template');
  if (templateElements.length > 0) {
    console.log(`Found ${templateElements.length} template elements!`);
    // Extract template details from each element
    // This would depend on the HTML structure
  }

  // If no template elements found, try to extract from scripts
  if (templates.length === 0) {
    Array.from(scriptTags).forEach((script) => {
      const scriptContent = script.textContent;
      if (scriptContent) {
        // Look for patterns that might indicate template data
        const dataMatches = scriptContent.match(/var\s+sites\s*=\s*(\{.*\}|\[.*\])/s) || 
                            scriptContent.match(/var\s+astraSites\s*=\s*(\{.*\}|\[.*\])/s) ||
                            scriptContent.match(/var\s+astraTemplates\s*=\s*(\{.*\}|\[.*\])/s) ||
                            scriptContent.match(/var\s+templates\s*=\s*(\{.*\}|\[.*\])/s);
        
        if (dataMatches) {
          try {
            // Try to parse the data
            const potentialJson = dataMatches[1];
            console.log('Found potential template data in script!');
            console.log('First 200 characters:', potentialJson.substring(0, 200));
            jsonFound = true;
          } catch (e) {
            console.error('Failed to parse JSON from script:', e);
          }
        }
      }
    });
  }

  // As a fallback, manually examine the HTML structure and extract template items
  if (!jsonFound) {
    console.log('Trying to extract template items manually from HTML structure...');
    
    // Look for elements that might contain template cards
    const siteItems = document.querySelectorAll('.site-box, .template-item, .astra-sites-grid-item, [data-template-id]');
    if (siteItems.length > 0) {
      console.log(`Found ${siteItems.length} potential template items!`);
      
      // Print details of the first few items for analysis
      for (let i = 0; i < Math.min(3, siteItems.length); i++) {
        console.log(`\nTemplate Item #${i+1}:`);
        console.log(siteItems[i].outerHTML.substring(0, 500));
      }
    } else {
      console.log('No template items found with common class names');
      
      // Last resort: find any elements with image and title that might be template cards
      const potentialCards = document.querySelectorAll('div.card, div.item, div.thumbnail');
      if (potentialCards.length > 0) {
        console.log(`Found ${potentialCards.length} potential card elements`);
        // Print a sample
        console.log(potentialCards[0].outerHTML.substring(0, 500));
      } else {
        console.log('No potential card elements found');
      }
    }
  }

  // Final fallback: look for any image elements within specific sections
  if (!jsonFound) {
    const templateSection = document.querySelector('#templates, .templates-section, #website-templates');
    if (templateSection) {
      const images = templateSection.querySelectorAll('img');
      console.log(`Found ${images.length} images in what appears to be a template section`);
      
      // If we have images, try to extract image paths and titles
      if (images.length > 0) {
        const imagePaths = Array.from(images).map(img => {
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt') || '';
          const title = img.getAttribute('title') || '';
          const parent = img.closest('a');
          const link = parent ? parent.getAttribute('href') : '';
          
          return { src, alt, title, link };
        });
        
        console.log(`Extracted ${imagePaths.length} image paths with potential template data`);
        console.log('Sample image data:', imagePaths.slice(0, 3));
      }
    } else {
      console.log('No template section found');
    }
  }
});