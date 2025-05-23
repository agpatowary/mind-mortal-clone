
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const legacyVaultSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  category: z.string().min(1, { message: "Please select at least one category" }),
  visibility: z.enum(["public", "draft"]),
  subcategory: z.enum(["public-gallery", "time-capsule"]),
  releaseDate: z.date().optional(),
});

type LegacyVaultFormValues = z.infer<typeof legacyVaultSchema>;

const LegacyVaultForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("public-gallery");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<LegacyVaultFormValues>({
    resolver: zodResolver(legacyVaultSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      visibility: "draft",
      subcategory: "public-gallery",
    },
  });

  const onSubmit = async (values: LegacyVaultFormValues) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create content.",
          variant: "destructive",
        });
        return;
      }

      // Upload media files if any
      const mediaUrls: string[] = [];
      
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('legacy_media')
            .upload(filePath, file);
            
          if (uploadError) {
            throw uploadError;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('legacy_media')
            .getPublicUrl(filePath);
            
          mediaUrls.push(publicUrl);
        }
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
        is_time_capsule: values.subcategory === "time-capsule",
      };

      // Add release_date for time capsules
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

      // Reset form
      form.reset();
      setMediaFiles([]);
      setMediaPreview([]);
    } catch (error) {
      console.error("Error creating legacy post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your legacy post.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("subcategory", value as any);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Limit to 5 files
    if (mediaFiles.length + files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 5 files per post.",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setMediaFiles(prev => [...prev, ...files]);
    setMediaPreview(prev => [...prev, ...newPreviews]);
  };
  
  const removeMedia = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreview[index]);
    
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6">Create Legacy Vault Post</h2>
      
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
            
            {/* Media Upload Section */}
            <div className="space-y-2">
              <FormLabel>Media (optional)</FormLabel>
              <div className="flex flex-wrap gap-2 mb-4">
                {mediaPreview.map((url, index) => (
                  <div 
                    key={index} 
                    className="relative w-24 h-24 bg-muted rounded-md overflow-hidden"
                  >
                    <img 
                      src={url} 
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full p-0"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {mediaFiles.length < 5 && (
                  <label className="flex items-center justify-center w-24 h-24 bg-muted rounded-md border border-dashed border-muted-foreground/50 cursor-pointer hover:bg-muted/80 transition-colors">
                    <div className="flex flex-col items-center gap-1">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Media</span>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                )}
              </div>
              {mediaFiles.length > 0 && (
                <div className="flex gap-2">
                  {mediaFiles.map((file, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {file.name.slice(0, 15)}{file.name.length > 15 ? '...' : ''}
                    </Badge>
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
                      className="min-h-[200px] resize-y" 
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
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit">
                Publish
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LegacyVaultForm;
