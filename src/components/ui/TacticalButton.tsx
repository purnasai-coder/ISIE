import React from "react";
import { cn } from "@/lib/utils/cn";

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const TacticalButton: React.FC<TacticalButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-mono uppercase font-medium tracking-wider transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-isie-primary disabled:opacity-40 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-xs px-3.5 py-2 gap-2",
    lg: "text-sm px-5 py-2.5 gap-2.5 tracking-widest",
  };

  const variantStyles = {
    primary:
      "bg-isie-primary text-black font-semibold border border-isie-primary/80 hover:bg-isie-primary-light shadow-[0_0_15px_rgba(255,122,24,0.3)]",
    secondary:
      "bg-isie-panel-light text-isie-text-primary border border-white/10 hover:border-isie-primary/40 hover:bg-isie-panel-elevated hover:text-white",
    cyan:
      "bg-sky-950/40 text-sky-300 border border-sky-500/40 hover:bg-sky-900/40 hover:border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]",
    danger:
      "bg-red-950/40 text-red-300 border border-red-500/40 hover:bg-red-900/40 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    ghost:
      "bg-transparent text-isie-text-secondary hover:text-isie-text-primary hover:bg-white/5 border border-transparent",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
