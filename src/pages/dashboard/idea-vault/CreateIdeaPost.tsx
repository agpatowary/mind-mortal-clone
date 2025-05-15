import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Lightbulb, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import FileUpload from '@/components/editor/FileUpload';
import { MediaItem } from '@/types';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateIdeaPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      isPublic: false,
      tags: [],
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues().tags?.includes(tagInput)) {
      const currentTags = form.getValues().tags || [];
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', currentTags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Fix the media upload handler to convert string URL to MediaItem
  const handleMediaUpload = (url: string) => {
    // Create a MediaItem from the URL
    const newMedia: MediaItem = {
      url,
      name: url.split('/').pop() || 'uploaded-file',
      size: 0,
      type: 'unknown'
    };
    setMediaItems([...mediaItems, newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...mediaItems];
    updatedMedia.splice(index, 1);
    setMediaItems(updatedMedia);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create an idea",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare media URLs array from the mediaItems
      const mediaUrls = mediaItems.map(item => item.url);
      
      // Insert into the wisdom_resources table
      const { data, error } = await supabase
        .from('wisdom_resources')
        .insert({
          title: values.title,
          description: values.description,
          content: values.content,
          resource_type: 'idea',
          is_public: values.isPublic,
          created_by: user.id,
          tags: values.tags || [],
          published_status: 'published',
          // Add media URLs to the database record
          resource_url: mediaUrls.length > 0 ? mediaUrls[0] : null, // Primary URL
          file_path: JSON.stringify(mediaItems), // Store all media items as JSON
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Idea Created",
        description: "Your idea has been successfully created.",
      });

      // Navigate back to idea vault
      navigate('/dashboard/idea-vault');
    } catch (error) {
      console.error('Error creating idea:', error);
      toast({
        title: "Error",
        description: "Failed to create idea. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardTitle>Create New Idea</CardTitle>
          </div>
          <CardDescription>
            Document your innovative ideas in the Idea Vault.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a brief description of your idea" 
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
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value} 
                        onChange={field.onChange}
                        placeholder="Explain your idea in detail..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Media Attachments</FormLabel>
                <div className="mt-2 mb-4">
                  <FileUpload onFileUploaded={handleMediaUpload} />
                </div>
                
                {mediaItems.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Attached Files:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mediaItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded-md">
                          <div className="flex items-center">
                            <span className="text-sm truncate max-w-[200px]">{item.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveMedia(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags to categorize your idea"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAddTag}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                
                {form.getValues().tags && form.getValues().tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.getValues().tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Make Public</FormLabel>
                      <CardDescription>
                        Allow others to view and interact with your idea
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/idea-vault')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Save Idea'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateIdeaPost;
