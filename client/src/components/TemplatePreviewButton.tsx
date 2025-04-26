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
    return {
      width: device.width,
      height: device.height,
      maxWidth: '100%',
      maxHeight: deviceView === 'desktop' ? '100%' : '80vh',
      margin: '0 auto',
      transition: 'all 0.3s ease'
    };
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
        <DialogContent className="max-w-[90vw] h-[90vh] p-0 flex flex-col">
          {/* Header with controls */}
          <div className="bg-background border-b p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">{template.title}</h3>
            </div>

            {/* Device controls */}
            <div className="flex items-center space-x-2">
              <div className="bg-muted rounded-lg p-1 flex">
                <Button
                  size="sm"
                  variant={deviceView === 'desktop' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('desktop')}
                  className="rounded-md"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('tablet')}
                  className="rounded-md"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'secondary' : 'ghost'}
                  onClick={() => setDeviceView('mobile')}
                  className="rounded-md"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* iframe container */}
          <div className="flex-1 bg-muted/40 p-4 overflow-auto flex items-center justify-center">
            <div style={getDeviceStyles()}>
              <iframe
                src={template.demoUrl || ''}
                className="w-full h-full border shadow-md bg-white"
                title={`${template.title} preview`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}