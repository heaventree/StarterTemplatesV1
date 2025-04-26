import { useEffect, useRef, useState } from "react";
import { Template } from "@shared/schema";

interface LocalTemplatePreviewProps {
  template: Template;
  selectedFont: string | null;
  selectedColor: { primary: string; secondary: string } | null;
}

export default function LocalTemplatePreview({
  template,
  selectedFont,
  selectedColor,
}: LocalTemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Apply styles when font or color changes or when iframe loads
    if (isLoaded && iframeRef.current) {
      applyStyles(selectedFont, selectedColor);
    }
  }, [selectedFont, selectedColor, isLoaded]);

  const applyStyles = (font: string | null, color: { primary: string; secondary: string } | null) => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;

    try {
      const doc = iframeRef.current.contentDocument;
      
      // Create or update style element
      let styleEl = doc.getElementById('custom-preview-styles');
      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.id = 'custom-preview-styles';
        doc.head.appendChild(styleEl);
      }
      
      // Build custom CSS
      let css = '';
      
      // Hide unwanted elements
      css += `
        /* Hide purchase buttons or unwanted elements */
        .showcase-cta,
        #showcase-cta,
        .ast-builder-button-wrap,
        .elementor-button-wrapper a[href*="purchase"],
        .wp-block-button a[href*="purchase"] {
          display: none !important;
        }
      `;
      
      if (font) {
        css += `
          body, h1, h2, h3, h4, h5, h6, p, button, a, input, textarea, select {
            font-family: ${font} !important;
          }
        `;
      }
      
      if (color) {
        css += `
          :root {
            --primary-color: ${color.primary} !important;
            --secondary-color: ${color.secondary} !important;
          }
          
          /* Primary buttons and CTA elements */
          .wp-block-button__link,
          button.primary,
          .button.primary,
          .wp-element-button,
          .wp-block-button .wp-block-button__link,
          .elementor-button,
          .btn-primary,
          [data-element_type="button"],
          .ast-button {
            background-color: ${color.primary} !important;
            border-color: ${color.primary} !important;
          }
          
          /* Links and accent text */
          a:not(.wp-element-button):not(.wp-block-button__link):not(.btn-primary),
          .elementor-icon,
          .elementor-heading-title,
          .has-accent-color {
            color: ${color.primary} !important;
          }
          
          /* Background elements */
          .has-background-color,
          .elementor-section[data-settings*="background_background"],
          .elementor-column[data-settings*="background_background"] {
            background-color: ${color.primary} !important;
          }
          
          /* Secondary elements */
          .has-accent-background-color {
            color: ${color.secondary} !important;
            background-color: ${color.primary} !important;
          }
        `;
      }
      
      styleEl.textContent = css;
    } catch (error) {
      console.error("Error applying styles to local template preview:", error);
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  return (
    <iframe
      ref={iframeRef}
      src="/demo-templates/index.html"
      className="w-full h-full border-0"
      style={{ backgroundColor: "white" }}
      onLoad={handleIframeLoad}
      title={`${template.title} preview`}
      sandbox="allow-same-origin allow-scripts"
    />
  );
}