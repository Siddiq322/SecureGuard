import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "primary" | "secondary" | "success" | "warning" | "destructive";
  delay?: number;
}

const glowColors = {
  primary: "hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)]",
  secondary: "hover:shadow-[0_0_30px_hsl(270_91%_65%/0.3)]",
  success: "hover:shadow-[0_0_30px_hsl(142_71%_45%/0.3)]",
  warning: "hover:shadow-[0_0_30px_hsl(38_92%_50%/0.3)]",
  destructive: "hover:shadow-[0_0_30px_hsl(0_84%_60%/0.3)]",
};

const GlassCard = ({
  children,
  className,
  hover = true,
  glow = "primary",
  delay = 0,
  ...props
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-card/40 backdrop-blur-xl",
        "border border-border/50",
        "transition-all duration-300",
        hover && glowColors[glow],
        className
      )}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
    </motion.div>
  );
};

export default GlassCard;
