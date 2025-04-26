import { useQuery } from '@tanstack/react-query';
import { Template } from '@shared/schema';
import TemplateCard from '@/components/TemplateCard';
import { getRecommendedTemplates } from '@/services/recommendationEngine';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function RecommendedTemplates() {
  const [recommendations, setRecommendations] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all templates
  const { data: templates = [], isLoading, error } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  // Generate recommendations whenever templates load
  useEffect(() => {
    if (templates && templates.length > 0) {
      // Get recommendations
      const recommendedTemplates = getRecommendedTemplates(templates, 8);
      setRecommendations(recommendedTemplates);
      setIsLoaded(true);
    }
  }, [templates]);

  // Don't show component until we have enough data
  if (!isLoaded || !recommendations.length) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
          Recommended For You
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}