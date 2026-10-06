"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Activity, TrendingUp, ShieldAlert, BarChart3, PieChart, Users, HeartPulse, Droplets, Truck } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { riskService } from "@/lib/services/riskService";
import { CarryingCapacityMetrics, HazardRedZone, RelocationIntelligence } from "@/lib/types/isie";

export default function AnalyticsPage() {
  const [redZones, setRedZones] = useState<HazardRedZone[]>([]);
  const [capacity, setCapacity] = useState<CarryingCapacityMetrics | null>(null);
  const [relocations, setRelocations] = useState<RelocationIntelligence[]>([]);

  useEffect(() => {
    riskService.getHazardRedZones().then(setRedZones);
    riskService.getCarryingCapacityAssessment().then(setCapacity);
    riskService.getRelocationPriorities().then(setRelocations);
  }, []);

  return (
    <AppShell pageTitle="Analytics // Carrying Capacity Stress & Relocation Priority Scoring">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-isie-cyan" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Strategic Analytics & Decision Intelligence
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Quantitative modeling across carrying capacity stress indices, infrastructure chokepoints, and relocation queues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="cyan" size="sm">
              ANALYTIC RUN: LIVE SYNTHETIC
            </TacticalBadge>
          </div>
        </div>

        {/* High-Level Analytical KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">RED ZONE POPULATION</span>
              <Users className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {redZones
                .reduce((acc, z) => acc + (z.classification === "RED_ZONE" ? z.populationExposed : 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-[10px] text-red-400">IMMEDIATE HAZARD PERIMETER</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">SHELTER CAPACITY DEFICIT</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 mb-1">
              {capacity?.populationExposure.capacityDeficitPercentage || 71.8}%
            </div>
            <div className="text-[10px] text-isie-text-dim">DEFICIT IN ACUTE SECTORS</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">POTABLE WATER BUFFER</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-sky-300 mb-1">
              {capacity?.resourceReserves.potableWaterHoursRemaining || 28} HRS
            </div>
            <div className="text-[10px] text-isie-text-dim">RESERVES DEPLETION HORIZON</div>
          </div>

          <div className="p-4 bg-isie-panel border border-white/10 rounded-sm">
            <div className="flex items-center justify-between text-isie-text-muted mb-2">
              <span className="text-[10px] tracking-wider uppercase">MAX RELOCATION PRIORITY</span>
              <TrendingUp className="w-4 h-4 text-isie-primary" />
            </div>
            <div className="text-2xl font-bold text-isie-primary mb-1">
              94 <span className="text-sm font-normal text-white/50">/ 100</span>
            </div>
            <div className="text-[10px] text-isie-primary">TIER 1 EMERGENCY</div>
          </div>
        </div>

        {/* Carrying Capacity (Module 02) & Relocation (Module 03) Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Module 02: Infrastructure & Carrying Capacity Stress */}
          <div className="p-5 bg-isie-panel border border-white/10 rounded-sm space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  Module 02 // Carrying Capacity Assessment Matrix
                </h3>
                <p className="text-[11px] text-isie-text-dim">
                  Multi-factor resource reserves vs population demand
                </p>
              </div>
              <TacticalBadge variant="critical" size="sm">
                CRITICAL SATURATION
              </TacticalBadge>
            </div>

            {/* Stress Progress Bars */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between text-isie-text-secondary mb-1">
                  <span>HOSPITAL BED OCCUPANCY</span>
                  <span className="text-red-400 font-bold">88% (CRITICAL)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-isie-text-secondary mb-1">
                  <span>ROAD NETWORK ARTERIAL CLEARANCE</span>
                  <span className="text-amber-400 font-bold">35% OPEN (65% SEVERED)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-isie-text-secondary mb-1">
                  <span>EMERGENCY RELIEF SHELTER LOAD</span>
                  <span className="text-amber-400 font-bold">82% OCCUPIED</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "82%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-isie-text-secondary mb-1">
                  <span>TELECOMMUNICATIONS CELL INTEGRITY</span>
                  <span className="text-sky-400 font-bold">60% OPERATIONAL</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Module 03: Relocation Priority Triage Table */}
          <div className="p-5 bg-isie-panel border border-white/10 rounded-sm space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  Module 03 // Relocation Priority Scoring
                </h3>
                <p className="text-[11px] text-isie-text-dim">
                  Objective prioritization derived from hazard severity & route severance
                </p>
              </div>
              <TacticalBadge variant="orange" size="sm">
                PRIORITIZED
              </TacticalBadge>
            </div>

            <div className="space-y-3">
              {relocations.map((reloc) => (
                <div
                  key={reloc.zoneId}
                  className="p-3 bg-white/[0.02] border border-white/10 rounded-xs space-y-2 font-mono text-xs min-w-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <span className="px-1.5 py-0.5 bg-isie-primary/20 text-isie-primary border border-isie-primary/40 font-bold rounded-xs shrink-0">
                        RANK #{reloc.priorityRank}
                      </span>
                      <span className="font-bold text-white truncate">{reloc.zoneName}</span>
                    </div>
                    <span className="text-red-400 font-bold text-sm shrink-0">
                      INDEX: {reloc.relocationPriorityScore}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-isie-text-dim gap-1">
                    <span>TRANSIT: {reloc.estimatedTransitTimeHours} HRS</span>
                    <span className="truncate">SHELTER: {reloc.designatedShelters[0]?.name}</span>
                  </div>

                  <div className="text-[10px] text-amber-400 truncate">
                    STATUS: {reloc.evacuationRoutesIdentified[0]?.corridorName} (
                    {reloc.evacuationRoutesIdentified[0]?.status})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
