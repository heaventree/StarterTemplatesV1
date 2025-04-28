import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Label } from '@shared/schema';
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

// Form schema for creating/editing labels
const labelSchema = z.object({
  name: z.string().min(2, 'Label name must be at least 2 characters'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
  displayOrder: z.number().optional(),
});

type LabelFormValues = z.infer<typeof labelSchema>;

export default function LabelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const { toast } = useToast();
  
  // Fetch labels
  const { 
    data: labels, 
    isLoading: isLabelsLoading, 
    isError: isLabelsError 
  } = useQuery<Label[]>({
    queryKey: ['/api/admin/labels'],
    enabled: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newLabel: LabelFormValues) => {
      const response = await apiRequest('POST', '/api/admin/labels', newLabel);
      if (!response.ok) {
        throw new Error('Failed to create label');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labels'] });
      toast({
        title: 'Label created',
        description: 'The label has been created successfully.',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create label: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LabelFormValues }) => {
      const response = await apiRequest('PATCH', `/api/admin/labels/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update label');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labels'] });
      toast({
        title: 'Label updated',
        description: 'The label has been updated successfully.',
      });
      setEditingLabel(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update label: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/labels/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete label');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labels'] });
      toast({
        title: 'Label deleted',
        description: 'The label has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete label: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Move label mutation
  const moveMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      const response = await apiRequest('POST', `/api/admin/labels/${id}/move`, { direction });
      if (!response.ok) {
        throw new Error('Failed to move label');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/labels'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to move label: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter labels based on search query
  const filteredLabels = labels?.filter(label => 
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form for adding/editing labels
  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      color: '#6366F1', // Default indigo color
      textColor: '#FFFFFF', // Default white text
      displayOrder: 0,
    },
  });

  // Reset form when opening the add dialog or changing the editing label
  const resetForm = (label?: Label) => {
    form.reset({
      name: label?.name || '',
      color: label?.color || '#6366F1',
      textColor: label?.textColor || '#FFFFFF',
      displayOrder: label?.displayOrder || 0,
    });
  };

  // Handle form submission
  const onSubmit = (values: LabelFormValues) => {
    if (editingLabel) {
      updateMutation.mutate({ id: editingLabel.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Open edit dialog
  const handleEdit = (label: Label) => {
    setEditingLabel(label);
    resetForm(label);
  };

  // Handle move label
  const handleMoveLabel = (id: number, direction: 'up' | 'down') => {
    moveMutation.mutate({ id, direction });
  };

  // Handle delete label
  const handleDeleteLabel = (id: number) => {
    if (window.confirm('Are you sure you want to delete this label? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout title="Labels">
      <div className="container mx-auto p-4 py-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Labels</CardTitle>
              <CardDescription>
                Manage pill labels displayed on template cards
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Label
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Label</DialogTitle>
                  <DialogDescription>
                    Create a new pill label for templates (e.g., Free, Pro, New).
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter label name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-12 h-8 p-1" />
                              </FormControl>
                              <Input 
                                {...field} 
                                placeholder="#RRGGBB" 
                                className="flex-1"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (!value.startsWith('#')) {
                                    value = '#' + value;
                                  }
                                  field.onChange(value);
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-12 h-8 p-1" />
                              </FormControl>
                              <Input 
                                {...field} 
                                placeholder="#RRGGBB" 
                                className="flex-1"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (!value.startsWith('#')) {
                                    value = '#' + value;
                                  }
                                  field.onChange(value);
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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

                    {/* Preview */}
                    <div className="p-4 border rounded-md bg-background">
                      <h3 className="text-sm font-medium mb-2">Preview:</h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-1 text-xs rounded-full font-medium inline-block" 
                          style={{ 
                            backgroundColor: form.watch('color') || '#6366F1',
                            color: form.watch('textColor') || '#FFFFFF'
                          }}
                        >
                          {form.watch('name') || 'Label'}
                        </span>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Label
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingLabel} onOpenChange={(open) => !open && setEditingLabel(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Label</DialogTitle>
                  <DialogDescription>
                    Update the label details.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter label name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-12 h-8 p-1" />
                              </FormControl>
                              <Input 
                                {...field} 
                                placeholder="#RRGGBB" 
                                className="flex-1"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (!value.startsWith('#')) {
                                    value = '#' + value;
                                  }
                                  field.onChange(value);
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-12 h-8 p-1" />
                              </FormControl>
                              <Input 
                                {...field} 
                                placeholder="#RRGGBB" 
                                className="flex-1"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (!value.startsWith('#')) {
                                    value = '#' + value;
                                  }
                                  field.onChange(value);
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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

                    {/* Preview */}
                    <div className="p-4 border rounded-md bg-background">
                      <h3 className="text-sm font-medium mb-2">Preview:</h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-1 text-xs rounded-full font-medium inline-block" 
                          style={{ 
                            backgroundColor: form.watch('color') || '#6366F1',
                            color: form.watch('textColor') || '#FFFFFF'
                          }}
                        >
                          {form.watch('name') || 'Label'}
                        </span>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setEditingLabel(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Label
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
                placeholder="Search labels..."
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
                      <TableHead className="min-w-[200px]">Label</TableHead>
                      <TableHead>Colors</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLabelsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : isLabelsError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-destructive">
                          Error loading labels. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : filteredLabels?.length ? (
                      filteredLabels.map((label) => (
                        <TableRow key={label.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveLabel(label.id, 'up')}
                                disabled={moveMutation.isPending}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveLabel(label.id, 'down')}
                                disabled={moveMutation.isPending}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2 py-1 text-xs rounded-full font-medium inline-block" 
                                style={{ 
                                  backgroundColor: label.color || '#6366F1',
                                  color: label.textColor || '#FFFFFF'
                                }}
                              >
                                {label.name}
                              </span>
                              <span className="text-sm">{label.name}</span>
                              {label.displayOrder !== null && (
                                <span className="ml-2 text-xs text-muted-foreground">(Order: {label.displayOrder})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: label.color }} />
                                <span>{label.color}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: label.textColor }} />
                                <span>{label.textColor}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {label.createdAt ? format(new Date(label.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {label.updatedAt ? format(new Date(label.updatedAt), 'MMM dd, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(label)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteLabel(label.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No labels found. Create a new label to get started.
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