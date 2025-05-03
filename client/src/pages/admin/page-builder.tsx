import React, { useState } from 'react';
import { useLocation } from 'wouter';
import PageBuilder from '@/components/PageBuilder';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PageBuilderPage() {
  const [pageTitle, setPageTitle] = useState('Untitled Page');
  const [savedContent, setSavedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [, navigate] = useLocation();

  const handleSave = async (content: string) => {
    try {
      setIsSaving(true);

      // Here you would make an API call to save the page content to the database
      // For now, we'll just update the local state
      setSavedContent(content);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExitEditor = () => {
    setIsNavigating(true);

    // Ask for confirmation if there are unsaved changes
    const hasUnsavedChanges = true; // You would need to implement actual change tracking
    if (hasUnsavedChanges) {
      const confirmExit = window.confirm('You have unsaved changes. Are you sure you want to exit?');
      if (!confirmExit) {
        setIsNavigating(false);
        return;
      }
    }

    navigate('/admin');
  };

  return (
    <AdminLayout title="Page Builder">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Page Editor</CardTitle>
          <CardDescription>Create and edit your website pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="page-title" className="block text-sm font-medium mb-1">
              Page Title
            </label>
            <Input
              id="page-title"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleExitEditor} disabled={isNavigating}>
            {isNavigating ? 'Exiting...' : 'Exit Editor'}
          </Button>
          <Button onClick={() => handleSave(savedContent)} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Page'}
          </Button>
        </CardFooter>
      </Card>
      
      <PageBuilder 
        initialContent={savedContent}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}