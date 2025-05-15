
import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PostInteractionsProps {
  postId: string;
  postType: string;
  likesCount: number;
  userLiked: boolean;
  commentsCount?: number;
  sharesCount?: number;
  onLikeToggle?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postType,
  likesCount = 0,
  userLiked = false,
  commentsCount = 0,
  sharesCount = 0,
  onLikeToggle,
  onComment,
  onShare
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${userLiked ? 'text-red-500' : ''}`}
        onClick={onLikeToggle}
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
