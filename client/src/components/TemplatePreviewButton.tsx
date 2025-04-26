import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Template } from '@shared/schema';
import { Eye, X, Monitor, Tablet, Smartphone, RefreshCw, ShoppingCart } from 'lucide-react';

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
                  onClick={() => setDeviceView('desktop')}
                  className={`h-7 w-7 p-0 ${deviceView === 'desktop' ? 'bg-pink-600 hover:bg-pink-700' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Desktop view"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setDeviceView('tablet')}
                  className={`h-7 w-7 p-0 ${deviceView === 'tablet' ? 'bg-pink-600 hover:bg-pink-700' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Tablet view"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setDeviceView('mobile')}
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

          {/* iframe container - truly full screen with no gaps */}
          <div className={`w-full h-full ${deviceView !== 'desktop' ? 'pt-12 flex items-center justify-center bg-gray-800' : ''}`}>
            {deviceView === 'desktop' ? (
              <iframe
                src={template.demoUrl || ''}
                className="w-full absolute top-0 left-0 right-0 bottom-0"
                style={{ 
                  position: 'fixed',
                  top: '48px', /* Height of the header (12*4=48px) */
                  left: 0,
                  width: '100%',
                  height: 'calc(100vh - 48px)', /* Viewport height minus header height */
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  overflow: 'hidden',
                  zIndex: 1
                }}
                title={`${template.title} preview`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            ) : (
              <div style={getDeviceStyles()}>
                <iframe
                  src={template.demoUrl || ''}
                  className="w-full h-full"
                  title={`${template.title} preview`}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
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
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="border rounded p-2 h-14 flex items-center justify-center text-center hover:border-pink-500 cursor-pointer">
                        <span className="text-xl">Aa</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-gray-800 font-medium mb-3 flex justify-between">
                    Try Other Colors
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      'bg-teal-500', 'bg-gray-900', 'bg-blue-500', 
                      'bg-green-500', 'bg-red-500', 'bg-pink-500',
                      'bg-orange-500', 'bg-purple-500', 'bg-yellow-500'
                    ].map((color, i) => (
                      <div key={i} className="h-12 rounded flex cursor-pointer hover:ring-2 hover:ring-pink-500">
                        <div className={`${color} w-1/2 rounded-l`}></div>
                        <div className={`${color} bg-opacity-20 w-1/2 rounded-r`}></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Learn how to use this template
                  </Button>
                </div>
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