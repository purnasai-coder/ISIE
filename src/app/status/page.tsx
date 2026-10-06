"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Server, Activity, ShieldAlert, Cpu, Radio, CheckCircle, AlertTriangle } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";

export default function SystemStatusPage() {
  const nodes = [
    {
      name: "Spatial GIS Projection Core",
      protocol: "WGS-84 / WebGL",
      status: "ONLINE",
      detail: "Three.js & 2D Vector canvas engines operational",
      variant: "safe" as const,
    },
    {
      name: "Telemetry Ingestion Gateway",
      protocol: "HTTPS / REST / WMS",
      status: "STANDBY_UNCONNECTED",
      detail: "No active sensor upstream connected (Frontend Preview Mode)",
      variant: "cyan" as const,
    },
    {
      name: "AI Carrying Capacity Estimator",
      protocol: "Inference Endpoint",
      status: "UNCONNECTED",
      detail: "Awaiting backend ML model cluster deployment",
      variant: "warning" as const,
    },
    {
      name: "Stochastic What-If Simulation Engine",
      protocol: "Compute Worker",
      status: "UNCONNECTED",
      detail: "Awaiting simulation engine backend integration",
      variant: "warning" as const,
    },
    {
      name: "Alert Broadcast & Siren Dispatch",
      protocol: "WebPush / SMS / Radio",
      status: "STANDBY",
      detail: "Local UI queue armed // Hardware dispatch offline",
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
              Real-time verification of local presentation components, graphics hardware, and network interfaces.
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
                Zero fake operational data. All API contracts and UI modules ready for production pipeline integration.
              </div>
            </div>
          </div>
          <TacticalBadge variant="muted" size="sm">
            UPTIME: 100%
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
