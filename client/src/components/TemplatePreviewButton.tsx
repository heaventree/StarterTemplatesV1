import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
        <DialogContent className="w-screen h-screen p-0 m-0 rounded-none border-0 overflow-hidden max-w-none">
          {/* Header with controls - now smaller and more compact */}
          <div className="bg-background/95 backdrop-blur-sm border-b shadow-sm z-50 h-12 flex items-center justify-between absolute top-0 left-0 right-0">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-sm md:text-base line-clamp-1 ml-4">{template.title}</h3>
            </div>

            {/* Device controls - centered more to the left */}
            <div className="flex items-center ml-auto">
              <div className="bg-muted/80 rounded-lg p-1 flex mr-[100px]">
                <Button
                  size="sm"
                  variant={deviceView === 'desktop' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('desktop')}
                  className="h-7 w-7 rounded-md p-0"
                  title="Desktop view"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('tablet')}
                  className="h-7 w-7 rounded-md p-0"
                  title="Tablet view"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('mobile')}
                  className="h-7 w-7 rounded-md p-0"
                  title="Mobile view"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Prominent yet subtle close button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="h-9 w-9 bg-background/70 hover:bg-background/90 border border-gray-200 rounded-full absolute top-1.5 right-3"
                title="Close preview"
              >
                <X className="h-5 w-5 text-gray-600" />
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