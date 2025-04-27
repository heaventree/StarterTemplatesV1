import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Template } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Monitor, Smartphone, Tablet, Loader2, ExternalLink, LayoutGrid, Info, Heart, Download, ShoppingCart } from 'lucide-react';

// Device presets for responsive viewing
const DEVICE_PRESETS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tabletLandscape: { width: '1024px', height: '768px', label: 'Tablet Landscape' },
  tabletPortrait: { width: '768px', height: '1024px', label: 'Tablet Portrait' },
  mobileLandscape: { width: '480px', height: '320px', label: 'Mobile Landscape' },
  mobilePortrait: { width: '320px', height: '480px', label: 'Mobile Portrait' }
};

export default function TemplateViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<keyof typeof DEVICE_PRESETS>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch template details
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['/api/templates', parseInt(id || '0')],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) {
        throw new Error('Template not found');
      }
      return response.json() as Promise<Template>;
    },
    enabled: !!id && !isNaN(parseInt(id)),
  });

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Apply device dimensions to iframe wrapper
  const getDeviceStyles = () => {
    const device = DEVICE_PRESETS[deviceView];
    return {
      width: device.width,
      height: device.height,
      maxWidth: '100%',
      margin: '0 auto',
      transition: 'width 0.3s ease, height 0.3s ease'
    };
  };

  // Return to templates page
  const handleBack = () => {
    navigate('/templates');
  };

  // Open demo in new tab
  const handleOpenInNewTab = () => {
    if (template?.demoUrl) {
      window.open(template.demoUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Control bar */}
      <div className="bg-background border-b p-2 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          
          {template && (
            <h2 className="text-md font-medium hidden sm:block">
              {template.title}
              {template.isPro && (
                <span className="ml-2 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded">PRO</span>
              )}
            </h2>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Device view selector */}
          <div className="flex bg-muted rounded-md">
            <Button 
              variant={deviceView === 'desktop' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setDeviceView('desktop')}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button 
              variant={deviceView === 'tabletLandscape' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setDeviceView('tabletLandscape')}
              title="Tablet Landscape View"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button 
              variant={deviceView === 'tabletPortrait' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setDeviceView('tabletPortrait')}
              title="Tablet Portrait View"
            >
              <Tablet className="w-4 h-4 rotate-90" />
            </Button>
            <Button 
              variant={deviceView === 'mobileLandscape' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setDeviceView('mobileLandscape')}
              title="Mobile Landscape View"
            >
              <Smartphone className="w-4 h-4 rotate-90" />
            </Button>
            <Button 
              variant={deviceView === 'mobilePortrait' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setDeviceView('mobilePortrait')}
              title="Mobile Portrait View"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenInNewTab}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Open in new tab</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            title="Back to grid"
          >
            <LayoutGrid className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Back to grid</span>
          </Button>
        </div>
      </div>

      {/* Device view & iframe container */}
      <div className="flex-1 bg-muted/50 overflow-auto p-4 flex flex-col">
        {isLoadingTemplate ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p>Loading template...</p>
          </div>
        ) : template ? (
          <div className="relative" style={getDeviceStyles()}>
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p>Loading preview...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={template.demoUrl}
              className="w-full h-full border border-border shadow-md bg-white"
              onLoad={handleIframeLoad}
              title={`${template.title} preview`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">Template not found</p>
            <Button variant="secondary" size="sm" onClick={handleBack} className="mt-4">
              Return to templates
            </Button>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="bg-background border-t p-2 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Viewing: {template?.title || 'Loading...'}</span>
          <span>Current view: {DEVICE_PRESETS[deviceView].label}</span>
        </div>
      </div>
    </div>
  );
}