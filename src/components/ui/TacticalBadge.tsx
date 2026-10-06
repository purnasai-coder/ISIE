import React from "react";
import { cn } from "@/lib/utils/cn";

interface TacticalBadgeProps {
  children: React.ReactNode;
  variant?: "critical" | "warning" | "safe" | "cyan" | "muted" | "orange";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

export const TacticalBadge: React.FC<TacticalBadgeProps> = ({
  children,
  variant = "muted",
  size = "md",
  pulse = false,
  className,
}) => {
  const variantStyles = {
    critical: "bg-red-950/60 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    warning: "bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    safe: "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    cyan: "bg-sky-950/60 text-sky-400 border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
    orange: "bg-orange-950/60 text-orange-400 border-orange-500/40 shadow-[0_0_10px_rgba(255,122,24,0.2)]",
    muted: "bg-slate-900/60 text-slate-400 border-slate-700/50",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 tracking-wider",
    md: "text-xs px-2.5 py-1 tracking-widest",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded-sm transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "critical" && "bg-red-400",
              variant === "warning" && "bg-amber-400",
              variant === "safe" && "bg-emerald-400",
              variant === "cyan" && "bg-sky-400",
              variant === "orange" && "bg-orange-400",
              variant === "muted" && "bg-slate-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              variant === "critical" && "bg-red-500",
              variant === "warning" && "bg-amber-500",
              variant === "safe" && "bg-emerald-500",
              variant === "cyan" && "bg-sky-500",
              variant === "orange" && "bg-orange-500",
              variant === "muted" && "bg-slate-500"
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
};
