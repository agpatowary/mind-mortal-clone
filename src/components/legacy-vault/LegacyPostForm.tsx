
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ImageUploader from '@/components/editor/ImageUploader';
import { FormDescription } from "@/components/ui/form";
import { X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  isPublic: z.boolean().default(false),
  isTimeCapsule: z.boolean().default(false),
  releaseDate: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const LegacyPostForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('public-gallery');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      isPublic: true,
      isTimeCapsule: false,
      releaseDate: null,
    },
  });

  const onImageUploaded = (url: string) => {
    setMediaFiles(prev => [...prev, url]);
  };

  const removeMedia = (url: string) => {
    setMediaFiles(prev => prev.filter(item => item !== url));
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a legacy post',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Determine post category based on active tab
      const isTimeCapsule = activeTab === 'time-capsule';
      
      // Prepare release status and date if it's a time capsule
      let releaseStatus = 'unpublished';
      if (isTimeCapsule && values.releaseDate) {
        releaseStatus = 'scheduled';
      }

      const { data, error } = await supabase
        .from('legacy_posts')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          title: values.title,
          content: values.content,
          is_public: values.isPublic,
          is_time_capsule: isTimeCapsule,
          release_date: isTimeCapsule ? values.releaseDate : null,
          release_status: releaseStatus,
          media_urls: mediaFiles,
          media_type: mediaFiles.length > 0 ? 'image' : null,
          visibility: values.isPublic ? 'public' : 'private',
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Legacy post created!',
        description: isTimeCapsule 
          ? 'Your time capsule has been scheduled' 
          : 'Your legacy post has been created',
      });

      navigate('/dashboard/legacy-vault');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error creating post',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="public-gallery">Public Gallery</TabsTrigger>
            <TabsTrigger value="time-capsule">Time Capsule</TabsTrigger>
          </TabsList>

          <TabsContent value="public-gallery" className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give your legacy post a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Media</Label>
                <ImageUploader onImageUploaded={onImageUploaded} />
                
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {mediaFiles.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Uploaded media ${index}`} 
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMedia(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your legacy..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Post</FormLabel>
                      <FormDescription>
                        Make this post visible to others in the public gallery
                      </FormDescription>
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
            </div>
          </TabsContent>

          <TabsContent value="time-capsule" className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give your time capsule a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Media</Label>
                <ImageUploader onImageUploaded={onImageUploaded} />
                
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {mediaFiles.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Uploaded media ${index}`} 
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMedia(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your thoughts for the future..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      When should this time capsule be revealed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Post</FormLabel>
                      <FormDescription>
                        Make this time capsule visible to others when revealed
                      </FormDescription>
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/legacy-vault')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LegacyPostForm;
