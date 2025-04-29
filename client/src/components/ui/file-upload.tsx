import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface FileUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  error?: string;
}

export function FileUpload({
  value,
  onChange,
  label = 'Upload a file',
  description,
  error,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      const data = await response.json();
      onChange(data.filePath);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="No file selected"
              disabled={isUploading}
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label
                htmlFor="file-upload"
                className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors 
                  ${isUploading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'}`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-3 w-3" />
                    Browse
                  </>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
                className="sr-only"
                accept="image/*"
              />
            </div>
          </div>
          
          {value && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange('')}
              disabled={isUploading}
              type="button"
            >
              Clear
            </Button>
          )}
        </div>

        {value && value.startsWith('/') && !value.startsWith('http') && (
          <div className="rounded-md border overflow-hidden w-40 h-24">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
            />
          </div>
        )}
        
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {(error || uploadError) && (
          <p className="text-xs text-destructive">{error || uploadError}</p>
        )}
      </div>
    </div>
  );
}