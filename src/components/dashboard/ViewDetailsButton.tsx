
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ViewDetailsButtonProps {
  route: string;
  text?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  tooltip?: string;
  icon?: 'arrow' | 'external';
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ 
  route, 
  text = "View Details",
  variant = "outline",
  tooltip,
  icon = "arrow"
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(route);
  };
  
  const IconComponent = icon === 'arrow' ? ArrowRight : ExternalLink;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button 
            variant={variant}
            className="flex items-center gap-1 group relative overflow-hidden"
            onClick={handleClick}
          >
            <span className="relative z-10">{text}</span>
            <IconComponent className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform relative z-10" />
            
            {/* Animated background effect */}
            <motion.div 
              className="absolute inset-0 bg-primary/10 dark:bg-primary/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </Button>
        </motion.div>
      </HoverCardTrigger>
      
      {tooltip && (
        <HoverCardContent className="w-64 text-sm" side="top">
          {tooltip}
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ViewDetailsButton;
