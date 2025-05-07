
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface LikeData {
  id: string;
  post_id: string;
  post_type: string;
  user_id: string;
  created_at: string;
}

interface CommentData {
  id: string;
  post_id: string;
  post_type: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface PostInteractionsProps {
  postId: string;
  postType: 'legacy_post' | 'timeless_message' | 'wisdom_resource';
  initialLikes?: number;
  initialComments?: number;
  onUpdate?: () => void;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  initialLikes = 0,
  initialComments = 0,
  onUpdate
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<number>(initialLikes);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentCount, setCommentCount] = useState<number>(initialComments);
  const [commentText, setCommentText] = useState<string>('');
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      checkIfUserLiked();
      fetchLikesCount();
      fetchCommentCount();
    }
  }, [user, postId]);

  const checkIfUserLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('post_type', getPostTypeValue(postType))
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like status:', error);
      } else {
        setUserLiked(!!data);
      }
    } catch (err) {
      console.error('Error in like check operation:', err);
    }
  };

  const fetchLikesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('post_type', getPostTypeValue(postType));

      if (error) {
        console.error('Error fetching likes count:', error);
      } else {
        setLikes(count || 0);
      }
    } catch (err) {
      console.error('Error in fetch likes operation:', err);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const { count, error } = await supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('post_type', getPostTypeValue(postType));

      if (error) {
        console.error('Error fetching comment count:', error);
      } else {
        setCommentCount(count || 0);
      }
    } catch (err) {
      console.error('Error in fetch comments operation:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id, 
          post_id, 
          post_type, 
          user_id, 
          content, 
          created_at,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('post_type', getPostTypeValue(postType))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else if (data) {
        // Transform the data to match the CommentData interface
        const formattedComments = data.map(comment => ({
          ...comment,
          user: {
            full_name: comment.profiles?.full_name || 'Anonymous',
            avatar_url: comment.profiles?.avatar_url || null
          }
        }));
        setComments(formattedComments);
        console.log('Comments fetched:', formattedComments);
      }
    } catch (err) {
      console.error('Error in fetch comments operation:', err);
    }
  };

  // Helper function to convert our prop type to the database value
  const getPostTypeValue = (type: 'legacy_post' | 'timeless_message' | 'wisdom_resource'): string => {
    switch (type) {
      case 'legacy_post': return 'legacy_post';
      case 'timeless_message': return 'timeless_message';
      case 'wisdom_resource': return 'wisdom_resource';
      default: return 'legacy_post';
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (userLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('post_type', getPostTypeValue(postType))
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing like:', error);
          toast({
            title: "Error",
            description: "Could not unlike the post",
            variant: "destructive"
          });
        } else {
          setUserLiked(false);
          setLikes(prev => Math.max(0, prev - 1));
          if (onUpdate) onUpdate();
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            post_type: getPostTypeValue(postType),
            user_id: user.id
          });

        if (error) {
          console.error('Error adding like:', error);
          toast({
            title: "Error",
            description: "Could not like the post",
            variant: "destructive"
          });
        } else {
          setUserLiked(true);
          setLikes(prev => prev + 1);
          if (onUpdate) onUpdate();
        }
      }
    } catch (err) {
      console.error('Error in like operation:', err);
    }
  };

  const submitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          post_type: getPostTypeValue(postType),
          user_id: user.id,
          content: commentText.trim()
        })
        .select(`
          id,
          post_id,
          post_type,
          user_id,
          content,
          created_at
        `);

      if (error) {
        console.error('Error posting comment:', error);
        toast({
          title: "Error",
          description: "Could not post your comment",
          variant: "destructive"
        });
      } else if (data && data.length > 0) {
        setCommentText('');
        setCommentCount(prev => prev + 1);
        
        if (showComments) {
          // Add the new comment to the list with user profile info
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
            
          const newComment = {
            ...data[0],
            user: {
              full_name: userData?.full_name || 'Anonymous',
              avatar_url: userData?.avatar_url || null
            }
          };
          
          setComments([newComment, ...comments]);
        }
        
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Error in comment operation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${userLiked ? 'text-red-500' : ''}`}
          onClick={toggleLike}
        >
          <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={toggleComments}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{commentCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 ml-auto"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
      
      {showComments && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex gap-2">
            <Textarea
              className="min-h-20 flex-1 p-2 border rounded-md resize-none bg-muted"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button 
              onClick={submitComment}
              disabled={!commentText.trim() || isSubmitting}
            >
              Post
            </Button>
          </div>
          
          <div className="space-y-3 mt-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.full_name || "User"} />
                    <AvatarFallback className="text-xs">
                      {comment.user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{comment.user?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;
