import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: "cyan" | "purple" | "green";
  delay?: number;
}

const colorStyles = {
  cyan: {
    icon: "text-primary",
    glow: "group-hover:shadow-[0_0_40px_hsl(187_100%_50%/0.4)]",
    border: "group-hover:border-primary/50",
    bg: "bg-primary/10",
  },
  purple: {
    icon: "text-secondary",
    glow: "group-hover:shadow-[0_0_40px_hsl(270_91%_65%/0.4)]",
    border: "group-hover:border-secondary/50",
    bg: "bg-secondary/10",
  },
  green: {
    icon: "text-success",
    glow: "group-hover:shadow-[0_0_40px_hsl(142_71%_45%/0.4)]",
    border: "group-hover:border-success/50",
    bg: "bg-success/10",
  },
};

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  to,
  color,
  delay = 0,
}: DashboardCardProps) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <Link to={to} className="block group">
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative overflow-hidden rounded-2xl p-8",
            "bg-card/50 backdrop-blur-xl",
            "border border-border/50",
            "transition-all duration-500",
            styles.glow,
            styles.border
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon container */}
          <motion.div
            whileHover={{ rotate: 10 }}
            className={cn(
              "relative z-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6",
              styles.bg
            )}
          >
            <Icon className={cn("w-8 h-8", styles.icon)} />
            <div
              className={cn(
                "absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500",
                styles.bg
              )}
            />
          </motion.div>

          {/* Content */}
          <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-gradient-cyber transition-all duration-300">
            {title}
          </h3>
          <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>

          {/* Animated arrow */}
          <motion.div
            initial={{ x: 0, opacity: 0.5 }}
            whileHover={{ x: 5, opacity: 1 }}
            className={cn("absolute bottom-8 right-8", styles.icon)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div
              className={cn(
                "absolute top-4 right-4 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                styles.bg
              )}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default DashboardCard;
