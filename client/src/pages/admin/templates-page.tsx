import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Plus, 
  Trash2,
  Edit,
  Star,
  Search,
  ExternalLink,
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';

import { Template } from '@shared/schema';
import AdminLayout from '@/components/layouts/AdminLayout';
import { TemplateForm, TemplateFormValues } from '@/components/forms/TemplateForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const { toast } = useToast();
  
  // Fetch templates
  const { 
    data: templates, 
    isLoading,
    isError 
  } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
    enabled: true,
  });

  // Fetch categories
  const { 
    data: categories 
  } = useQuery<{ id: number, name: string }[]>({
    queryKey: ['/api/admin/categories'],
    enabled: true,
  });

  // Fetch page builders (using placeholder data until we have an API)
  const pageBuilders = [
    { id: 'elementor', name: 'Elementor' },
    { id: 'gutenberg', name: 'Gutenberg' },
    { id: 'beaver-builder', name: 'Beaver Builder' },
    { id: 'brizy', name: 'Brizy' },
  ];

  // Fetch labels
  const { 
    data: labels 
  } = useQuery<{ id: number, name: string, color: string, textColor: string }[]>({
    queryKey: ['/api/admin/labels'],
    enabled: true,
  });

  // Fetch tags
  const { 
    data: tags 
  } = useQuery<{ id: number, name: string }[]>({
    queryKey: ['/api/admin/tags'],
    enabled: true,
  });

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: async (newTemplate: TemplateFormValues) => {
      const response = await apiRequest('POST', '/api/admin/templates', newTemplate);
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: 'Template created',
        description: 'The template has been created successfully.',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create template: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update template mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TemplateFormValues }) => {
      const response = await apiRequest('PATCH', `/api/admin/templates/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update template');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: 'Template updated',
        description: 'The template has been updated successfully.',
      });
      setEditingTemplate(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update template: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: 'Template deleted',
        description: 'The template has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete template: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Feature template mutation
  const featureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const response = await apiRequest('POST', `/api/admin/templates/${id}/toggle-featured`, {});
      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: data.template.isFeatured ? 'Template featured' : 'Template unfeatured',
        description: `The template has been ${data.template.isFeatured ? 'featured' : 'unfeatured'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update featured status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Move template mutation
  const moveMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      const response = await apiRequest('POST', `/api/admin/templates/${id}/move`, { direction });
      if (!response.ok) {
        throw new Error('Failed to move template');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({
        title: 'Template moved',
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to move template: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: TemplateFormValues) => {
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Filter templates based on search query
  const filteredTemplates = templates?.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function for viewing a template
  const handleViewTemplate = (id: number) => {
    window.open(`/template/${id}`, '_blank');
  };

  // Edit template
  const handleEditTemplate = (id: number) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setEditingTemplate(template);
    }
  };

  // Delete template
  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  // Feature/unfeature template
  const handleFeatureTemplate = (id: number, featured: boolean) => {
    featureMutation.mutate({ id, featured });
  };

  // Move template up/down
  const handleMoveTemplate = (id: number, direction: 'up' | 'down') => {
    moveMutation.mutate({ id, direction });
  };

  return (
    <AdminLayout title="Templates">
      <div className="container mx-auto p-4 py-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Templates</CardTitle>
              <CardDescription>
                Manage your website templates
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Template</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new website template.
                  </DialogDescription>
                </DialogHeader>
                {categories && labels && tags && (
                  <TemplateForm
                    defaultValues={{
                      title: '',
                      demoUrl: '',
                      imageUrl: '',
                      category: '',
                      pageBuilder: '',
                      isPro: false,
                      isFeatured: false,
                      description: '',
                      metaDescription: '',
                      pillLabels: [],
                      tags: [],
                      displayOrder: 0,
                    }}
                    onSubmit={onSubmit}
                    onCancel={() => setIsAddDialogOpen(false)}
                    isSubmitting={createMutation.isPending}
                    categories={categories}
                    pageBuilders={pageBuilders}
                    labels={labels}
                    tags={tags}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Edit Template Dialog */}
            <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Template</DialogTitle>
                  <DialogDescription>
                    Update the template information.
                  </DialogDescription>
                </DialogHeader>
                {categories && labels && tags && editingTemplate && (
                  <TemplateForm
                    defaultValues={{
                      title: editingTemplate.title || '',
                      demoUrl: editingTemplate.demoUrl || '',
                      imageUrl: editingTemplate.imageUrl || '',
                      category: editingTemplate.category || '',
                      pageBuilder: editingTemplate.pageBuilder || '',
                      isPro: editingTemplate.isPro || false,
                      isFeatured: editingTemplate.isFeatured || false,
                      description: editingTemplate.description || '',
                      metaDescription: editingTemplate.metaDescription || '',
                      pillLabels: editingTemplate.pillLabels || [],
                      tags: editingTemplate.tags || [],
                      displayOrder: editingTemplate.displayOrder || 0,
                    }}
                    onSubmit={onSubmit}
                    onCancel={() => setEditingTemplate(null)}
                    isSubmitting={updateMutation.isPending}
                    isEdit={true}
                    categories={categories}
                    pageBuilders={pageBuilders}
                    labels={labels}
                    tags={tags}
                  />
                )}
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead className="w-12">Featured</TableHead>
                      <TableHead className="min-w-[200px]">Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Page Builder</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredTemplates?.length ? (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveTemplate(template.id, 'up')}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveTemplate(template.id, 'down')}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleFeatureTemplate(template.id, !!template.isFeatured)}
                              className={template.isFeatured ? "text-yellow-500" : "text-muted-foreground"}
                            >
                              <Star className="h-5 w-5" fill={template.isFeatured ? "currentColor" : "none"} />
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{template.title}</span>
                              {/* New badge can be added based on creation date */}
                              {template.createdAt && new Date(template.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit mt-1">
                                  New
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {template.category && (
                              <Badge variant="secondary">{template.category}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {template.pageBuilder && (
                              <Badge variant="outline">{template.pageBuilder}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {template.updatedAt ? (
                              format(new Date(template.updatedAt), 'MMM d, yyyy')
                            ) : (
                              <span className="text-muted-foreground">Not updated</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewTemplate(template.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {template.demoUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => template.demoUrl && window.open(template.demoUrl, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTemplate(template.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No templates found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}