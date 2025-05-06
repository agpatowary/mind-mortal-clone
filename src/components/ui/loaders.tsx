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

export const LogoLoader = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizeClass = 
    size === "sm" ? "w-8 h-8" : 
    size === "lg" ? "w-16 h-16" : 
    "w-12 h-12";

  return (
    <div className="flex items-center justify-center">
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
    </div>
  );
};
