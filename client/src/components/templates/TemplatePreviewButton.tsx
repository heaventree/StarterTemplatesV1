import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import TemplateViewerModal from '../template-viewer/TemplateViewerModal';

interface TemplatePreviewButtonProps {
  templateId: number;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export default function TemplatePreviewButton({ 
  templateId, 
  variant = 'outline',
  size = 'sm',
  showText = true
}: TemplatePreviewButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPreview = () => {
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={openPreview}
        title="Preview template"
      >
        <Eye className={`h-4 w-4 ${showText ? 'mr-1' : ''}`} />
        {showText && <span>Preview</span>}
      </Button>

      <TemplateViewerModal 
        templateId={templateId}
        isOpen={isModalOpen}
        onClose={closePreview}
      />
    </>
  );
}