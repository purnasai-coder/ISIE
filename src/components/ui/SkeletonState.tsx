import React from "react";
import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  count?: number;
  type?: "card" | "line" | "panel" | "matrix";
}

export const SkeletonState: React.FC<SkeletonProps> = ({
  className,
  count = 3,
  type = "card",
}) => {
  if (type === "line") {
    return (
      <div className={cn("space-y-2.5 animate-pulse", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-white/5 border border-white/[0.03] rounded-sm"
            style={{ width: `${Math.max(40, 100 - i * 15)}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === "matrix") {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3 bg-isie-panel/40 border border-white/[0.05] rounded-sm flex flex-col gap-2"
          >
            <div className="h-2 w-16 bg-white/10 rounded-sm" />
            <div className="h-6 w-24 bg-white/5 rounded-sm" />
            <div className="h-2 w-full bg-white/[0.03] rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 bg-isie-panel/50 border border-white/[0.06] rounded-sm relative overflow-hidden"
        >
          {/* Subtle sweep line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-28 bg-white/10 rounded-sm" />
            <div className="h-3 w-14 bg-white/5 rounded-sm" />
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="h-2.5 w-full bg-white/5 rounded-sm" />
            <div className="h-2.5 w-4/5 bg-white/5 rounded-sm" />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <div className="h-2 w-16 bg-white/[0.06] rounded-sm" />
            <div className="h-2 w-20 bg-white/[0.04] rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
};
