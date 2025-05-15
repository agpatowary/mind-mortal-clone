
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ContentCreationContainer from '@/components/content/ContentCreationContainer';
import { Badge } from '@/components/ui/badge';
import { XCircle, PlusCircle, Lightbulb, Eye, EyeOff } from 'lucide-react';

interface IdeaFormState {
  title: string;
  description: string;
  content: string;
  tags: string[];
  isPublic: boolean;
}

const CreateIdeaPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [formState, setFormState] = useState<IdeaFormState>({
    title: '',
    description: '',
    content: '',
    tags: [],
    isPublic: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormState(prev => ({ ...prev, content }));
  };

  const handleAddTag = () => {
    if (currentTag && !formState.tags.includes(currentTag)) {
      setFormState(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleToggleVisibility = () => {
    setFormState(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create ideas.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formState.title || !formState.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for your idea.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('wisdom_resources')
        .insert({
          title: formState.title,
          description: formState.description,
          resource_type: 'idea',
          created_by: user.id,
          tags: formState.tags,
          resource_url: null,
          file_path: null,
          published_status: 'published',
          is_public: formState.isPublic,
          content: formState.content
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Idea Created",
        description: "Your idea has been created successfully!",
      });
      
      navigate('/dashboard/idea-vault');
    } catch (error: any) {
      console.error('Error creating idea:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create your idea. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContentCreationContainer
      title="Create a New Idea"
      description="Document your innovative ideas and share them with the world."
      icon={<Lightbulb className="h-6 w-6" />}
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Idea Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your idea a clear, catchy title"
                value={formState.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief summary of your idea (1-2 sentences)"
                value={formState.description}
                onChange={handleChange}
                required
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Detailed Explanation</Label>
              <RichTextEditor
                value={formState.content}
                onChange={handleEditorChange}
                placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add tags (e.g., tech, business, education)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {formState.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formState.tags.map(tag => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <XCircle 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="visibility"
                checked={formState.isPublic}
                onCheckedChange={handleToggleVisibility}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="visibility" className="flex items-center gap-2">
                  {formState.isPublic ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Private
                    </>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {formState.isPublic 
                    ? "Your idea will be visible to everyone" 
                    : "Your idea will be visible only to you"}
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/idea-vault')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Idea"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </ContentCreationContainer>
  );
};

export default CreateIdeaPost;
