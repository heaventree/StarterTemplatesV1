import React, { useState } from 'react';
import Editor from './Editor';
import { Button } from '@/components/ui/button';

interface PageBuilderProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ 
  initialContent = '', 
  onSave = () => {}
}) => {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = (content: string) => {
    setEditorContent(content);
    onSave(content);
  };

  return (
    <div className="page-builder-container">
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-md">
        <h2 className="text-2xl font-bold">Page Builder</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => setPreviewMode(!previewMode)}
            variant={previewMode ? "default" : "outline"}
          >
            {previewMode ? 'Back to Editor' : 'Preview'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="preview-container border rounded-md p-4 min-h-[700px]">
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </div>
      ) : (
        <div className="editor-wrapper">
          <Editor content={editorContent} onSave={handleSave} />
          <div className="mt-4">
            <Button onClick={() => onSave(editorContent)}>Save Page</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBuilder;