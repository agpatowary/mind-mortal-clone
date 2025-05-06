
import { motion } from "framer-motion";

export const Skeleton = ({ ...props }) => {
  return (
    <div className="skeleton" {...props}></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="relative rounded-xl border bg-card text-card-foreground shadow-sm w-full h-full flex flex-col">
      <div className="p-4">
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-[250px]" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-[220px]" />
      </div>
    </div>
  );
};

export const ButtonLoader = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizeClass =
    size === "sm" ? "w-4 h-4" :
    size === "lg" ? "w-6 h-6" :
    "w-5 h-5";

  return (
    <motion.div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClass}`}
      initial={{
        borderWidth: 2,
      }}
      animate={{
        borderColor: ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--primary))"],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export const LogoLoader = ({ size = "default", interactive = false }: { size?: "sm" | "default" | "lg", interactive?: boolean }) => {
  const sizeClass = 
    size === "sm" ? "w-8 h-8" : 
    size === "lg" ? "w-16 h-16" : 
    "w-12 h-12";

  return (
    <div className="flex items-center justify-center">
      {interactive ? (
        <motion.div
          className={`relative ${sizeClass}`}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ 
            scale: 1.2,
            transition: { duration: 0.3 }
          }}
          drag
          dragConstraints={{ top: -50, right: 50, bottom: 50, left: -50 }}
          dragElastic={0.8}
        >
          <svg 
            viewBox="0 0 500 500" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
          >
            <motion.path
              d="M 250 50 L 350 150 L 250 250 L 150 150 Z M 250 250 L 350 350 L 250 450 L 150 350 Z"
              strokeWidth="30"
              stroke="currentColor"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      ) : (
        <motion.div
          className={`relative ${sizeClass}`}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg 
            viewBox="0 0 500 500" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
          >
            <path
              d="M 250 50 L 350 150 L 250 250 L 150 150 Z M 250 250 L 350 350 L 250 450 L 150 350 Z"
              strokeWidth="30"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export const InteractiveLoader = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizeClass = 
    size === "sm" ? "w-10 h-10" : 
    size === "lg" ? "w-24 h-24" : 
    "w-16 h-16";
    
  const circleSize = 
    size === "sm" ? "w-2 h-2" : 
    size === "lg" ? "w-5 h-5" : 
    "w-3 h-3";
    
  // Create circles
  const circles = Array(6).fill(0);
  
  return (
    <motion.div 
      className={`relative ${sizeClass} mx-auto`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 45 }}
    >
      {circles.map((_, index) => {
        const angle = (index * 60) * (Math.PI / 180);
        const x = 50 + 40 * Math.cos(angle);
        const y = 50 + 40 * Math.sin(angle);
        
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-primary ${circleSize}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              delay: index * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </motion.div>
  );
};
