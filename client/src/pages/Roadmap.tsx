import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Roadmap() {
  const [roadmapContent, setRoadmapContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const response = await fetch('/CMS_Roadmap.md');
        const text = await response.text();
        setRoadmapContent(text);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoadmap();
  }, []);

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (markdown: string) => {
    // Process headings
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')
      
      // Process lists
      .replace(/^\- \[ \] (.*$)/gm, '<li class="flex items-start mb-2"><input type="checkbox" disabled class="mt-1 mr-2" /><span>$1</span></li>')
      .replace(/^\- \[x\] (.*$)/gm, '<li class="flex items-start mb-2"><input type="checkbox" checked disabled class="mt-1 mr-2" /><span>$1</span></li>')
      .replace(/^\- (.*$)/gm, '<li class="list-disc ml-5 mb-2">$1</li>')
      
      // Process paragraphs
      .replace(/^(?!<h|<li|<ul|<p)(.*$)/gm, function(match) {
        return match.trim() ? '<p class="mb-4">' + match + '</p>' : '';
      })
      
      // Wrap lists in ul tags
      .replace(
        /(<li class="list-disc.*<\/li>)\n(?!<li class="list-disc)/gs, 
        '<ul class="mb-4">$1</ul>'
      )
      .replace(
        /(<li class="flex.*<\/li>)\n(?!<li class="flex)/gs, 
        '<ul class="mb-4 list-none">$1</ul>'
      );
    
    return html;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded mb-8 w-4/6"></div>
                
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-4/5"></div>
              </div>
            ) : (
              <div 
                className="prose max-w-none prose-headings:font-lexend prose-h1:text-gray-800 prose-h2:text-gray-700 prose-h3:text-gray-600"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(roadmapContent) }}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}