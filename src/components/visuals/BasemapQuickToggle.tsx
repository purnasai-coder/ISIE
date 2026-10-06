"use client";

import React from "react";
import { Map, Satellite } from "lucide-react";

export type BasemapMode = "street" | "satellite";

interface BasemapQuickToggleProps {
  basemap: BasemapMode;
  onChange: (mode: BasemapMode) => void;
  className?: string;
  size?: "sm" | "md";
}

export const BasemapQuickToggle: React.FC<BasemapQuickToggleProps> = ({
  basemap,
  onChange,
  className = "",
  size = "sm",
}) => {
  const isSm = size === "sm";

  return (
    <div
      className={`inline-flex items-center p-0.5 bg-black/60 border border-white/20 rounded-xs backdrop-blur-md shadow-md ${className}`}
      role="group"
      aria-label="Basemap Switcher"
    >
      <button
        type="button"
        onClick={() => onChange("street")}
        className={`flex items-center gap-1.5 ${
          isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        } font-mono uppercase font-bold tracking-wider rounded-2xs transition-all duration-150 ${
          basemap === "street"
            ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.35)]"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
        title="Switch to Street Vector Basemap (OpenStreetMap)"
      >
        <Map className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span>Street</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("satellite")}
        className={`flex items-center gap-1.5 ${
          isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        } font-mono uppercase font-bold tracking-wider rounded-2xs transition-all duration-150 ${
          basemap === "satellite"
            ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.35)]"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
        title="Switch to High-Resolution Satellite Basemap (ESRI / True-Color Aerial)"
      >
        <Satellite className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span>Satellite</span>
      </button>
    </div>
  );
};

export default BasemapQuickToggle;
