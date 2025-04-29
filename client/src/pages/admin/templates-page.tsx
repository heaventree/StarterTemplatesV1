import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Template, InsertTemplate } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Star,
  ExternalLink,
  Eye,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Form schema for creating/editing templates
const templateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  demoUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
  imageUrl: z.string().min(2, 'Image URL is required'),
  category: z.string().optional(),
  pageBuilder: z.string().optional(),
  isPro: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  description: z.string().optional(),
  metaDescription: z.string().optional(),
  pillLabels: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

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

  // Form for adding/editing templates
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
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
    },
  });

  // Reset form when opening the add dialog or changing the editing template
  const resetForm = (template?: Template) => {
    form.reset({
      title: template?.title || '',
      demoUrl: template?.demoUrl || '',
      imageUrl: template?.imageUrl || '',
      category: template?.category || '',
      pageBuilder: template?.pageBuilder || '',
      isPro: template?.isPro || false,
      isFeatured: template?.isFeatured || false,
      description: template?.description || '',
      metaDescription: template?.metaDescription || '',
      pillLabels: template?.pillLabels || [],
      tags: template?.tags || [],
      displayOrder: template?.displayOrder || 0,
    });
  };

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
      resetForm(template);
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
                <Button onClick={() => resetForm()}>
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter template title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="demoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Demo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              The URL to the live template demo.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pageBuilder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Builder</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a page builder" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pageBuilders.map((builder) => (
                                  <SelectItem key={builder.id} value={builder.name}>
                                    {builder.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter image URL" />
                          </FormControl>
                          <FormDescription className="text-xs">
                            URL to the template's thumbnail image. Use a relative path like "/images/thumbnail.jpg" for local files.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-row space-x-4">
                      <FormField
                        control={form.control}
                        name="isPro"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Pro Template</FormLabel>
                              <FormDescription>
                                Mark this template as a premium/pro option.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Template</FormLabel>
                              <FormDescription>
                                Feature this template on the homepage.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter template description" 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter meta description for SEO" 
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Short description for SEO purposes (max 160 characters recommended).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter display order (lower numbers appear first)" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Template
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter template title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="demoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Demo URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              The URL to the live template demo.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pageBuilder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Builder</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a page builder" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pageBuilders.map((builder) => (
                                  <SelectItem key={builder.id} value={builder.name}>
                                    {builder.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter image URL" />
                          </FormControl>
                          <FormDescription className="text-xs">
                            URL to the template's thumbnail image. Use a relative path like "/images/thumbnail.jpg" for local files.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-row space-x-4">
                      <FormField
                        control={form.control}
                        name="isPro"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Pro Template</FormLabel>
                              <FormDescription>
                                Mark this template as a premium/pro option.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Template</FormLabel>
                              <FormDescription>
                                Feature this template on the homepage.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter template description" 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter meta description for SEO" 
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Short description for SEO purposes (max 160 characters recommended).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter display order (lower numbers appear first)" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setEditingTemplate(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Template
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
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