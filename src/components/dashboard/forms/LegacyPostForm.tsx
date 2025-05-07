
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  tags: z.string().optional(),
  visibility: z.enum(['public', 'time-capsule', 'location-based']),
  releaseDate: z.string().optional(),
});

const LegacyPostForm: React.FC = () => {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      visibility: 'public',
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would normally handle the API call to save the post
    console.log(values);
    
    toast({
      title: "Success!",
      description: "Your legacy post has been created.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of your legacy" {...field} />
              </FormControl>
              <FormDescription>
                Give your legacy a meaningful title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your story, knowledge, or memories..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This is the main content of your legacy post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter tags separated by commas (e.g., history, family, career)" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tags help others discover your legacy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public Gallery</SelectItem>
                  <SelectItem value="time-capsule">Time Capsule</SelectItem>
                  <SelectItem value="location-based">Location-Based</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Control who can see your legacy post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('visibility') === 'time-capsule' && (
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  When should this time capsule be revealed?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Save as Draft</Button>
          <Button type="submit">Publish Legacy</Button>
        </div>
      </form>
    </Form>
  );
};

export default LegacyPostForm;
