
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostLikes } from '@/hooks/usePostLikes';
import { cn } from '@/lib/utils';

export interface PostInteractionsProps {
  postId: string;
  postType: 'legacy_post' | 'timeless_message' | 'wisdom_resource' | 'idea';
  userLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onLikeToggle?: () => Promise<void>;
  onCommentClick?: () => void;
  onShareClick?: () => void;
  onUpdate?: () => Promise<void>;
  variant?: 'default' | 'minimal';
  className?: string;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  userLiked = false,
  likesCount = 0,
  commentsCount = 0,
  onLikeToggle,
  onCommentClick,
  onShareClick,
  onUpdate,
  variant = 'default',
  className
}) => {
  const [isLiked, setIsLiked] = useState(userLiked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const { toggleLike, isProcessing } = usePostLikes();
  
  const handleLikeToggle = async () => {
    if (onLikeToggle) {
      await onLikeToggle();
      return;
    }

    if (isProcessing) return;

    const newLikedState = await toggleLike(postId, postType, isLiked);
    if (newLikedState !== isLiked) {
      setIsLiked(newLikedState);
      setCurrentLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
      if (onUpdate) {
        await onUpdate();
      }
    }
  };

  const isMinimal = variant === 'minimal';

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size={isMinimal ? "sm" : "default"}
          className={cn(
            "px-2 hover:bg-background", 
            isLiked && "text-red-500 hover:text-red-600"
          )}
          onClick={handleLikeToggle}
          disabled={isProcessing}
        >
          <Heart className={cn(
            "mr-1",
            isMinimal ? "h-4 w-4" : "h-5 w-5",
            isLiked && "fill-current"
          )} />
          {!isMinimal && <span>{currentLikesCount}</span>}
        </Button>
        {isMinimal && currentLikesCount > 0 && (
          <span className="text-sm text-muted-foreground">{currentLikesCount}</span>
        )}
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size={isMinimal ? "sm" : "default"}
          className="px-2 hover:bg-background"
          onClick={onCommentClick}
        >
          <MessageCircle className={isMinimal ? "h-4 w-4 mr-1" : "h-5 w-5 mr-1"} />
          {!isMinimal && <span>{commentsCount}</span>}
        </Button>
        {isMinimal && commentsCount > 0 && (
          <span className="text-sm text-muted-foreground">{commentsCount}</span>
        )}
      </div>

      {onShareClick && (
        <Button
          variant="ghost"
          size={isMinimal ? "sm" : "default"}
          className="px-2 hover:bg-background"
          onClick={onShareClick}
        >
          <Share2 className={isMinimal ? "h-4 w-4" : "h-5 w-5"} />
        </Button>
      )}
    </div>
  );
};

export default PostInteractions;
