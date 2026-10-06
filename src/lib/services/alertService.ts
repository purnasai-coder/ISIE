/**
 * ISIE - Integrated Situation Intelligence Engine
 * Tactical Warning & Alert Dispatch Service
 */

import { Alert } from "../types/isie";
import { DEMO_ALERTS } from "@/data/demo/alerts";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase/client";
import { hasFreshVerifiedProvenance } from "@/lib/utils/dataQuality";

export interface IAlertService {
  getActiveAlerts(scopeOrDemo?: string | boolean, isDemoMode?: boolean): Promise<Alert[]>;
  acknowledgeAlert(alertId: string, isDemoMode?: boolean): Promise<boolean>;
  dismissAlert(alertId: string, isDemoMode?: boolean): Promise<boolean>;
  muteAlert(alertId: string, isDemoMode?: boolean): Promise<boolean>;
}

export class AlertService implements IAlertService {
  private demoAlerts: Alert[] = [...DEMO_ALERTS];

  async getActiveAlerts(scopeOrDemo?: string | boolean, isDemoMode?: boolean): Promise<Alert[]> {
    const isDemo = typeof scopeOrDemo === "boolean" ? scopeOrDemo : (isDemoMode ?? false);
    if (isDemo) {
      return [...this.demoAlerts];
    }
    if (!auth.currentUser) return [];

    try {
      const alertsCol = collection(db, "alerts");
      const snapshot = await getDocs(query(alertsCol));
      if (snapshot.empty) {
        return [];
      }
      const alerts = snapshot.docs
        .filter((d) => hasFreshVerifiedProvenance(d.data()))
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Alert, "id">) }));
      const uniqueAlerts = new Map<string, Alert>();
      for (const alert of alerts) {
        const dedupeKey = [
          alert.relatedEventId || alert.location,
          alert.alertType,
          alert.alertCode,
        ].join(":");
        if (!uniqueAlerts.has(dedupeKey)) uniqueAlerts.set(dedupeKey, alert);
      }
      return [...uniqueAlerts.values()];
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, "alerts");
      throw err;
    }
  }

  async acknowledgeAlert(alertId: string, isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      this.demoAlerts = this.demoAlerts.map((a) =>
        a.id === alertId ? { ...a, status: "ACKNOWLEDGED" as const } : a
      );
      return true;
    }
    if (!auth.currentUser) return false;

    void alertId;
    return false;
  }

  async dismissAlert(alertId: string, isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      this.demoAlerts = this.demoAlerts.filter((a) => a.id !== alertId);
      return true;
    }
    if (!auth.currentUser) return false;

    void alertId;
    return false;
  }

  async muteAlert(alertId: string, isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      this.demoAlerts = this.demoAlerts.map((a) =>
        a.id === alertId ? { ...a, status: "MUTED" as const } : a
      );
      return true;
    }
    if (!auth.currentUser) return false;

    void alertId;
    return false;
  }
}

export const alertService = new AlertService();
