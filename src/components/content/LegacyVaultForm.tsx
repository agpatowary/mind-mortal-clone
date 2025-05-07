
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
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "../editor/RichTextEditor";

const legacyVaultSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  category: z.string().min(1, { message: "Please select at least one category" }),
  visibility: z.enum(["public", "draft"]),
  subcategory: z.enum(["public-gallery", "time-capsule", "location-based"]),
  releaseDate: z.date().optional(),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string().optional(),
  }).optional(),
});

type LegacyVaultFormValues = z.infer<typeof legacyVaultSchema>;

const LegacyVaultForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("public-gallery");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<LegacyVaultFormValues>({
    resolver: zodResolver(legacyVaultSchema),
    defaultValues: {
      title: "",
      content: "<p>Share your legacy here...</p>",
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

      // Prepare data for the database
      const legacyPost = {
        title: values.title,
        content: values.content,
        categories: [values.category],
        visibility: values.visibility,
        subcategory: values.subcategory,
        user_id: user.id,
      };

      // Add subcategory-specific data
      if (values.subcategory === "time-capsule" && values.releaseDate) {
        Object.assign(legacyPost, { release_date: values.releaseDate.toISOString() });
      } else if (values.subcategory === "location-based" && values.location) {
        Object.assign(legacyPost, { location: values.location });
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

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6">Create Legacy Vault Post</h2>
      
      <Tabs defaultValue="public-gallery" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="public-gallery">Public Gallery</TabsTrigger>
          <TabsTrigger value="time-capsule">Time Capsule</TabsTrigger>
          <TabsTrigger value="location-based">Location-based</TabsTrigger>
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
            
            <TabsContent value="location-based">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., Eiffel Tower, Paris" 
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            name: e.target.value,
                          });
                        }}
                        value={field.value?.name || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
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
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Share your legacy..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
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
