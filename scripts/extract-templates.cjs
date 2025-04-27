const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Read the original HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, '../wpdemos html/index.html'), 'utf8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Array to store extracted template data
const templates = [];

// Extract template items from the grid
const templateItems = document.querySelectorAll('.ast-col-sm-6');
templateItems.forEach((item, index) => {
  try {
    // Get image URL
    const imageElement = item.querySelector('img');
    const imageUrl = imageElement ? imageElement.getAttribute('src') : null;
    
    // Get template title
    const titleElement = item.querySelector('.elementor-image-box-title');
    const title = titleElement ? titleElement.textContent.trim() : `Template ${index + 1}`;
    
    // Get demo URL
    const demoLinkElement = item.querySelector('a.elementor-button-link');
    const demoUrl = demoLinkElement ? demoLinkElement.getAttribute('href') : null;
    
    // Create the template object
    const template = {
      title,
      imageUrl,
      demoUrl,
      // Set some defaults since we don't have this data explicitly
      category: 'Website',
      pageBuilder: 'Elementor',
      isPro: false,
      tags: ['Website', 'Elementor']
    };
    
    templates.push(template);
  } catch (error) {
    console.error(`Error processing template ${index}:`, error);
  }
});

// Clean up the image URLs - store the actual filename not the full path
const cleanedTemplates = templates.map(template => {
  if (template.imageUrl) {
    // Extract just the filename from the URL
    const filename = template.imageUrl.split('/').pop();
    // Set the path to our images directory
    template.imageUrl = `/images/${filename}`;
  }
  return template;
});

// Create directory if it doesn't exist
const dataDir = path.join(__dirname, '../shared/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Output the data as JSON to a file
fs.writeFileSync(
  path.join(dataDir, 'extracted-templates.json'),
  JSON.stringify(cleanedTemplates, null, 2),
  'utf8'
);

// Create a TypeScript file with template mappings
const templateUrlMapEntries = cleanedTemplates
  .filter(t => t.title && t.demoUrl)
  .map(t => `  "${t.title}": "${t.demoUrl}",`)
  .join('\n');

const templateImageMapEntries = cleanedTemplates
  .filter(t => t.title && t.imageUrl)
  .map(t => `  "${t.title}": "${t.imageUrl}",`)
  .join('\n');

const tsContent = `/**
 * Auto-generated template URL and image mappings from the original HTML
 */

export const TEMPLATE_URL_MAP: Record<string, string> = {
${templateUrlMapEntries}
};

export const TEMPLATE_IMAGE_MAP: Record<string, string> = {
${templateImageMapEntries}
};

/**
 * Get a working URL for a template
 */
export function getWorkingTemplateUrl(title: string, fallbackUrl: string): string {
  const cleanTitle = title.replace(/\\s+Template$/, '').trim();
  return TEMPLATE_URL_MAP[cleanTitle] || fallbackUrl;
}

/**
 * Get the correct image path for a template
 */
export function getTemplateImagePath(title: string, fallbackImage: string): string {
  const cleanTitle = title.replace(/\\s+Template$/, '').trim();
  return TEMPLATE_IMAGE_MAP[cleanTitle] || fallbackImage;
}
`;

fs.writeFileSync(
  path.join(dataDir, 'template-mappings.ts'),
  tsContent,
  'utf8'
);

console.log(`Extracted ${templates.length} templates`);
console.log('Data saved to shared/data/extracted-templates.json');
console.log('TypeScript mappings saved to shared/data/template-mappings.ts');