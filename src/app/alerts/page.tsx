"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { BellRing, ShieldAlert, Filter, CheckCircle2, VolumeX, Trash2, Search, ArrowRight, AlertTriangle } from "lucide-react";
import { TacticalBadge } from "@/components/ui/TacticalBadge";
import { TacticalButton } from "@/components/ui/TacticalButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { alertService } from "@/lib/services/alertService";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/lib/types/isie";

export default function AlertCenterPage() {
  const { isDemoMode } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    alertService.getActiveAlerts(isDemoMode).then((data) => {
      setAlerts(data);
      if (data.length > 0) setSelectedAlert(data[0]);
      else setSelectedAlert(null);
    });
  }, [isDemoMode]);

  const handleAcknowledge = async (id: string) => {
    await alertService.acknowledgeAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
  };

  const handleDismiss = async (id: string) => {
    await alertService.dismissAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (selectedAlert?.id === id) {
      setSelectedAlert(alerts.find((a) => a.id !== id) || null);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === "ALL" || a.severity === filterSeverity
  );

  return (
    <AppShell pageTitle="Alert Center // Tactical Warning & Multi-Agency Dispatch">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BellRing className="w-5 h-5 text-amber-400" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white">
                Strategic Alert & Early Warning Center
              </h1>
            </div>
            <p className="text-xs text-isie-text-secondary">
              Automated threshold alerts, carrying capacity breaches, road cutoffs, and multi-agency notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="critical" size="sm" pulse>
              {alerts.filter((a) => a.severity === "CRITICAL").length} CRITICAL ALARMS
            </TacticalBadge>
          </div>
        </div>

        {/* Severity Filters & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xs uppercase tracking-wider transition-colors border ${
                  filterSeverity === sev
                    ? "bg-amber-950/40 text-amber-300 border-amber-500/40 font-semibold"
                    : "bg-isie-panel border-white/10 text-isie-text-muted hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <TacticalButton
              variant="secondary"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={() => {
                alerts.forEach((a) => alertService.acknowledgeAlert(a.id));
                setAlerts((prev) => prev.map((a) => ({ ...a, status: "ACKNOWLEDGED" as const })));
              }}
            >
              ACKNOWLEDGE ALL
            </TacticalButton>
          </div>
        </div>

        {/* Main Grid: Alert List & Detail Action Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          {/* Alert Queue */}
          <div className="lg:col-span-6 min-w-0 space-y-3 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredAlerts.length === 0 ? (
              <EmptyState
                icon="alert"
                title="No Active Alerts"
                description={
                  isDemoMode
                    ? "No alerts match the selected severity filter."
                    : "No operational alerts have been dispatched in your sector."
                }
                statusText="CLEAR AIRWAVES"
              />
            ) : (
              filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-isie-panel-elevated border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-isie-panel border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-white">{alert.alertCode}</span>
                      <TacticalBadge
                        variant={
                          alert.severity === "CRITICAL"
                            ? "critical"
                            : alert.severity === "HIGH"
                            ? "orange"
                            : alert.severity === "MEDIUM"
                            ? "warning"
                            : "muted"
                        }
                        size="sm"
                        pulse={alert.severity === "CRITICAL"}
                      >
                        {alert.severity}
                      </TacticalBadge>
                      <TacticalBadge variant="muted" size="sm">
                        {alert.status}
                      </TacticalBadge>
                    </div>
                    <span className="font-mono text-[10px] text-isie-text-dim">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="font-mono text-sm font-semibold text-white mb-2 leading-snug">
                    {alert.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-isie-text-secondary font-mono">
                    <span>{alert.location}</span>
                    <span className="text-isie-cyan">{alert.sourceAgency}</span>
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Alert Detail & Dispatch Actions */}
          <div className="lg:col-span-6 min-w-0 p-4 sm:p-6 bg-isie-panel border border-white/10 rounded-sm flex flex-col justify-between">
            {selectedAlert ? (
              <div className="space-y-6 font-mono text-xs">
                <div className="pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <TacticalBadge
                      variant={
                        selectedAlert.severity === "CRITICAL"
                          ? "critical"
                          : selectedAlert.severity === "HIGH"
                          ? "orange"
                          : "warning"
                      }
                      size="md"
                    >
                      {selectedAlert.severity} // {selectedAlert.alertType}
                    </TacticalBadge>
                    <span className="text-isie-text-dim">{selectedAlert.timestamp}</span>
                  </div>

                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-2">
                    {selectedAlert.title}
                  </h2>
                  <div className="text-isie-text-secondary mt-1">
                    TARGET: {selectedAlert.location}
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xs space-y-2">
                  <div className="text-amber-300 font-bold uppercase tracking-wider">
                    Recommended Response Protocol
                  </div>
                  <p className="text-isie-text-primary leading-relaxed">
                    {selectedAlert.recommendedAction}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-isie-text-dim">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                    <div>SOURCE VERIFICATION</div>
                    <div className="text-white font-bold mt-1">{selectedAlert.sourceAgency}</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs">
                    <div>CONFIDENCE SCORE</div>
                    <div className="text-emerald-400 font-bold mt-1">
                      {(selectedAlert.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {selectedAlert.relatedEventId && (
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs flex items-center justify-between">
                    <div>
                      <span className="text-isie-text-dim block">CORRELATED CRISIS EVENT:</span>
                      <span className="text-white font-semibold">{selectedAlert.relatedEventId}</span>
                    </div>
                    <Link
                      href="/incidents"
                      className="text-isie-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>VIEW INCIDENT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {selectedAlert && (
                <>
                  <div className="flex items-center gap-2">
                    <TacticalButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcknowledge(selectedAlert.id)}
                    >
                      ACKNOWLEDGE
                    </TacticalButton>
                    <TacticalButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(selectedAlert.id)}
                    >
                      DISMISS
                    </TacticalButton>
                  </div>
                  <Link href="/resources">
                    <TacticalButton variant="secondary" size="sm">
                      DISPATCH ASSETS
                    </TacticalButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
