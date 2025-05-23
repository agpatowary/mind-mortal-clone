
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Lightbulb, PlusCircle, Loader2, Eye, EyeOff, BarChart3, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ViewDetailsButton from '@/components/dashboard/ViewDetailsButton';
import PostInteractions from '@/components/social/PostInteractions';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const IdeaVaultPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [showPublicOnly]);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('idea_posts')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
        
      // Filter by visibility if needed
      if (showPublicOnly) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ideas:', error);
        throw error;
      }

      console.log('Fetched ideas:', data);
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIdeaVisibility = async (ideaId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('idea_posts')
        .update({ is_public: !currentVisibility })
        .eq('id', ideaId)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      setIdeas(ideas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, is_public: !currentVisibility } 
          : idea
      ));
      
      toast({
        title: "Visibility Updated",
        description: `Idea is now ${!currentVisibility ? 'public' : 'private'}.`,
      });
    } catch (error) {
      console.error('Error updating idea visibility:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update idea visibility. Please try again.",
        variant: "destructive"
      });
    }
  };

  const boostIdea = async (ideaId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to boost ideas.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Calculate boost until date (e.g., 7 days from now)
      const boostUntil = new Date();
      boostUntil.setDate(boostUntil.getDate() + 7);
      
      // Update the boost count manually
      const { data: currentData, error: fetchError } = await supabase
        .from('idea_posts')
        .select('boost_count')
        .eq('id', ideaId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newBoostCount = (currentData?.boost_count || 0) + 1;
      
      const { error } = await supabase
        .from('idea_posts')
        .update({ 
          boost_count: newBoostCount,
          boost_until: boostUntil.toISOString(),
          is_featured: true
        })
        .eq('id', ideaId);
        
      if (error) throw error;
      
      // Update local state
      setIdeas(ideas.map(idea => 
        idea.id === ideaId 
          ? { 
              ...idea, 
              boost_count: newBoostCount,
              boost_until: boostUntil.toISOString(),
              is_featured: true
            } 
          : idea
      ));
      
      toast({
        title: "Idea Boosted!",
        description: "Your idea will receive increased visibility for the next 7 days.",
      });
      
      // Refetch ideas to get the updated list with correct sorting
      fetchIdeas();
    } catch (error) {
      console.error('Error boosting idea:', error);
      toast({
        title: "Boost Failed",
        description: "Failed to boost your idea. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Idea Vault</h1>
          <p className="text-muted-foreground">
            Document, develop, and share your innovative ideas.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="public-filter"
              checked={showPublicOnly}
              onCheckedChange={setShowPublicOnly}
            />
            <Label htmlFor="public-filter">Show Public Only</Label>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/idea-vault/create')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Idea
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : ideas.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Ideas Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start documenting your innovative ideas in the Idea Vault.
            </p>
            <Button
              onClick={() => navigate('/dashboard/idea-vault/create')}
              className="flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Create Your First Idea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map(idea => (
            <Card key={idea.id} className="h-full flex flex-col">
              <CardHeader className="relative">
                {idea.is_featured && (
                  <span className="absolute top-2 right-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Featured Idea</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                )}
                <CardTitle className="line-clamp-2 pr-8">{idea.title}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}</span>
                  {user?.id === idea.user_id && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleIdeaVisibility(idea.id, idea.is_public)}
                        >
                          {idea.is_public ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{idea.is_public ? 'Make Private' : 'Make Public'}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-4 mb-4">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(idea.tags || []).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {idea.boost_count > 0 && (
                  <div className="mt-2 mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Boost Power</span>
                      <span>{idea.boost_count} boosts</span>
                    </div>
                    <Progress value={Math.min(idea.boost_count * 10, 100)} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <PostInteractions
                  postId={idea.id}
                  postType="idea_post"
                />
                <div className="flex gap-2">
                  {user?.id === idea.user_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => boostIdea(idea.id)}
                      disabled={idea.is_featured}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      {idea.is_featured ? 'Boosted' : 'Boost'}
                    </Button>
                  )}
                  <ViewDetailsButton
                    route={`/dashboard/idea-vault/view/${idea.id}`}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaVaultPage;
