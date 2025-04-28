import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Template } from '@shared/schema';
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
  Eye
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Fetch templates
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
    enabled: true,
  });

  // Filter templates based on search query
  const filteredTemplates = templates?.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Placeholder function for viewing a template
  const handleViewTemplate = (id: number) => {
    window.open(`/template/${id}`, '_blank');
  };

  // Placeholder functions for template actions
  const handleEditTemplate = (id: number) => {
    // To be implemented
    toast({
      title: 'Edit Template',
      description: `Editing template ${id}`,
    });
  };

  const handleDeleteTemplate = (id: number) => {
    // To be implemented
    toast({
      title: 'Delete Template',
      description: `Deleting template ${id}`,
      variant: 'destructive',
    });
  };

  const handleFeatureTemplate = (id: number, featured: boolean) => {
    // To be implemented
    toast({
      title: featured ? 'Remove Featured' : 'Set as Featured',
      description: `Template ${id} ${featured ? 'removed from' : 'set as'} featured`,
    });
  };

  const handleMoveTemplate = (id: number, direction: 'up' | 'down') => {
    // To be implemented
    toast({
      title: 'Move Template',
      description: `Moving template ${id} ${direction}`,
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 py-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Templates</CardTitle>
              <CardDescription>
                Manage your website templates
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
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