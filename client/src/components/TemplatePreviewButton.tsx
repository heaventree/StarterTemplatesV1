import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Template } from '@shared/schema';
import { Eye, X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { trackTemplateView, endTemplateView, trackCategoryView, trackPageBuilderView } from '@/services/recommendationEngine';

interface TemplatePreviewButtonProps {
  template: Template;
  buttonText?: string;
  showText?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  showText = true,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange
}: TemplatePreviewButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<keyof typeof DEVICE_PRESETS>('desktop');
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  
  // Track template viewing for recommendation engine
  useEffect(() => {
    if (isOpen && template) {
      // Start tracking when template preview opens
      trackTemplateView(template.id);
      
      // Track category and page builder preferences
      if (template.category) {
        trackCategoryView(template.category);
      }
      if (template.pageBuilder) {
        trackPageBuilderView(template.pageBuilder);
      }
      
      // End tracking when preview closes or component unmounts
      return () => {
        endTemplateView(template.id);
      };
    }
  }, [isOpen, template]);

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

          {/* Direct iframe embed to the demo URL with loading state */}
          <div className={`w-full h-full ${deviceView !== 'desktop' ? 'pt-12 flex items-center justify-center bg-gray-800' : ''}`}>
            {deviceView === 'desktop' ? (
              <div className="fixed top-[48px] left-0 w-full h-[calc(100vh-48px)]">
                {/* Show warning if template doesn't have a demo URL */}
                {!template.demoUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
                    <div className="max-w-2xl text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Preview Unavailable</h2>
                      <p className="text-gray-600 mb-6">
                        A live preview is not available for this template. Please use the "More Info" button below to see 
                        details about this template.
                      </p>
                      <Button 
                        onClick={() => setShowInfoModal(true)}
                        className="bg-gradient-to-r from-[#dd4f93] to-[#8c21a1] hover:from-[#8c21a1] hover:to-[#dd4f93] text-white"
                      >
                        Template Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Loading indicator */}
                    <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center transition-opacity duration-500" 
                         style={{ opacity: 1 }}>
                      <div className="w-10 h-10 border-4 border-[#dd4f93] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Loading template preview...</p>
                    </div>
                    
                    {/* Subtle info bar - visible but less prominent */}
                    <div className="absolute top-0 left-0 right-0 bg-blue-50/80 text-blue-800 px-4 py-1 text-xs z-20 flex items-center border-b border-blue-100/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500/70" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Viewing template preview</span>
                    </div>
                    
                    {/* Actual iframe with proxy */}
                    <iframe
                      src={`/template-proxy?url=${encodeURIComponent(template.demoUrl)}`}
                      className="w-full h-full border-0"
                      title={`${template.title} preview`}
                      onLoad={(e) => {
                        // Hide loading indicator when iframe loads
                        try {
                          // Safely navigate to the loading element, accounting for the parent structure
                          const iframeParent = e.currentTarget.parentElement;
                          if (iframeParent && iframeParent.previousSibling) {
                            const loadingEl = iframeParent.previousSibling as HTMLElement;
                            loadingEl.style.opacity = '0';
                            setTimeout(() => {
                              loadingEl.style.display = 'none';
                            }, 500);
                          }
                        } catch (err) {
                          console.log('Could not find loading element to hide');
                        }
                      }}
                    />
                  </>
                )}
              </div>
            ) : (
              <div style={getDeviceStyles()} className="bg-white overflow-hidden">
                {!template.demoUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-sm font-medium mb-1">Preview Unavailable</h3>
                    <p className="text-xs text-gray-600">Details in "More Info"</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-0 right-0 bg-blue-50/80 text-blue-800 px-4 py-1 text-xs z-20 flex items-center border-b border-blue-100/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500/70" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Viewing template preview</span>
                    </div>
                    <iframe
                      src={`/template-proxy?url=${encodeURIComponent(template.demoUrl)}`}
                      className="w-full h-full border-0 pt-8"
                      title={`${template.title} preview - ${DEVICE_PRESETS[deviceView].label}`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom info bar */}
          <div style={{ borderRadius: '0' }} className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white py-3 px-4 flex justify-between items-center shadow-lg border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="font-medium">{template.title}</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="text-white bg-gray-800 hover:bg-gray-700 border border-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Close Preview
              </Button>
              <Button 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => setShowInfoModal(true)}
              >
                More Info
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Modal */}
      <Dialog 
        open={showInfoModal} 
        onOpenChange={(open) => setShowInfoModal(open)}
      >
        <DialogContent className="max-w-lg" aria-describedby="template-info-description">
          <div id="template-info-description" className="sr-only">
            Detailed information about the {template.title} template including features, compatibility, and specifications.
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {template.title} Details
          </DialogTitle>
          
          <div className="space-y-4 text-gray-700">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white">
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/>
                      <path d="M13 4.06189C12.6724 4.02104 12.3387 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 11.6613 19.979 11.3276 19.9381 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10Z" fill="white"/>
                      <path d="M15 12H20M20 12L18 10M20 12L18 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Template Compatibility:</h3>
                  <p className="text-sm mt-1">Works with {template.pageBuilder} version {template.pageBuilder === 'Elementor' ? '3.5+' : '6.0+'} and WordPress 6.0+</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                <p>{template.category}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">License</h3>
                <p>{template.isPro ? 'Premium (Single Use)' : 'Free'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Key Features:</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
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
                  <span>6 Months Support</span>
                </li>
              </ul>
            </div>
            
            {/* CORS warnings removed as requested */}
            
            <div className="flex flex-wrap gap-2">
              {template.tags?.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowInfoModal(false)}
              className="mr-2"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowInfoModal(false);
                setIsOpen(false);
              }}
              className="bg-gradient-to-r from-[#dd4f93] to-[#8c21a1] hover:from-[#8c21a1] hover:to-[#dd4f93]"
            >
              Back to Templates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}