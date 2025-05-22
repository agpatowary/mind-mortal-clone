
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ImageIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/editor/FileUpload";

const legacyPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.string().min(1, { message: "Please select at least one category" }),
  visibility: z.enum(["public", "draft"]),
  subcategory: z.enum(["public-gallery", "time-capsule"]),
  releaseDate: z.date().optional(),
});

type LegacyPostFormValues = z.infer<typeof legacyPostSchema>;

const LegacyPostForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("public-gallery");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LegacyPostFormValues>({
    resolver: zodResolver(legacyPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      visibility: "draft",
      subcategory: "public-gallery",
    },
  });

  const onSubmit = async (values: LegacyPostFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create content.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for the database
      const legacyPost = {
        title: values.title,
        content: values.content,
        categories: [values.category],
        visibility: values.visibility,
        subcategory: values.subcategory,
        user_id: user.id,
        media_urls: mediaUrls,
      };

      // Add subcategory-specific data
      if (values.subcategory === "time-capsule" && values.releaseDate) {
        Object.assign(legacyPost, { release_date: values.releaseDate.toISOString() });
      }

      const { error } = await supabase
        .from("legacy_posts")
        .insert(legacyPost);

      if (error) throw error;

      toast({
        title: "Legacy post created",
        description: "Your legacy post has been created successfully.",
      });

      // Reset form and media
      form.reset();
      setMediaUrls([]);
    } catch (error) {
      console.error("Error creating legacy post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your legacy post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("subcategory", value as any);
  };

  const handleFileUploaded = (url: string) => {
    setMediaUrls((prev) => [...prev, url]);
  };

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full p-4">
      <Tabs defaultValue="public-gallery" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="public-gallery">Public Gallery</TabsTrigger>
          <TabsTrigger value="time-capsule">Time Capsule</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Technology, Life, Nature, Books" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <TabsContent value="time-capsule">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Media</p>
                <FileUpload 
                  onFileUploaded={handleFileUploaded}
                  accept="image/*,video/*,audio/*"
                  maxFiles={5}
                  maxSize={10}
                />
              </div>
              
              {mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted">
                        {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                          <img 
                            src={url} 
                            alt={`Uploaded media ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video 
                            src={url} 
                            controls 
                            className="w-full h-full object-cover"
                          />
                        ) : url.match(/\.(mp3|wav)$/i) ? (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <audio src={url} controls className="w-3/4" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <XIcon className="h-3 w-3" />
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
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
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
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={field.value === "public" ? "default" : "outline"}
                      onClick={() => field.onChange("public")}
                    >
                      Public
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "draft" ? "default" : "outline"}
                      onClick={() => field.onChange("draft")}
                    >
                      Draft
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  form.setValue("visibility", "draft");
                  form.handleSubmit(onSubmit)();
                }}
              >
                Save as Draft
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LegacyPostForm;
