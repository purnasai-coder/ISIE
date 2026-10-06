"use client";

import React from "react";
import { Globe, Map, Columns, Satellite } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type MapDisplayMode = "3D_GLOBE" | "2D_MAP" | "GOOGLE_MAPS" | "SPLIT_VIEW";

interface MapModeSwitcherProps {
  mode: MapDisplayMode;
  onChange: (mode: MapDisplayMode) => void;
  className?: string;
}

export const MapModeSwitcher: React.FC<MapModeSwitcherProps> = ({
  mode,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 bg-black/40 border border-white/15 rounded-sm backdrop-blur-xl shadow-lg relative",
        className
      )}
    >
      <button
        onClick={() => onChange("3D_GLOBE")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-xs transition-all duration-150",
          mode === "3D_GLOBE"
            ? "bg-isie-primary text-black font-semibold shadow-[0_0_12px_rgba(255,122,24,0.4)]"
            : "text-isie-text-secondary hover:text-white hover:bg-white/5"
        )}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>3D Globe</span>
      </button>

      <button
        onClick={() => onChange("2D_MAP")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-xs transition-all duration-150",
          mode === "2D_MAP"
            ? "bg-isie-primary text-black font-semibold shadow-[0_0_12px_rgba(255,122,24,0.4)]"
            : "text-isie-text-secondary hover:text-white hover:bg-white/5"
        )}
      >
        <Map className="w-3.5 h-3.5" />
        <span>2D Tactical</span>
      </button>

      <button
        onClick={() => onChange("GOOGLE_MAPS")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-xs transition-all duration-150",
          mode === "GOOGLE_MAPS"
            ? "bg-sky-500 text-black font-semibold shadow-[0_0_12px_rgba(14,165,233,0.4)]"
            : "text-isie-text-secondary hover:text-white hover:bg-white/5"
        )}
      >
        <Satellite className="w-3.5 h-3.5" />
        <span>Google Maps</span>
      </button>

      <button
        onClick={() => onChange("SPLIT_VIEW")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-xs transition-all duration-150",
          mode === "SPLIT_VIEW"
            ? "bg-isie-cyan text-black font-semibold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            : "text-isie-text-secondary hover:text-white hover:bg-white/5"
        )}
      >
        <Columns className="w-3.5 h-3.5" />
        <span>Split View</span>
      </button>
    </div>
  );
};
