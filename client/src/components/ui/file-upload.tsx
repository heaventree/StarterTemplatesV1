import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

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
  label = 'Image',
  description,
  error,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the file
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }
      
      // Set the file path as the value
      onChange(data.filePath);
    } catch (error) {
      console.error('Upload error:', error);
      setPreviewUrl(value); // Revert to previous value
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormItem className="space-y-3">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-3">
          <div 
            className={`flex items-center justify-center border-2 border-dashed rounded-md min-h-[200px] relative cursor-pointer bg-muted/50 ${
              error ? 'border-destructive' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onClick={handleClick}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span>Uploading...</span>
              </div>
            ) : previewUrl ? (
              <div className="w-full h-full min-h-[200px] relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain w-full h-full rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-10 h-10 mb-2" />
                <span>Click to upload an image</span>
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClick}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl ? 'Change Image' : 'Upload Image'}
              </>
            )}
          </Button>
          
          {value && (
            <div className="text-xs text-muted-foreground break-all">
              Path: {value}
            </div>
          )}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}