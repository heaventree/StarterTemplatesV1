import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Template } from '@shared/schema';
import { Eye, X, Monitor, Tablet, Smartphone, RefreshCw, ShoppingCart } from 'lucide-react';
import LocalTemplatePreview from './LocalTemplatePreview';

interface TemplatePreviewButtonProps {
  template: Template;
  buttonText?: string;
  showText?: boolean;
}

// Device presets for responsive viewing
const DEVICE_PRESETS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '320px', height: '480px', label: 'Mobile' }
};

export default function TemplatePreviewButton({ 
  template, 
  buttonText = "Preview", 
  showText = true 
}: TemplatePreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<keyof typeof DEVICE_PRESETS>('desktop');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Font options available for customization
  const fontOptions = [
    { name: 'Default', value: 'inherit' },
    { name: 'Sans', value: '"DM Sans", sans-serif' },
    { name: 'Serif', value: '"Playfair Display", serif' },
    { name: 'Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Round', value: '"Varela Round", sans-serif' },
    { name: 'Modern', value: '"Montserrat", sans-serif' },
    { name: 'Classic', value: '"Merriweather", serif' },
  ];
  
  // Color options for customization
  const colorOptions = [
    { name: 'Teal', primary: '#0D9488', secondary: '#CCFBF1' },
    { name: 'Gray', primary: '#1F2937', secondary: '#F3F4F6' },
    { name: 'Blue', primary: '#2563EB', secondary: '#DBEAFE' },
    { name: 'Green', primary: '#16A34A', secondary: '#DCFCE7' },
    { name: 'Red', primary: '#DC2626', secondary: '#FEE2E2' },
    { name: 'Pink', primary: '#DB2777', secondary: '#FCE7F3' },
    { name: 'Orange', primary: '#EA580C', secondary: '#FFEDD5' },
    { name: 'Purple', primary: '#9333EA', secondary: '#F3E8FF' },
    { name: 'Yellow', primary: '#CA8A04', secondary: '#FEF9C3' },
  ];
  
  // Apply styles to the iframe
  const applyStyles = (font: string | null, color: { primary: string, secondary: string } | null) => {
    const iframes = document.querySelectorAll('iframe');
    if (!iframes.length) return;
    
    // Apply to all iframes (mobile/desktop/tablet)
    iframes.forEach(iframe => {
      try {
        if (!iframe.contentDocument || !iframe.contentWindow) return;
        
        // Create or update style element in iframe
        let styleEl = iframe.contentDocument.getElementById('custom-preview-styles');
        if (!styleEl) {
          styleEl = iframe.contentDocument.createElement('style');
          if (styleEl) {
            styleEl.id = 'custom-preview-styles';
            iframe.contentDocument.head.appendChild(styleEl);
          }
        }
        
        if (!styleEl) return;
        
        // Build custom CSS
        let css = '';
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
            [data-element_type="button"] {
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
        console.error("Error injecting styles into iframe:", error);
      }
    });
  };
  
  // Handle iframe load events
  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    // Re-apply styles when iframe loads
    if (selectedFont || selectedColor) {
      const fontValue = selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null;
      const colorValue = selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null;
      
      // Small delay to ensure iframe content is fully loaded
      setTimeout(() => {
        applyStyles(fontValue, colorValue);
      }, 500);
    }
  };

  // Apply device dimensions to iframe wrapper
  const getDeviceStyles = () => {
    const device = DEVICE_PRESETS[deviceView];
    
    if (deviceView === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0',
        transition: 'all 0.3s ease',
        border: 'none'
      };
    } else if (deviceView === 'tablet') {
      return {
        width: '768px',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100vh',
        margin: '0 auto',
        transition: 'all 0.3s ease',
        border: '8px solid #222',
        borderRadius: '12px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.1)'
      };
    } else { // mobile
      return {
        width: '375px',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100vh',
        margin: '0 auto',
        transition: 'all 0.3s ease',
        border: '8px solid #222',
        borderRadius: '12px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.1)'
      };
    }
  };

  return (
    <>
      <Button 
        className="text-white font-semibold bg-white/20 backdrop-blur-sm rounded-full py-2.5 px-6 hover:bg-white/30 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Eye className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
        {showText && buttonText}
      </Button>

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => setIsOpen(open)}
      >
        <DialogContent style={{ borderRadius: '0', border: 'none' }} className="w-screen h-screen p-0 m-0 !rounded-none !border-0 overflow-hidden max-w-none [&>*]:!rounded-none" aria-describedby="template-preview-description">
          <DialogTitle className="sr-only">Preview of {template.title}</DialogTitle>
          <div id="template-preview-description" className="sr-only">Interactive preview of the template with responsive viewing options</div>
          {/* Header with controls - completely square with no borders or rounded corners */}
          <div style={{ borderRadius: '0', borderTop: 'none' }} className="bg-gray-900 backdrop-blur-sm border-b border-gray-800 !border-t-0 !rounded-tl-0 !rounded-tr-0 !rounded-0 shadow-md z-50 h-12 flex items-center justify-between absolute top-0 left-0 right-0">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-sm md:text-base line-clamp-1 ml-6 text-white">{template.title}</h3>
            </div>

            {/* Device controls - centered more to the left */}
            <div className="flex items-center ml-auto">
              <div className="bg-gray-800/90 p-1 flex mr-[100px]">
                <Button
                  size="sm"
                  variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => {
                    setDeviceView('desktop');
                    // Re-apply any styles after a short delay for iframe to load
                    setTimeout(() => {
                      if (selectedFont || selectedColor) {
                        const fontValue = selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null;
                        const colorValue = selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null;
                        applyStyles(fontValue, colorValue);
                      }
                    }, 800);
                  }}
                  className={`h-7 w-7 p-0 ${deviceView === 'desktop' ? 'bg-pink-600 hover:bg-pink-700' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Desktop view"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => {
                    setDeviceView('tablet');
                    // Re-apply any styles after a short delay for iframe to load
                    setTimeout(() => {
                      if (selectedFont || selectedColor) {
                        const fontValue = selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null;
                        const colorValue = selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null;
                        applyStyles(fontValue, colorValue);
                      }
                    }, 800);
                  }}
                  className={`h-7 w-7 p-0 ${deviceView === 'tablet' ? 'bg-pink-600 hover:bg-pink-700' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Tablet view"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => {
                    setDeviceView('mobile');
                    // Re-apply any styles after a short delay for iframe to load
                    setTimeout(() => {
                      if (selectedFont || selectedColor) {
                        const fontValue = selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null;
                        const colorValue = selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null;
                        applyStyles(fontValue, colorValue);
                      }
                    }, 800);
                  }}
                  className={`h-7 w-7 p-0 ${deviceView === 'mobile' ? 'bg-pink-600 hover:bg-pink-700' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Mobile view"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Square close button to match design */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="h-9 w-9 bg-gray-800 hover:bg-gray-700 border-0 absolute top-1.5 right-6 text-gray-300 hover:text-white"
                title="Close preview"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Local template preview container */}
          <div className={`w-full h-full ${deviceView !== 'desktop' ? 'pt-12 flex items-center justify-center bg-gray-800' : ''}`}>
            {deviceView === 'desktop' ? (
              <div 
                className="w-full absolute" 
                style={{ 
                  position: 'fixed',
                  top: '48px', /* Height of the header (12*4=48px) */
                  left: 0,
                  width: '100%',
                  height: 'calc(100vh - 48px)', /* Viewport height minus header height */
                  overflow: 'hidden',
                  zIndex: 1
                }}
              >
                <LocalTemplatePreview 
                  template={template} 
                  selectedFont={selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null}
                  selectedColor={selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null}
                />
              </div>
            ) : (
              <div style={getDeviceStyles()}>
                <LocalTemplatePreview 
                  template={template} 
                  selectedFont={selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null}
                  selectedColor={selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null}
                />
              </div>
            )}
          </div>

          {/* Right side customizer panel - similar to the screenshot */}
          {showCustomizer && (
            <div className="fixed top-12 right-0 bottom-0 w-80 bg-white z-50 shadow-lg border-l border-gray-200 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl">{template.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setShowCustomizer(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-600 mb-6">
                  Use the template as-is or try different colors and fonts from the options below.
                </p>

                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3 flex justify-between">
                    Try Other Fonts
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700" 
                      onClick={() => {
                        setSelectedFont(null);
                        applyStyles(null, selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {fontOptions.map((font, i) => (
                      <div 
                        key={i} 
                        style={{fontFamily: font.value}}
                        className={`border rounded p-2 h-14 flex items-center justify-center text-center cursor-pointer ${selectedFont === font.name ? 'border-pink-500 ring-2 ring-pink-200' : 'hover:border-pink-500'}`}
                        onClick={() => {
                          setSelectedFont(font.name);
                          applyStyles(
                            font.value, 
                            selectedColor ? colorOptions.find(c => c.name === selectedColor) || null : null
                          );
                        }}
                      >
                        <span className="text-xl">Aa</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-gray-800 font-medium mb-3 flex justify-between">
                    Try Other Colors
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700" 
                      onClick={() => {
                        setSelectedColor(null);
                        applyStyles(
                          selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null, 
                          null
                        );
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((color, i) => (
                      <div 
                        key={i} 
                        className={`h-12 rounded flex cursor-pointer ${selectedColor === color.name ? 'ring-2 ring-pink-500' : 'hover:ring-2 hover:ring-pink-300'}`}
                        onClick={() => {
                          setSelectedColor(color.name);
                          applyStyles(
                            selectedFont ? fontOptions.find(f => f.name === selectedFont)?.value || null : null, 
                            color
                          );
                        }}
                      >
                        <div style={{backgroundColor: color.primary}} className="w-1/2 rounded-l"></div>
                        <div style={{backgroundColor: color.primary, opacity: 0.2}} className="w-1/2 rounded-r"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons removed per user request */}
              </div>
            </div>
          )}

          {/* Customize floating bar at the bottom */}
          <div style={{ borderRadius: '0' }} className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white py-3 px-4 flex justify-between items-center shadow-lg border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="font-medium">Ready to customize this template?</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="text-white bg-gray-800 hover:bg-gray-700 border border-gray-700"
                onClick={() => setIsOpen(false)}
              >
                More Details
              </Button>
              <Button 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => setShowCustomizer(!showCustomizer)}
              >
                {showCustomizer ? 'Hide Options' : 'Customize'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}