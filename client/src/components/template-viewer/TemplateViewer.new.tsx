import { useState, useEffect } from 'react';
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
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<keyof typeof DEVICE_PRESETS>('desktop');

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

  // Simulate loading time
  useEffect(() => {
    if (template) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [template]);

  // Apply device dimensions to content wrapper
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
    setLocation('/templates');
  };

  // Open demo in new tab
  const handleOpenInNewTab = () => {
    if (template?.demoUrl) {
      window.open(template.demoUrl, '_blank');
    }
  };
  
  // Template preview content
  const renderTemplatePreview = () => {
    if (!template) return null;
    
    return (
      <div className="w-full h-full bg-white overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{template.title}</h1>
          
          {/* Template image */}
          <div className="aspect-video bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
            {template.imageUrl ? (
              <img 
                src={template.imageUrl} 
                alt={template.title} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500">Template Preview Image</div>
            )}
          </div>
          
          {/* Template details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Type</h3>
              <p>{template.category}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Page Builder</h3>
              <p>{template.pageBuilder}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">License</h3>
              <p>{template.isPro ? 'Premium' : 'Free'}</p>
            </div>
          </div>
          
          {/* Template description */}
          <p className="text-lg text-gray-700 mb-6">
            This template is designed for {template.category} websites and offers a professional, 
            mobile-responsive layout. Built with {template.pageBuilder} for easy customization without coding knowledge.
          </p>
          
          {/* Template tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {template.tags?.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Features section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Key Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Responsive Design</span>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>SEO Optimized</span>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Cross-browser Compatible</span>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast Loading</span>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Documentation</span>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Technical Support</span>
              </li>
            </ul>
          </div>
          
          {/* CTA section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3">Get This Template</h3>
            <p className="mb-4">
              {template.isPro 
                ? "This premium template includes advanced features and dedicated support."
                : "This free template is perfect for getting started quickly with your website project."}
            </p>
            <div className="flex gap-3">
              {template.isPro ? (
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Pro ($49)
                </Button>
              ) : (
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              )}
              <Button variant="outline" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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

      {/* Device view & content container */}
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
            
            {/* Template preview content */}
            <div className="w-full h-full border border-border shadow-md bg-white overflow-auto">
              {renderTemplatePreview()}
            </div>
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