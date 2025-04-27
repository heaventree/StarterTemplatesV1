import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Template } from '@shared/schema';
import { getTemplateUrl } from '@shared/data/template-urls';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Monitor, Smartphone, Tablet, Loader2, 
  ExternalLink, X, Heart, Download, ShoppingCart, 
  Copy, Info, Share2, RotateCcw, Tag
} from 'lucide-react';

// Device presets for responsive viewing
const DEVICE_PRESETS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tabletLandscape: { width: '1024px', height: '768px', label: 'Tablet Landscape' },
  tabletPortrait: { width: '768px', height: '1024px', label: 'Tablet Portrait' },
  mobileLandscape: { width: '480px', height: '320px', label: 'Mobile Landscape' },
  mobilePortrait: { width: '320px', height: '480px', label: 'Mobile Portrait' }
};

interface TemplateViewerModalProps {
  templateId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateViewerModal({ 
  templateId, 
  isOpen, 
  onClose 
}: TemplateViewerModalProps) {
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<keyof typeof DEVICE_PRESETS>('desktop');
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch template details
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['/api/templates', templateId],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error('Template not found');
      }
      return response.json() as Promise<Template>;
    },
    enabled: !!templateId && isOpen,
  });

  // Reset loading state when modal is opened or template changes
  useEffect(() => {
    if (isOpen) {
      setIsFrameLoading(true);
      setIframeError(false);
    }
  }, [isOpen, templateId]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsFrameLoading(false);
    
    // Check if the iframe is empty or has errors
    setTimeout(() => {
      if (iframeRef.current) {
        try {
          // If we can't access iframe contents due to CORS, consider it an error
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
          if (!iframeDoc || !iframeDoc.body || iframeDoc.body.innerHTML === '') {
            setIframeError(true);
          }
        } catch (error) {
          // CORS error occurs when trying to access cross-origin iframe
          setIframeError(true);
        }
      }
    }, 1000); // Give it a second to properly load
  };
  
  // Handle iframe error
  const handleIframeError = () => {
    setIsFrameLoading(false);
    setIframeError(true);
  };

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

  // Open demo in new tab
  const handleOpenInNewTab = () => {
    if (template) {
      // Use the demoUrl from the template if available, otherwise fall back to our generated URL
      const url = template.demoUrl || getTemplateUrl(template.title);
      window.open(url, '_blank');
    }
  };

  // Mouse movement detection for floating controls
  const handleMouseMove = () => {
    setShowFloatingControls(true);
    
    // Clear existing timeout
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    // Set timeout to hide controls after 3 seconds of inactivity
    controlsTimeout.current = setTimeout(() => {
      setShowFloatingControls(false);
    }, 3000);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  // Format tags for display
  const formatTags = (tags: string[] | null) => {
    if (!tags || tags.length === 0) return '';
    return tags.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[100vw] h-[100vh] p-0 flex flex-col" onMouseMove={handleMouseMove}>
        {/* Top bar with brand and controls */}
        <div className="bg-background border-b p-2 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
            
            <div className="text-lg font-semibold">
              StartTemplates <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            
            {template && (
              <h2 className="text-md font-medium ml-4 hidden sm:flex items-center gap-2">
                {template.title}
                {template.isPro && (
                  <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded">PRO</span>
                )}
                <span className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{template.pageBuilder}</span>
              </h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Device selection controls */}
            <div className="hidden sm:flex bg-muted rounded-md">
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
                title="Tablet Landscape"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button 
                variant={deviceView === 'tabletPortrait' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('tabletPortrait')}
                title="Tablet Portrait"
              >
                <Tablet className="w-4 h-4 rotate-90" />
              </Button>
              <Button 
                variant={deviceView === 'mobileLandscape' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('mobileLandscape')}
                title="Mobile Landscape"
              >
                <Smartphone className="w-4 h-4 rotate-90" />
              </Button>
              <Button 
                variant={deviceView === 'mobilePortrait' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('mobilePortrait')}
                title="Mobile Portrait"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            {/* Template action buttons */}
            <div className="flex gap-1">
              <Button variant="outline" size="sm" title="Save to favorites">
                <Heart className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              
              {template?.isPro ? (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600"
                  onClick={() => window.location.href = `/checkout?template=${template.id}`}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Purchase Pro ($49)</span>
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => template?.id && (window.location.href = `/download?template=${template.id}`)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Download Free</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => template?.id && (window.location.href = `/subscribe?ref=${template.id}`)}
                    className="hidden sm:flex"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    <span>Get Pro Access</span>
                  </Button>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInNewTab}
                title="Open in new tab"
                className="hidden sm:flex"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                <span>Demo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area with iframe */}
        <div className="flex-1 bg-muted/50 overflow-auto p-4 flex flex-col items-center justify-center">
          {isLoadingTemplate ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p>Loading template...</p>
            </div>
          ) : template ? (
            <div className="relative" style={getDeviceStyles()}>
              {isFrameLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p>Loading preview...</p>
                </div>
              )}
              
              {iframeError ? (
                // Fallback UI when iframe fails to load
                <div className="w-full h-full flex flex-col items-center justify-center border border-border bg-white text-center p-6">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <ExternalLink className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    This template preview cannot be displayed in the embedded viewer due to website restrictions.
                  </p>
                  
                  {template.imageUrl && (
                    <div className="max-w-md mx-auto mb-6">
                      <img 
                        src={template.imageUrl} 
                        alt={template.title} 
                        className="rounded-md border border-border shadow-sm" 
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button onClick={handleOpenInNewTab} className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Open in New Tab
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Close Preview
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={template.demoUrl || getTemplateUrl(template.title)}
                  className="w-full h-full border border-border shadow-md bg-white"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={`${template.title} preview`}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )}
              
              {/* Floating controls for mobile */}
              <div 
                className={`sm:hidden fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm shadow-lg rounded-full p-1 transition-opacity duration-300 ${
                  showFloatingControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex bg-muted rounded-full p-1">
                  <Button 
                    variant={deviceView === 'desktop' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setDeviceView('desktop')}
                    title="Desktop View"
                    className="rounded-full h-8 w-8"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={deviceView === 'tabletLandscape' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setDeviceView('tabletLandscape')}
                    title="Tablet Landscape"
                    className="rounded-full h-8 w-8"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={deviceView === 'tabletPortrait' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setDeviceView('tabletPortrait')}
                    title="Tablet Portrait"
                    className="rounded-full h-8 w-8"
                  >
                    <Tablet className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button 
                    variant={deviceView === 'mobileLandscape' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setDeviceView('mobileLandscape')}
                    title="Mobile Landscape"
                    className="rounded-full h-8 w-8"
                  >
                    <Smartphone className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button 
                    variant={deviceView === 'mobilePortrait' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setDeviceView('mobilePortrait')}
                    title="Mobile Portrait"
                    className="rounded-full h-8 w-8"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleOpenInNewTab}
                    title="Open in new tab"
                    className="rounded-full h-8 w-8"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground">Template not found</p>
              <Button variant="secondary" size="sm" onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Template details footer */}
        {template && (
          <div className="bg-background border-t p-3 text-sm">
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-semibold">{template.title}</h3>
                <div className="flex flex-wrap gap-1 items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" /> 
                    <span>{formatTags(template.tags)}</span>
                  </div>
                  <span className="mx-1">•</span>
                  <span>Category: {template.category}</span>
                  <span className="mx-1">•</span>
                  <span>Builder: {template.pageBuilder}</span>
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Copy className="w-4 h-4 mr-1" /> Copy URL
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Info className="w-4 h-4 mr-1" /> Details
                </Button>
                {deviceView !== 'desktop' && (
                  <Button variant="ghost" size="sm" onClick={() => setDeviceView('desktop')}>
                    <RotateCcw className="w-4 h-4 mr-1" /> Reset View
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}