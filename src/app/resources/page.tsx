"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Truck, ShieldCheck, Users, HeartPulse, Droplets, Building, Search, Filter } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { resourceService } from "@/lib/services/resourceService";
import { ResponseResource } from "@/data/demo/resources";

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResponseResource[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    resourceService.getResources(categoryFilter).then(setResources);
  }, [categoryFilter]);

  const categories = [
    { id: "ALL", label: "All Assets" },
    { id: "DISASTER_BATTALION", label: "NDRF Battalions" },
    { id: "RELIEF_SHELTER", label: "Relief Shelters" },
    { id: "HEALTHCARE_UNIT", label: "Medical Teams" },
    { id: "WATER_LOGISTICS", label: "Water & Logistics" },
  ];

  return (
    <AppShell pageTitle="Resources // Disaster Battalions, Safe Havens & Logistics">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-isie-primary" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Disaster Response & Shelter Logistics
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Deployment tracking of specialized search & rescue battalions, designated safe havens, and medical corridors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="safe" size="sm">
              ASSETS READY: {resources.length}
            </TacticalBadge>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider transition-colors border ${
                categoryFilter === c.id
                  ? "bg-isie-primary/20 text-isie-primary border-isie-primary/50 font-semibold"
                  : "bg-isie-panel border-white/10 text-isie-text-muted hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
          {resources.map((res) => (
            <div
              key={res.id}
              className="p-5 bg-isie-panel border border-white/10 rounded-sm flex flex-col justify-between space-y-4 min-w-0"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-isie-cyan font-semibold">
                    {res.id}
                  </span>
                  <TacticalBadge
                    variant={
                      res.status === "DEPLOYED"
                        ? "orange"
                        : res.status === "EN_ROUTE"
                        ? "warning"
                        : "safe"
                    }
                    size="sm"
                  >
                    {res.status}
                  </TacticalBadge>
                </div>

                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1">
                  {res.name}
                </h3>
                <div className="text-xs text-isie-text-secondary flex items-center gap-1.5 mb-3">
                  <span>{res.location}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-isie-text-dim">{res.sector}</span>
                </div>

                {/* Progress of Allocation */}
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-isie-text-dim">
                    <span>CAPACITY OCCUPANCY</span>
                    <span className="text-white font-semibold">
                      {res.currentAllocated.toLocaleString()} / {res.totalCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-isie-primary rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (res.currentAllocated / res.totalCapacity) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-isie-text-dim">
                <span>CALLSIGN: {res.contactCallsign}</span>
                <span>READINESS: {res.readinessPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
