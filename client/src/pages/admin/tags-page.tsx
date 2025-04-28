import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Tag } from '@shared/schema';
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
import { Badge } from '@/components/ui/badge';

// Form schema for creating/editing tags
const tagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
});

type TagFormValues = z.infer<typeof tagSchema>;

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const { toast } = useToast();
  
  // Fetch tags
  const { 
    data: tags, 
    isLoading: isTagsLoading, 
    isError: isTagsError 
  } = useQuery<Tag[]>({
    queryKey: ['/api/admin/tags'],
    enabled: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newTag: TagFormValues) => {
      const response = await apiRequest('POST', '/api/admin/tags', newTag);
      if (!response.ok) {
        throw new Error('Failed to create tag');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tags'] });
      toast({
        title: 'Tag created',
        description: 'The tag has been created successfully.',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create tag: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TagFormValues }) => {
      const response = await apiRequest('PATCH', `/api/admin/tags/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update tag');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tags'] });
      toast({
        title: 'Tag updated',
        description: 'The tag has been updated successfully.',
      });
      setEditingTag(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update tag: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/tags/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tags'] });
      toast({
        title: 'Tag deleted',
        description: 'The tag has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete tag: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter tags based on search query
  const filteredTags = tags?.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form for adding/editing tags
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when opening the add dialog or changing the editing tag
  const resetForm = (tag?: Tag) => {
    form.reset({
      name: tag?.name || '',
    });
  };

  // Handle form submission
  const onSubmit = (values: TagFormValues) => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Open edit dialog
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    resetForm(tag);
  };

  // Handle delete tag
  const handleDeleteTag = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout title="Tags">
      <div className="container mx-auto p-4 py-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Tags</CardTitle>
              <CardDescription>
                Manage tags for categorizing templates
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tag</DialogTitle>
                  <DialogDescription>
                    Create a new tag for categorizing templates.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter tag name" />
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
                        Save Tag
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tag</DialogTitle>
                  <DialogDescription>
                    Update the tag details.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter tag name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setEditingTag(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Tag
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
                placeholder="Search tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Tag Cloud */}
            <div className="mb-6 p-4 border rounded-md bg-background">
              <h3 className="text-sm font-medium mb-3">Tag Cloud</h3>
              <div className="flex flex-wrap gap-2">
                {filteredTags?.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className="px-3 py-1 text-sm cursor-pointer"
                    onClick={() => handleEdit(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {isTagsLoading && Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
                {!isTagsLoading && filteredTags?.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">No tags found.</p>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Tag Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTagsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : isTagsError ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-destructive">
                          Error loading tags. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : filteredTags?.length ? (
                      filteredTags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{tag.name}</Badge>
                          </TableCell>
                          <TableCell>
                            {tag.createdAt ? (
                              format(new Date(tag.createdAt), 'MMM d, yyyy')
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {tag.updatedAt ? (
                              format(new Date(tag.updatedAt), 'MMM d, yyyy')
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(tag)}
                                disabled={updateMutation.isPending}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTag(tag.id)}
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
                        <TableCell colSpan={4} className="h-24 text-center">
                          No tags found.
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