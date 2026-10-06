"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, HeartPulse, Droplets, Truck, AlertTriangle, ArrowRight } from "lucide-react";
import { TacticalBadge } from "../ui/TacticalBadge";
import { EmptyState } from "../ui/EmptyState";
import { riskService } from "@/lib/services/riskService";
import { CarryingCapacityMetrics, RelocationIntelligence } from "@/lib/types/isie";
import { useAuth } from "@/lib/auth/AuthContext";

interface RightIntelPanelProps {
  className?: string;
}

export const RightIntelPanel: React.FC<RightIntelPanelProps> = ({ className = "" }) => {
  const { isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<"CAPACITY" | "RELOCATION" | "SUMMARY">("CAPACITY");
  const [capacity, setCapacity] = useState<CarryingCapacityMetrics | null>(null);
  const [relocations, setRelocations] = useState<RelocationIntelligence[]>([]);

  useEffect(() => {
    riskService.getCarryingCapacityAssessment(undefined, isDemoMode).then(setCapacity);
    riskService.getRelocationPriorities(undefined, isDemoMode).then(setRelocations);
  }, [isDemoMode]);

  return (
    <div
      className={`flex flex-col h-full min-h-0 min-w-0 bg-isie-panel select-none ${className}`}
    >
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-white/10 bg-isie-panel-light/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Activity className="w-4 h-4 text-isie-cyan shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-isie-text-primary truncate">
              Impact & Decision
            </span>
            <span className="text-[10px] font-mono text-isie-text-dim truncate">
              CAPACITY & RELOCATION MATRIX
            </span>
          </div>
        </div>
        <TacticalBadge variant="cyan" size="sm" className="shrink-0">
          {isDemoMode ? "SYNTHETIC" : "OPERATIONAL"}
        </TacticalBadge>
      </div>

      {/* Module Selector Tabs with Breathing Room */}
      <div className="flex border-b border-white/10 bg-isie-bg-surface/40 text-[11px] font-mono shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab("CAPACITY")}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === "CAPACITY"
              ? "border-isie-cyan text-isie-cyan font-bold bg-sky-950/25"
              : "border-transparent text-isie-text-muted hover:text-white hover:bg-white/5"
          }`}
        >
          CAPACITY (M-02)
        </button>
        <button
          onClick={() => setActiveTab("RELOCATION")}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === "RELOCATION"
              ? "border-isie-primary text-isie-primary font-bold bg-orange-950/25"
              : "border-transparent text-isie-text-muted hover:text-white hover:bg-white/5"
          }`}
        >
          RELOCATION (M-03)
        </button>
        <button
          onClick={() => setActiveTab("SUMMARY")}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === "SUMMARY"
              ? "border-white text-white font-bold bg-white/10"
              : "border-transparent text-isie-text-muted hover:text-white hover:bg-white/5"
          }`}
        >
          EARLY WARNING
        </button>
      </div>

      {/* Main Panel Content with Scroll Containment */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
        {activeTab === "CAPACITY" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between font-mono text-xs text-isie-text-muted px-0.5">
              <span className="truncate uppercase font-medium">CHAMOLI SECTOR MATRIX</span>
              <span className="text-red-400 font-bold shrink-0 ml-2">DEFICIT CRITICAL</span>
            </div>

            {/* Carrying Capacity Metrics with Generous Padding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 font-mono text-xs">
              {/* Shelter Load */}
              <div className="p-3 bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-amber-500/40 rounded-sm flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between text-isie-text-dim text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-isie-cyan shrink-0" />
                    <span className="truncate">SHELTER LOAD</span>
                  </div>
                  <span className="text-red-400 font-bold text-[10px]">
                    -{capacity?.populationExposure.capacityDeficitPercentage}%
                  </span>
                </div>
                <div className="text-sm font-bold text-amber-300 mb-1.5 truncate">
                  {capacity?.populationExposure.currentShelterCapacity.toLocaleString()} BEDS
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "72%" }} />
                </div>
                <div className="text-[10px] text-isie-text-dim truncate">
                  Pop: {capacity?.populationExposure.totalHabitationPopulation.toLocaleString()}
                </div>
              </div>

              {/* Hospital Beds */}
              <div className="p-3 bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-red-500/40 rounded-sm flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between text-isie-text-dim text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <HeartPulse className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">HOSPITAL SURGE</span>
                  </div>
                  <span className="text-amber-400 text-[10px]">
                    {capacity?.healthcareAvailability.criticalMedicineSupplyDays}D MEDS
                  </span>
                </div>
                <div className="text-sm font-bold text-red-300 mb-1.5 truncate">
                  {capacity?.healthcareAvailability.districtHospitalBedOccupancy}% LOAD
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${capacity?.healthcareAvailability.districtHospitalBedOccupancy || 88}%` }}
                  />
                </div>
                <div className="text-[10px] text-isie-text-dim truncate">
                  Status: ICU Saturated
                </div>
              </div>

              {/* Potable Water Buffer */}
              <div className="p-3 bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-sky-500/40 rounded-sm flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between text-isie-text-dim text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">WATER BUFFER</span>
                  </div>
                  <span className="text-sky-300 text-[10px]">CWC GAUGE</span>
                </div>
                <div className="text-sm font-bold text-sky-300 mb-1.5 truncate">
                  {capacity?.resourceReserves.potableWaterHoursRemaining} HOURS
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: "45%" }} />
                </div>
                <div className="text-[10px] text-isie-text-dim truncate">
                  Tankers Dispatched: 18
                </div>
              </div>

              {/* Road Access Integrity */}
              <div className="p-3 bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-amber-500/40 rounded-sm flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between text-isie-text-dim text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">CORRIDORS</span>
                  </div>
                  <span className="text-red-400 font-bold text-[10px]">
                    {capacity?.infrastructureIntegrity.bridgesAtRiskCount} CUTOFF
                  </span>
                </div>
                <div className="text-sm font-bold text-amber-300 mb-1.5 truncate">
                  {capacity?.infrastructureIntegrity.criticalRoadsOperational}% PASSABLE
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${capacity?.infrastructureIntegrity.criticalRoadsOperational || 35}%` }}
                  />
                </div>
                <div className="text-[10px] text-isie-text-dim truncate">
                  NH-58 Route Restricted
                </div>
              </div>
            </div>

            {/* Immediate Decision Recommendation Box */}
            <div className="p-3.5 bg-red-950/20 border-l-4 border-l-red-500 border-white/10 rounded-sm text-xs font-mono">
              <div className="text-red-300 font-bold uppercase mb-1.5 tracking-wider text-[11px] flex items-center justify-between">
                <span>Immediate Decision Support</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <p className="text-[11px] text-isie-text-secondary leading-relaxed break-words">
                Direct evacuation traffic off damaged Raini Bridge toward Helang bypass corridor. Deploy Mobile Medical Unit 4 to Pipalkoti shelter haven.
              </p>
            </div>
          </div>
        )}

        {activeTab === "RELOCATION" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-isie-text-muted px-0.5">
              <span>PRIORITIZED RELOCATION QUEUE</span>
              <span className="text-isie-primary font-bold">MODULE 03</span>
            </div>

            <div className="space-y-2.5">
              {relocations.map((reloc) => (
                <div
                  key={reloc.zoneId}
                  className="p-3 bg-white/[0.025] hover:bg-white/[0.045] border-l-4 border-l-isie-primary/70 border-white/10 rounded-sm font-mono text-xs space-y-1.5 transition-colors"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-white truncate">
                      #{reloc.priorityRank} {reloc.zoneName}
                    </span>
                    <span className="text-isie-primary font-bold shrink-0">
                      INDEX: {reloc.relocationPriorityScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-isie-text-dim truncate">
                    DESTINATION: {reloc.designatedShelters[0]?.name}
                  </div>
                  <div className="text-[11px] text-emerald-400 truncate">
                    TRANSIT: {reloc.estimatedTransitTimeHours}H VIA {reloc.evacuationRoutesIdentified[0]?.corridorName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "SUMMARY" && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-xs text-isie-text-muted px-0.5">
              <span>CROSS-DOMAIN EARLY WARNING</span>
              <span className="text-amber-400 font-bold">2 ESCALATIONS</span>
            </div>

            <div className="p-3.5 bg-amber-950/20 border-l-4 border-l-amber-500 border-white/10 rounded-sm space-y-1.5">
              <div className="text-amber-300 font-bold leading-tight flex items-center justify-between">
                <span>DHAULIGANGA HYDROGRAPH SURGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-isie-text-secondary leading-relaxed break-words">
                CWC gauge sensor rate-of-rise: 0.85m/min. Red-zone perimeter expanding downstream toward Helang.
              </p>
            </div>

            <div className="p-3.5 bg-sky-950/20 border-l-4 border-l-sky-500 border-white/10 rounded-sm space-y-1.5">
              <div className="text-isie-cyan font-bold leading-tight flex items-center justify-between">
                <span>CYCLONE VARUN TRACK INWARD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-isie-text-secondary leading-relaxed break-words">
                Landfall estimated in 14 hours. Pre-positioning 8 coastal rescue battalions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/10 bg-isie-panel-light/20 flex items-center justify-between text-[11px] font-mono text-isie-text-dim shrink-0">
        <span>MODEL: ENSEMBLE V2.4</span>
        <Link href="/analytics" className="text-isie-cyan hover:underline font-semibold flex items-center gap-1">
          <span>DEEP ANALYTICS</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
