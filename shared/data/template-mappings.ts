/**
 * Auto-generated template URL and image mappings from the original HTML
 */

export const TEMPLATE_URL_MAP: Record<string, string> = {

};

export const TEMPLATE_IMAGE_MAP: Record<string, string> = {

};

/**
 * Get a working URL for a template
 */
export function getWorkingTemplateUrl(title: string, fallbackUrl: string): string {
  const cleanTitle = title.replace(/\s+Template$/, '').trim();
  return TEMPLATE_URL_MAP[cleanTitle] || fallbackUrl;
}

/**
 * Get the correct image path for a template
 */
export function getTemplateImagePath(title: string, fallbackImage: string): string {
  const cleanTitle = title.replace(/\s+Template$/, '').trim();
  return TEMPLATE_IMAGE_MAP[cleanTitle] || fallbackImage;
}
