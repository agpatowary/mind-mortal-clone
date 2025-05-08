
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViewDetailsButtonProps {
  route: string;
  text?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ 
  route, 
  text = "View Details",
  variant = "outline"
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant={variant}
        className="flex items-center gap-1 group"
        onClick={() => navigate(route)}
      >
        {text}
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default ViewDetailsButton;
