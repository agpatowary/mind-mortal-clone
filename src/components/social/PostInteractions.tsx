
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePostLikes } from '@/hooks/usePostLikes';

export interface PostInteractionsProps {
  postId: string;
  postType: 'legacy_post' | 'timeless_message' | 'wisdom_resource' | 'idea';
  initialLikesCount?: number;
  initialCommentsCount?: number;
  initialUserLiked?: boolean;
  onComment?: () => void;
  onShare?: () => void;
  onUpdate?: () => Promise<void> | void;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  initialLikesCount = 0,
  initialCommentsCount = 0,
  initialUserLiked = false,
  onComment,
  onShare,
  onUpdate
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleLike, isProcessing } = usePostLikes();
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount || 0);
  const [sharesCount, setSharesCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      checkIfUserLiked();
      fetchCounts();
    }
  }, [user, postId, postType]);

  useEffect(() => {
    setLikesCount(initialLikesCount || 0);
    setCommentsCount(initialCommentsCount || 0);
    setUserLiked(initialUserLiked);
  }, [initialLikesCount, initialCommentsCount, initialUserLiked]);

  const checkIfUserLiked = async () => {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      
      setUserLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchCounts = async () => {
    try {
      // Fetch likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('post_type', postType);
        
      if (likesError) throw likesError;
      
      // Fetch comments count
      const { count: commentsCount, error: commentsError } = await supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('post_type', postType);
        
      if (commentsError) throw commentsError;
      
      setLikesCount(likesCount || 0);
      setCommentsCount(commentsCount || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };
  
  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }
    
    const newLikeStatus = await toggleLike(postId, postType, userLiked);
    
    // Update UI state
    setUserLiked(newLikeStatus);
    setLikesCount(prev => newLikeStatus ? prev + 1 : Math.max(0, prev - 1));
    
    // Refresh data if needed
    if (onUpdate) {
      onUpdate();
    }
  };
  
  const handleComment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment on posts.",
        variant: "destructive"
      });
      return;
    }
    
    if (onComment) {
      onComment();
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
      setSharesCount(prev => prev + 1);
    } else {
      // Default share behavior
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard!",
      });
    }
  };
  
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${userLiked ? 'text-red-500' : ''}`}
        onClick={handleLikeToggle}
        disabled={isProcessing}
      >
        <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
      
      {onComment && (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleComment}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>{sharesCount}</span>
      </Button>
    </div>
  );
};

export default PostInteractions;
