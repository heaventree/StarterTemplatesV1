import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Template } from '@shared/schema';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2 } from 'lucide-react';
import { 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';

// Form schema for templates
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

export type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  defaultValues: Partial<TemplateFormValues>;
  onSubmit: (values: TemplateFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  categories: { id: number, name: string }[];
  pageBuilders: { id: string, name: string }[];
  labels?: { id: number, name: string, color: string, textColor: string }[];
  tags?: { id: number, name: string }[];
}

export function TemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit = false,
  categories,
  pageBuilders,
  labels,
  tags,
}: TemplateFormProps) {
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
      ...defaultValues,
    },
  });

  return (
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
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              label="Template Image"
              description="Upload a thumbnail image for the template (recommended size: 800x600px)"
              error={form.formState.errors.imageUrl?.message}
            />
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
            <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Template' : 'Save Template'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}