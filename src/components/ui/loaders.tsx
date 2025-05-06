
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'spinner' | 'pulse';
}

export function Loader({
  size = 'md',
  variant = 'default',
  className,
  ...props
}: LoaderProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)} {...props}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-primary",
              size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn("relative", sizeClass[size], className)} {...props}>
        <motion.div
          className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn("rounded-full bg-primary/20", sizeClass[size], className)}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        {...props}
      />
    );
  }

  // Default spinner
  return (
    <svg
      className={cn("animate-spin text-primary", sizeClass[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
