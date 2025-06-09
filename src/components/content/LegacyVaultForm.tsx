import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  ImagePlus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Label } from "../ui/label";

const STORAGE_KEY = "legacy_vault_form_data";

const legacyVaultSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long" }),
  category: z
    .string()
    .min(1, { message: "Please select at least one category" }),
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
  const navigate = useNavigate();

  // Load cached data from localStorage for default values:
  const cachedData =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const initialFormValues = cachedData ? JSON.parse(cachedData) : null;

  const form = useForm<LegacyVaultFormValues>({
    resolver: zodResolver(legacyVaultSchema),
    defaultValues: {
      title: initialFormValues?.title ?? "",
      content: initialFormValues?.content ?? "",
      category: initialFormValues?.category ?? "",
      visibility: initialFormValues?.visibility ?? "draft",
      subcategory: initialFormValues?.subcategory ?? "public-gallery",
      releaseDate: initialFormValues?.releaseDate
        ? new Date(initialFormValues.releaseDate)
        : undefined,
    },
  });

  // Sync local activeTab with cached data on mount
  useEffect(() => {
    if (initialFormValues?.subcategory) {
      setActiveTab(initialFormValues.subcategory);
    }
  }, [initialFormValues]);

  // Save form data + activeTab to localStorage whenever form data or tab changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const dataToCache = {
        ...value,
        releaseDate: value.releaseDate ? value.releaseDate.toISOString() : null,
        subcategory: activeTab,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToCache));
    });
    return () => subscription.unsubscribe();
  }, [form, activeTab]);

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

      // Upload media files if any (no caching for files)
      const mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()
            .toString(36)
            .substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("legacy_media").upload(filePath, file);
          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("legacy_media").getPublicUrl(filePath);
          mediaUrls.push(publicUrl);
        }
      }

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

      if (values.subcategory === "time-capsule" && values.releaseDate) {
        Object.assign(legacyPost, {
          release_date: values.releaseDate.toISOString(),
        });
      }

      const { error } = await supabase.from("legacy_posts").insert(legacyPost);

      if (error) throw error;

      toast({
        title: "Legacy post created",
        description: "Your legacy post has been created successfully.",
      });

      // Clear local storage cache on success
      localStorage.removeItem(STORAGE_KEY);

      form.reset();
      setMediaFiles([]);
      setMediaPreview([]);
      navigate("/dashboard/legacy-vault");
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
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setMediaFiles((prev) => [...prev, ...files]);
    setMediaPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreview[index]);

    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    form.reset();
    setMediaFiles([]);
    setMediaPreview([]);
    navigate("/dashboard/legacy-vault");
  };

  return (
    <div className="w-full p-6 xs:p-0 sm:p-4">
      <h2 className="text-2xl font-bold mb-6">Create Legacy Post</h2>

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
                    <Input
                      placeholder="Enter a title for your post"
                      {...field}
                    />
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
                      <span className="text-xs text-muted-foreground">
                        Add Media
                      </span>
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
                      {file.name.slice(0, 15)}
                      {file.name.length > 15 ? "..." : ""}
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
            {/* TODO: Add visibility toggle; Kept for future reference */}
            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <div className="flex items-center space-x-4">
                    <Switch
                      id="visibility"
                      checked={field.value == "public"}
                      onCheckedChange={() =>
                        field.value == "public"
                          ? field.onChange("draft")
                          : field.onChange("public")
                      }
                    />
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="visibility"
                        className="flex items-center gap-2"
                      >
                        {field.value == "public" ? (
                          <>
                            <Eye className="h-4 w-4" />
                            <span className="text-lg">Public</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" />
                            <span className="text-lg">Draft</span>
                          </>
                        )}
                      </Label>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Publish</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LegacyVaultForm;
