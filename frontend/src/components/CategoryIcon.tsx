"use client";

import {
  Package,
  Layers,
  Bot,
  Database,
  Code,
  FlaskConical,
  GitBranch,
  Shield,
  AlertTriangle,
  Plug,
  Target,
  Settings,
  Leaf,
  Zap,
  Hexagon,
  Rocket,
  Palette,
  LucideIcon,
} from "lucide-react";
import clsx from "clsx";

const iconMap: Record<string, LucideIcon> = {
  // Category icons
  Package,
  Layers,
  Bot,
  Database,
  Code,
  FlaskConical,
  GitBranch,
  Shield,
  AlertTriangle,
  Plug,
  Target,
  Settings,
  // Preset icons
  Leaf,
  Zap,
  Hexagon,
  Rocket,
  Palette,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient";
  gradientClass?: string;
}

export default function CategoryIcon({
  name,
  className,
  size = "md",
  variant = "default",
  gradientClass,
}: CategoryIconProps) {
  const Icon = iconMap[name] || Settings;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "gradient" && gradientClass) {
    return (
      <div
        className={clsx(
          "rounded-xl bg-gradient-to-br flex items-center justify-center",
          sizeClasses[size],
          gradientClass,
          className
        )}
      >
        <Icon className={clsx(iconSizes[size], "text-white")} />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <Icon className={clsx(iconSizes[size], "text-primary-600")} />
    </div>
  );
}
