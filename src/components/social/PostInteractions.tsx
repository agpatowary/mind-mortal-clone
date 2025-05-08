
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Send,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface PostInteractionsProps {
  postId: string;
  postType: string;
  initialLikesCount?: number;
  initialCommentsCount?: number;
  userLiked?: boolean;
  onUpdate?: () => void; // Add the missing onUpdate prop
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  initialLikesCount = 0,
  initialCommentsCount = 0,
  userLiked = false,
  onUpdate
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [isLiked, setIsLiked] = useState(userLiked);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    if (!postId) return;
    
    setIsLoading(true);
    try {
      // Join with profiles to get user names and avatars
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedComments = data.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user_name: comment.profiles?.full_name || 'Anonymous User',
        user_avatar: comment.profiles?.avatar_url || null
      }));
      
      setComments(formattedComments);
      setCommentsCount(formattedComments.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Failed to load comments",
        description: "There was an error loading the comments.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        // Unlike the post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('post_type', postType)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Like the post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            post_type: postType,
            user_id: user.id
          });

        if (error) throw error;
        
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Action failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment.",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          post_type: postType,
          user_id: user.id,
          content: newComment.trim()
        })
        .select();

      if (error) throw error;
      
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
        
      // Add the new comment to the list
      const newCommentObject: Comment = {
        id: data[0].id,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        user_name: profile?.full_name || 'Anonymous User',
        user_avatar: profile?.avatar_url || null
      };
      
      setComments(prev => [newCommentObject, ...prev]);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Comment failed",
        description: "There was an error posting your comment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleToggleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{commentsCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] bg-background text-foreground border-muted-foreground/20"
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        size="sm" 
                        onClick={handleSubmitComment}
                        disabled={isSubmitting || !newComment.trim()}
                        className="flex items-center gap-1"
                      >
                        {isSubmitting ? 'Posting...' : 'Post'}
                        <Send className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">Comments ({commentsCount})</h4>
                  
                  {isLoading ? (
                    <div className="py-4 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <p className="text-sm text-muted-foreground mt-2">Loading comments...</p>
                    </div>
                  ) : (
                    comments.length > 0 ? (
                      <ScrollArea className="max-h-[300px] pr-2">
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.user_avatar || undefined} />
                                <AvatarFallback>
                                  <User className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/40 rounded-md p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium">{comment.user_name}</p>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(comment.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="py-6 text-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No comments yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Be the first to share your thoughts</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostInteractions;
