import React from "react";
import { AlertCircle, Radio, Database, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TacticalBadge } from "./TacticalBadge";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "radio" | "database" | "alert" | "shield" | "cpu";
  statusText?: string;
  actionText?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Live Telemetry Stream Connected",
  description = "Awaiting authorized uplink from central sensor registry. Connect data ingestion source or configure operating scope to populate this module.",
  icon = "radio",
  statusText = "STANDBY // NO DATA FEED",
  actionText,
  actionLabel,
  actionHref,
  onAction,
  className,
  compact = false,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "database":
        return <Database className="w-6 h-6 text-isie-cyan" />;
      case "alert":
        return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case "shield":
        return <ShieldAlert className="w-6 h-6 text-isie-primary" />;
      case "cpu":
        return <Cpu className="w-6 h-6 text-indigo-400" />;
      default:
        return <Radio className="w-6 h-6 text-isie-text-muted animate-pulse" />;
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-6 text-center border border-dashed border-white/10 bg-isie-panel/40 rounded-sm relative overflow-hidden",
          className
        )}
      >
        <div className="p-2.5 rounded-full bg-white/5 border border-white/10 mb-3">
          {renderIcon()}
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-isie-text-primary font-medium mb-1">
          {title}
        </p>
        <p className="text-[11px] text-isie-text-muted max-w-xs leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center p-8 md:p-12 border border-white/10 bg-gradient-to-b from-isie-panel/60 to-isie-panel-light/30 rounded-sm overflow-hidden",
        className
      )}
    >
      {/* Corner crosshairs */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative mb-4">
        <div className="p-3.5 rounded-sm bg-isie-bg-surface border border-white/10 shadow-inner">
          {renderIcon()}
        </div>
      </div>

      <TacticalBadge variant="muted" size="sm" className="mb-3">
        {statusText}
      </TacticalBadge>

      <h3 className="font-mono text-sm md:text-base font-semibold text-isie-text-primary uppercase tracking-wider mb-2">
        {title}
      </h3>

      <p className="text-xs text-isie-text-secondary max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (actionLabel || actionText) && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs text-isie-primary uppercase tracking-wider border border-isie-primary/40 hover:border-isie-primary bg-isie-primary/10 hover:bg-isie-primary/20 transition-colors rounded-sm cursor-pointer"
        >
          <span>{actionLabel || actionText}</span>
          <span className="text-sm">→</span>
        </button>
      )}

      {!onAction && (actionText || actionLabel) && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs text-isie-primary uppercase tracking-wider border border-isie-primary/30 hover:border-isie-primary hover:bg-isie-primary/10 transition-colors rounded-sm"
        >
          <span>{actionText || actionLabel}</span>
          <span className="text-sm">→</span>
        </Link>
      )}
    </div>
  );
};
