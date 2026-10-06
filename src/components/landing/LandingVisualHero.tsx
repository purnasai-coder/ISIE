"use client";

import React, { useEffect, useState } from "react";

export function LandingVisualHero() {
  const [HeroComponent, setHeroComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let isMounted = true;
    import("@/components/visuals/VolumetricHero")
      .then((mod) => {
        if (isMounted) {
          setHeroComponent(() => mod.VolumetricHero);
        }
      })
      .catch((err) => {
        console.warn("Failed to dynamically load VolumetricHero:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {HeroComponent ? (
        <HeroComponent />
      ) : (
        <div className="absolute inset-0 bg-isie-bg-deep overflow-hidden pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
    </>
  );
}
