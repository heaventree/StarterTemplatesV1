import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Template } from '@shared/schema';
import { Eye, X, Monitor, Tablet, Smartphone } from 'lucide-react';

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
        <DialogContent className="w-screen h-screen p-0 m-0 rounded-none border-0 overflow-hidden max-w-none [&>*]:rounded-none" aria-describedby="template-preview-description">
          <DialogTitle className="sr-only">Preview of {template.title}</DialogTitle>
          <div id="template-preview-description" className="sr-only">Interactive preview of the template with responsive viewing options</div>
          {/* Header with controls - now in dark mode with square corners */}
          <div className="bg-gray-900 backdrop-blur-sm border-b border-gray-800 border-t-0 rounded-none shadow-md z-50 h-12 flex items-center justify-between absolute top-0 left-0 right-0">
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
        </DialogContent>
      </Dialog>
    </>
  );
}