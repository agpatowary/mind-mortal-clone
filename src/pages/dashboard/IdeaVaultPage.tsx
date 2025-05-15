
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, PlusCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePostLikes } from '@/hooks/usePostLikes';
import ViewDetailsButton from '@/components/dashboard/ViewDetailsButton';
import PostInteractions from '@/components/social/PostInteractions';
import { formatDistanceToNow } from 'date-fns';

const IdeaVaultPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleLike } = usePostLikes();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wisdom_resources')
        .select('*')
        .eq('resource_type', 'idea')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIdeas(data || []);
      
      // Fetch likes for each idea
      const ideaIds = (data || []).map(idea => idea.id);
      fetchLikesStatus(ideaIds);
      fetchLikesCounts(ideaIds);
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

  const fetchLikesStatus = async (ideaIds: string[]) => {
    if (!user || ideaIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('post_type', 'idea')
        .in('post_id', ideaIds);
        
      if (error) throw error;
      
      const newLikesMap: Record<string, boolean> = {};
      (data || []).forEach(like => {
        newLikesMap[like.post_id] = true;
      });
      
      setLikesMap(newLikesMap);
    } catch (error) {
      console.error('Error fetching likes status:', error);
    }
  };

  const fetchLikesCounts = async (ideaIds: string[]) => {
    if (ideaIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id, count')
        .eq('post_type', 'idea')
        .in('post_id', ideaIds)
        .group('post_id');
        
      if (error) throw error;
      
      const newLikesCountMap: Record<string, number> = {};
      ideaIds.forEach(id => {
        newLikesCountMap[id] = 0;
      });
      
      (data || []).forEach(item => {
        newLikesCountMap[item.post_id] = parseInt(item.count);
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

  return (
    <div className="container mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Idea Vault</h1>
          <p className="text-muted-foreground">
            Document, develop, and share your innovative ideas.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/idea-vault/create')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create Idea
        </Button>
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
              <CardHeader>
                <CardTitle className="line-clamp-2">{idea.title}</CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-4 mb-4">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(idea.tags || []).map((tag: string, i: number) => (
                    <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <div className="px-6 pb-4 mt-auto">
                <div className="flex justify-between items-center">
                  <PostInteractions
                    likesCount={likesCountMap[idea.id] || 0}
                    commentsCount={0}
                    isLiked={likesMap[idea.id] || false}
                    onLikeToggle={() => handleLikeToggle(idea.id)}
                    onCommentClick={() => {/* Implement comment functionality */}}
                  />
                  <ViewDetailsButton
                    type="idea"
                    id={idea.id}
                    title={idea.title}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaVaultPage;
