
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
import { usePostLikes } from '@/hooks/usePostLikes';
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
  const { toggleLike } = usePostLikes();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [showPublicOnly]);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('wisdom_resources')
        .select('*')
        .eq('resource_type', 'idea')
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
      
      // Fetch likes for each idea
      if (data && data.length > 0) {
        const ideaIds = data.map(idea => idea.id);
        await fetchLikesStatus(ideaIds);
        await fetchLikesCounts(ideaIds);
      } else {
        // No ideas found, just finish loading
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const fetchLikesStatus = async (ideaIds: string[]) => {
    if (!user || ideaIds.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('post_type', 'idea')
        .in('post_id', ideaIds)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const newLikesMap: Record<string, boolean> = {};
      (data || []).forEach(like => {
        newLikesMap[like.post_id] = true;
      });
      
      setLikesMap(newLikesMap);
    } catch (error) {
      console.error('Error fetching likes status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikesCounts = async (ideaIds: string[]) => {
    if (ideaIds.length === 0) return;
    
    try {
      // For each post_id, count the number of likes
      const countPromises = ideaIds.map(async (id) => {
        const { count, error } = await supabase
          .from('post_likes')
          .select('*', { count: 'exact' })
          .eq('post_type', 'idea')
          .eq('post_id', id);
          
        if (error) throw error;
        
        return { id, count: count || 0 };
      });
      
      const counts = await Promise.all(countPromises);
      
      const newLikesCountMap: Record<string, number> = {};
      counts.forEach(item => {
        newLikesCountMap[item.id] = item.count;
      });
      
      setLikesCountMap(newLikesCountMap);
    } catch (error) {
      console.error('Error fetching likes counts:', error);
    }
  };

  const handleLikeToggle = async (ideaId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like ideas.",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyLiked = likesMap[ideaId] || false;
    const newLikeStatus = await toggleLike(ideaId, 'idea', isCurrentlyLiked);
    
    // Update local state for immediate UI feedback
    setLikesMap(prev => ({ ...prev, [ideaId]: newLikeStatus }));
    setLikesCountMap(prev => ({ 
      ...prev, 
      [ideaId]: prev[ideaId] + (newLikeStatus ? 1 : -1) 
    }));
  };

  const toggleIdeaVisibility = async (ideaId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('wisdom_resources')
        .update({ is_public: !currentVisibility })
        .eq('id', ideaId)
        .eq('created_by', user?.id);
        
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
      
      // Update the boost count manually instead of using RPC
      const { data: currentData, error: fetchError } = await supabase
        .from('wisdom_resources')
        .select('boost_count')
        .eq('id', ideaId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const newBoostCount = (currentData?.boost_count || 0) + 1;
      
      const { error } = await supabase
        .from('wisdom_resources')
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
                  {user?.id === idea.created_by && (
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
                  postType="idea"
                  likesCount={likesCountMap[idea.id] || 0}
                  userLiked={likesMap[idea.id] || false}
                  onLikeToggle={() => handleLikeToggle(idea.id)}
                />
                <div className="flex gap-2">
                  {user?.id === idea.created_by && (
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
