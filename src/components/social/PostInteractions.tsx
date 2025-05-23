
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface PostInteractionsProps {
  postId: string;
  postType: string;
  initialLikesCount?: number;
  initialCommentsCount?: number;
  initialUserLiked?: boolean;
  sharesCount?: number;
  onComment?: () => void;
  onShare?: () => void;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  initialLikesCount = 0,
  initialCommentsCount = 0,
  initialUserLiked = false,
  sharesCount = 0,
  onComment,
  onShare
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial like state
  useEffect(() => {
    if (user) {
      const checkUserLike = async () => {
        try {
          const { data, error } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('post_type', postType)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          setUserLiked(!!data);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
      
      checkUserLike();
    }
  }, [postId, postType, user]);
  
  // Fetch actual counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Count likes
        const { count: likesCount, error: likesError } = await supabase
          .from('post_likes')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', postId)
          .eq('post_type', postType);
          
        if (likesError) throw likesError;
        
        // Count comments
        const { count: commentsCount, error: commentsError } = await supabase
          .from('post_comments')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', postId)
          .eq('post_type', postType);
          
        if (commentsError) throw commentsError;
        
        setLikesCount(likesCount || 0);
        setCommentsCount(commentsCount || 0);
      } catch (error) {
        console.error('Error fetching interactions counts:', error);
      }
    };
    
    fetchCounts();
  }, [postId, postType]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (userLiked) {
        // Unlike post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('post_type', postType)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setUserLiked(false);
      } else {
        // Like post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            post_type: postType,
            user_id: user.id
          });
          
        if (error) throw error;
        
        setLikesCount(prev => prev + 1);
        setUserLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${userLiked ? 'text-red-500' : ''}`}
        onClick={handleLikeToggle}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
      
      {onComment && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onComment}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </Button>
      )}
      
      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          <span>{sharesCount}</span>
        </Button>
      )}
    </div>
  );
};

export default PostInteractions;
