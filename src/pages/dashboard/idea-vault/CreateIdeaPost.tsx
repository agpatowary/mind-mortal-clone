
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContentCreationContainer from '@/components/content/ContentCreationContainer';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Textarea } from '@/components/ui/textarea';

// Create a schema for form validation
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const IdeaForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      tags: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an idea.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert tags string to array
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : [];

      const { error } = await supabase
        .from('wisdom_resources')
        .insert({
          title: values.title,
          description: values.description,
          resource_type: 'idea',
          created_by: user.id,
          tags: tagsArray,
          file_path: values.content // Using file_path for content as a workaround
        });

      if (error) throw error;

      toast({
        title: "Idea Created",
        description: "Your idea has been saved successfully.",
      });

      navigate('/dashboard/idea-vault');
    } catch (error) {
      console.error('Error creating idea:', error);
      toast({
        title: "Error",
        description: "Failed to create your idea. Please try again.",
        variant: "destructive"
      });
    }
  };

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
                <Input placeholder="Enter the title of your idea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A short description of your idea" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Content</FormLabel>
              <FormControl>
                <RichTextEditor 
                  value={field.value} 
                  onChange={field.onChange}
                  placeholder="Describe your idea in detail..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="innovation, tech, future" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/idea-vault')}>
            Cancel
          </Button>
          <Button type="submit">Save Idea</Button>
        </div>
      </form>
    </Form>
  );
};

const CreateIdeaPost = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto pb-8"
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle>Create Idea</CardTitle>
          </div>
          <CardDescription>
            Document your innovative ideas and share them with the world.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <IdeaForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateIdeaPost;
