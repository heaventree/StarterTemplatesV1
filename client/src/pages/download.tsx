import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Template } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, ExternalLink, FileDown, FileText, FolderOpen, Loader2, Share2 } from 'lucide-react';

export default function DownloadPage() {
  const [location] = useLocation();
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [isPurchase, setIsPurchase] = useState(false);
  
  // Extract templateId from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('template');
    const purchase = params.get('purchase');
    
    if (id) {
      setTemplateId(parseInt(id, 10));
    }
    
    if (purchase === 'true') {
      setIsPurchase(true);
    }
  }, [location]);
  
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
    enabled: !!templateId,
  });
  
  // Function to go back
  const goBack = () => {
    window.history.back();
  };

  // Fake download function
  const handleDownload = () => {
    // In a real app, this would initiate the file download
    alert('Download started. Files will be downloaded as a zip archive.');
  };

  // Check if user is eligible for download (Pro template needs purchase)
  const canDownload = !template?.isPro || isPurchase;

  return (
    <div className="container max-w-3xl py-8">
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {isLoadingTemplate ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : template ? (
        <>
          {isPurchase && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800">Thank you for your purchase!</h3>
              <p className="text-sm mt-1">Your template is ready to download. You can download it anytime from your account.</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{template.title}</CardTitle>
                  <CardDescription>
                    {template.pageBuilder} Template {template.isPro && <span className="inline-block text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded">PRO</span>}
                  </CardDescription>
                </div>
                
                {template.imageUrl && (
                  <div className="shrink-0 w-20 h-20 rounded overflow-hidden border">
                    <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {canDownload ? (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Download Contents</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{template.title}</span>
                      </li>
                      <li className="flex items-center pl-6">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>HTML Files</span>
                      </li>
                      <li className="flex items-center pl-6">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>CSS Files</span>
                      </li>
                      <li className="flex items-center pl-6">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>JavaScript Files</span>
                      </li>
                      <li className="flex items-center pl-6">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Assets (images, fonts, etc.)</span>
                      </li>
                      <li className="flex items-center pl-6">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Documentation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleDownload} className="w-full">
                      <FileDown className="mr-2 h-4 w-4" />
                      Download ZIP Package
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Documentation
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(template.demoUrl || '', '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Demo
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-4 w-full">
                    <h3 className="font-medium">This is a Premium Template</h3>
                    <p className="text-sm mt-1">You need to purchase this template to download it.</p>
                  </div>
                  
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600"
                    onClick={() => window.location.href = `/checkout?template=${template.id}`}
                  >
                    Purchase Template ($49)
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex-col items-start border-t pt-4">
              <div className="w-full">
                <h3 className="text-sm font-medium mb-2">Installation Instructions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download and extract the ZIP file to your local machine. Open the index.html file in your web browser or upload the files to your web server.
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    License: {template.isPro ? 'Commercial' : 'Free for Personal Use'}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Template not found</p>
          <Button variant="secondary" onClick={() => window.location.href = '/templates'} className="mt-4">
            Browse Templates
          </Button>
        </div>
      )}
    </div>
  );
}