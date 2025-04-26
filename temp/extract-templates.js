// Script to extract template data from the HTML file
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';

// Read the HTML file
fs.readFile('../Templates for Elementor, Beaver Builder, Gutenberg & Brizy.html', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the HTML
  const dom = new JSDOM(data);
  const document = dom.window.document;

  // Store all templates here
  let templates = [];
  let jsonFound = false;

  // Get all template cards
  const templateItems = document.querySelectorAll('.ast-sites__item');
  if (templateItems.length > 0) {
    console.log(`Found ${templateItems.length} template items!`);
    
    // Extract template details from each item
    templates = Array.from(templateItems).map((item, index) => {
      const titleElem = item.querySelector('.ast-sites__item-title');
      const imageElem = item.querySelector('img');
      const demoLinkElem = item.querySelector('a.ast-sites__item-preview-link');
      
      // Get category from data attribute or parent container
      let category = item.getAttribute('data-category') || '';
      if (!category) {
        const categoryContainer = item.closest('[data-category]');
        if (categoryContainer) {
          category = categoryContainer.getAttribute('data-category') || '';
        }
      }
      
      // Normalize category
      if (category) {
        category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      }
      
      // Determine if it's a pro template
      const isPro = item.classList.contains('ast-sites__item-premium') || 
                   item.querySelector('.ast-sites__item-badge-pro') !== null;
      
      // Get page builder from data attribute or parent container
      let pageBuilder = item.getAttribute('data-page-builder') || '';
      if (!pageBuilder) {
        const builderContainer = item.closest('[data-page-builder]');
        if (builderContainer) {
          pageBuilder = builderContainer.getAttribute('data-page-builder') || '';
        }
      }
      
      // If we still don't have a page builder, try to infer from classes or text
      if (!pageBuilder) {
        if (item.classList.contains('elementor') || item.textContent.includes('Elementor')) {
          pageBuilder = 'Elementor';
        } else if (item.classList.contains('gutenberg') || item.textContent.includes('Gutenberg')) {
          pageBuilder = 'Gutenberg';
        } else if (item.classList.contains('beaver-builder') || item.textContent.includes('Beaver')) {
          pageBuilder = 'Beaver Builder';
        } else if (item.classList.contains('brizy') || item.textContent.includes('Brizy')) {
          pageBuilder = 'Brizy';
        }
      }
      
      // Generate tags from title and category
      const title = titleElem ? titleElem.textContent.trim() : `Template ${index + 1}`;
      const tags = [category, ...title.split(' ')].filter(Boolean);
      
      // Get image URL
      let imageUrl = '';
      if (imageElem) {
        imageUrl = imageElem.getAttribute('src') || imageElem.getAttribute('data-src') || '';
        // Extract filename only to use local copies
        if (imageUrl) {
          const filename = path.basename(imageUrl);
          imageUrl = `/images/${filename}`;
        }
      }
      
      // Get demo URL
      const demoUrl = demoLinkElem ? demoLinkElem.getAttribute('href') : '';
      
      return {
        title,
        imageUrl,
        category: category || 'Uncategorized',
        tags: tags.slice(0, 5), // Take up to 5 tags
        pageBuilder: pageBuilder || 'Elementor', // Default to Elementor if unknown
        isPro: isPro,
        demoUrl: demoUrl || `https://websitedemos.net/${title.toLowerCase().replace(/\s+/g, '-')}`
      };
    });
    
    console.log(`Extracted ${templates.length} templates successfully!`);
    
    // Write the extracted templates to a file
    const outputData = `export const templateData = ${JSON.stringify(templates, null, 2)};`;
    fs.writeFile('../temp/template-data.js', outputData, (err) => {
      if (err) {
        console.error('Error writing template data:', err);
      } else {
        console.log('Template data saved to template-data.js');
        
        // Also create TypeScript version with proper types
        const tsOutput = `import { InsertTemplate } from '@shared/schema';\n\nexport const templateData: InsertTemplate[] = ${JSON.stringify(templates, null, 2)};`;
        fs.writeFile('../temp/template-data.ts', tsOutput, (err) => {
          if (err) {
            console.error('Error writing TypeScript template data:', err);
          } else {
            console.log('TypeScript template data saved to template-data.ts');
          }
        });
      }
    });
  } else {
    console.log('No template items found with .ast-sites__item class');
    
    // Try other common selector patterns
    const alternativeItems = document.querySelectorAll('.site-box, .template-item, .astra-sites-grid-item, [data-template-id], .template-card');
    if (alternativeItems.length > 0) {
      console.log(`Found ${alternativeItems.length} potential template items with alternative selectors`);
    } else {
      console.log('No potential template items found with common selectors');
    }
  }
});