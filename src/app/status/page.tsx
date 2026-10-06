"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Server, Activity, ShieldAlert, Cpu, Radio, CheckCircle, AlertTriangle } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";

export default function SystemStatusPage() {
  const nodes = [
    {
      name: "Spatial GIS Projection Core",
      protocol: "WebGL presentation",
      status: "PRESENTATION_ONLY",
      detail: "Static map illustration; no verified operational spatial feed is connected.",
      variant: "muted" as const,
    },
    {
      name: "Telemetry Ingestion Gateway",
      protocol: "Not configured",
      status: "UNAVAILABLE",
      detail: "No sensor or provider adapter is configured.",
      variant: "warning" as const,
    },
    {
      name: "AI Carrying Capacity Estimator",
      protocol: "Prototype arithmetic",
      status: "NOT OPERATIONAL",
      detail: "Prototype analysis only; no validated model or live input integration is configured.",
      variant: "warning" as const,
    },
    {
      name: "Stochastic What-If Simulation Engine",
      protocol: "Python prototype",
      status: "NOT CONNECTED",
      detail: "Simulation endpoint is separate from the frontend and requires a trusted auth adapter.",
      variant: "warning" as const,
    },
    {
      name: "Alert Broadcast & Siren Dispatch",
      protocol: "Not configured",
      status: "NO DISPATCH",
      detail: "No automated alert generation, notification, or external dispatch is configured.",
      variant: "muted" as const,
    },
  ];

  return (
    <AppShell pageTitle="System Status // Node Diagnostics & Sensor Telemetry Pipeline">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-5 h-5 text-isie-cyan" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Cluster Architecture Diagnostics
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Static status summary only. No real-time health checks are performed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="cyan" size="sm" pulse>
              FRONTEND PREVIEW ACTIVE
            </TacticalBadge>
          </div>
        </div>

        {/* Global System Health Summary Banner */}
        <div className="p-4 bg-isie-panel border border-white/10 rounded-sm font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
            <div>
              <div className="text-white font-semibold uppercase tracking-wider">
                System Mode: Frontend Preview // Non-Operational Standby
              </div>
              <div className="text-[11px] text-isie-text-dim mt-0.5">
                No operational provider, persistence, or audit pipeline is currently configured.
              </div>
            </div>
          </div>
          <TacticalBadge variant="muted" size="sm">
            MONITORING: UNAVAILABLE
          </TacticalBadge>
        </div>

        {/* Node Health List */}
        <div className="space-y-3 font-mono text-xs">
          {nodes.map((node, i) => (
            <div
              key={i}
              className="p-4 bg-isie-panel border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold tracking-wider">
                    {node.name}
                  </span>
                  <span className="text-[10px] text-isie-text-dim">[{node.protocol}]</span>
                </div>
                <div className="text-[11px] text-isie-text-secondary mt-1">
                  {node.detail}
                </div>
              </div>

              <TacticalBadge variant={node.variant} size="sm">
                {node.status}
              </TacticalBadge>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
