import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Category } from '@shared/schema';
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
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Form schema for creating/editing categories
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  displayOrder: z.number().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  
  // Fetch categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading, 
    isError: isCategoriesError 
  } = useQuery<Category[]>({
    queryKey: ['/api/admin/categories'],
    enabled: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newCategory: CategoryFormValues) => {
      const response = await apiRequest('POST', '/api/admin/categories', newCategory);
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: 'Category created',
        description: 'The category has been created successfully.',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryFormValues }) => {
      const response = await apiRequest('PATCH', `/api/admin/categories/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: 'Category updated',
        description: 'The category has been updated successfully.',
      });
      setEditingCategory(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/categories/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: 'Category deleted',
        description: 'The category has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Move category mutation
  const moveMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      const response = await apiRequest('POST', `/api/admin/categories/${id}/move`, { direction });
      if (!response.ok) {
        throw new Error('Failed to move category');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to move category: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter categories based on search query
  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form for adding/editing categories
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      displayOrder: 0,
    },
  });

  // Reset form when opening the add dialog or changing the editing category
  const resetForm = (category?: Category) => {
    form.reset({
      name: category?.name || '',
      displayOrder: category?.displayOrder || 0,
    });
  };

  // Handle form submission
  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Open edit dialog
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    resetForm(category);
  };

  // Handle move category
  const handleMoveCategory = (id: number, direction: 'up' | 'down') => {
    moveMutation.mutate({ id, direction });
  };

  // Handle delete category
  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="container mx-auto p-4 py-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Categories</CardTitle>
              <CardDescription>
                Manage website categories for templates
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for organizing templates.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter category name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter display order" 
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
                        Save Category
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>
                    Update the category details.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter category name" />
                          </FormControl>
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
                              placeholder="Enter display order" 
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
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Category
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
                placeholder="Search categories..."
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
                      <TableHead className="min-w-[200px]">Category Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isCategoriesLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : isCategoriesError ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-destructive">
                          Error loading categories. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : filteredCategories?.length ? (
                      filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveCategory(category.id, 'up')}
                                disabled={moveMutation.isPending}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveCategory(category.id, 'down')}
                                disabled={moveMutation.isPending}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span>{category.name}</span>
                              {category.displayOrder !== null && (
                                <span className="ml-2 text-xs text-muted-foreground">(Order: {category.displayOrder})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {category.createdAt ? (
                              format(new Date(category.createdAt), 'MMM d, yyyy')
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {category.updatedAt ? (
                              format(new Date(category.updatedAt), 'MMM d, yyyy')
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(category)}
                                disabled={updateMutation.isPending}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No categories found.
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