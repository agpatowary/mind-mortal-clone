
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostInteractionsProps {
  postId: string;
  postType: string;
  likesCount?: number;
  userLiked?: boolean;
  onLikeToggle?: () => void;
  onUpdate?: () => void;
  initialLikesCount?: number;
  initialCommentsCount?: number;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  likesCount: propLikesCount,
  userLiked: propUserLiked,
  onLikeToggle,
  onUpdate,
  initialLikesCount,
  initialCommentsCount
}) => {
  const [likesCount, setLikesCount] = useState(propLikesCount || initialLikesCount || 0);
  const [userLiked, setUserLiked] = useState(propUserLiked || false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [postId, postType]);

  const fetchLikes = async () => {
    try {
      // Get likes count
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)
        .eq('post_type', postType);
      
      setLikesCount(count || 0);

      // Check if user liked this post
      if (user) {
        const { data } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('post_type', postType)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserLiked(!!data);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (userLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('post_type', postType)
          .eq('user_id', user.id);
        
        setLikesCount(prev => prev - 1);
        setUserLiked(false);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            post_type: postType,
            user_id: user.id
          });
        
        setLikesCount(prev => prev + 1);
        setUserLiked(true);
      }

      // Call external like toggle handler if provided
      if (onLikeToggle) {
        onLikeToggle();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive"
      });
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          post_type: postType,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      
      if (onUpdate) {
        onUpdate();
      }

      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${userLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{comments.length}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4">
          {/* Comment input */}
          {user && (
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button 
                onClick={handleComment} 
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                  {comment.profiles?.full_name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="font-medium text-sm">
                      {comment.profiles?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;
