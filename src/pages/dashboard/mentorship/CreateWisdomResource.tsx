import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileCheck, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "create_wisdom_resource_form";

const CreateWisdomResource = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Controlled form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          if (data.title) setTitle(data.title);
          if (data.category) setCategory(data.category);
          if (data.description) setDescription(data.description);
          if (data.experience) setExperience(data.experience);
          if (typeof data.isPublic === "boolean") setIsPublic(data.isPublic);
        } catch (e) {
          console.warn("Failed to parse cached wisdom resource form data", e);
        }
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    const dataToCache = {
      title,
      category,
      description,
      experience,
      isPublic,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToCache));
  }, [title, category, description, experience, isPublic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create a resource.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !category.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("wisdom_resources").insert({
        title: title.trim(),
        resource_type: category.trim(),
        description: description.trim() || null,
        created_by: user.id,
        is_public: isPublic,
        published_status: "draft", // you can adjust this as needed
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        experience: experience.trim() || null, // optional field, adjust DB if needed
      });

      if (error) throw error;

      toast({
        title: "Resource Created",
        description: "Your wisdom resource has been created successfully.",
      });

      // Clear cached data after success
      localStorage.removeItem(STORAGE_KEY);

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setExperience("");
      setIsPublic(true);

      navigate("/dashboard/mentorship");
    } catch (error) {
      console.error("Error inserting wisdom resource:", error);
      toast({
        title: "Failed to create resource",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/mentorship")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Mentorship Resource</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your resource"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="E.g., Technology, Business, Arts"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this mentorship resource is about"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Your Experience</Label>
              <Textarea
                id="experience"
                placeholder="Share your experience in this area"
                rows={4}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* TODO: Add visibility toggle; Kept for future reference */}
            {/* <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    disabled={isSubmitting}
                    className="form-radio"
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    disabled={isSubmitting}
                    className="form-radio"
                  />
                  <span>Private</span>
                </label>
              </div>
            </div> */}

            <div className="flex items-center space-x-4">
              <Switch
                id="visibility"
                checked={isPublic}
                onCheckedChange={() => setIsPublic(!isPublic)}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="visibility" className="flex items-center gap-2">
                  {isPublic ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="text-lg">Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="text-lg">Private</span>
                    </>
                  )}
                </Label>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/mentorship")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FileCheck className="mr-2 h-4 w-4 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Resource
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWisdomResource;
