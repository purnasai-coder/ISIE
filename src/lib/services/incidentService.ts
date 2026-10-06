/**
 * ISIE - Integrated Situation Intelligence Engine
 * Canonical Operational Incident Service
 * 
 * Manages operational crisis incidents, multi-module cascades, and real-time Firestore synchronization.
 * Strictly separates Demo Mode (synthetic in-memory data) from Real Authenticated User operational data.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase/client";
import { IntelligenceEvent, Alert, HazardRedZone, TimelineEvent, NotificationItem } from "@/lib/types/isie";
import { DEMO_INCIDENTS } from "@/data/demo/incidents";
import { AuthUser } from "@/lib/auth/AuthContext";
import { hasPermission } from "@/lib/auth/roles";

export interface CreateIncidentInput {
  title: string;
  incidentType?: string;
  category: IntelligenceEvent["category"];
  severity: IntelligenceEvent["severity"];
  status?: IntelligenceEvent["status"];
  summary: string;
  locationName: string;
  country?: string;
  affectedState?: string;
  affectedDistrict?: string;
  region?: string;
  coordinates: { lat: number; lng: number; elevationMeters?: number };
  populationAtRisk: number;
  affectedAreaKm2?: number;
  infrastructureImpact?: string;
  criticalFacilitiesAffected?: number;
  source: string;
  sourceAgencies?: string[];
  confidence?: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  confidenceScore?: number;
  detectionTime?: string;
  additionalNotes?: string;
  relocationScore?: number;
  hazardZoneLevel?: IntelligenceEvent["hazardZoneLevel"];
  carryingCapacityStatus?: IntelligenceEvent["carryingCapacityStatus"];
  escalationRisk?: IntelligenceEvent["escalationRisk"];
}

export class IncidentService {
  /**
   * Fetch active incidents.
   * If isDemoMode is true, strictly returns static synthetic incidents.
   * If isDemoMode is false, queries real operational Firestore incidents.
   */
  async getIncidents(isDemoMode: boolean = true): Promise<IntelligenceEvent[]> {
    if (isDemoMode || !auth.currentUser) {
      return [...DEMO_INCIDENTS];
    }

    try {
      const incidentsCol = collection(db, "incidents");
      const q = query(incidentsCol);
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return [];
      }

      const incidents: IntelligenceEvent[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          eventCode: data.eventCode || docSnap.id,
          title: data.title || "Untitled Incident",
          category: data.category || "HYDROMETEOROLOGICAL",
          severity: data.severity || "MEDIUM",
          status: data.status || "ACTIVE",
          timestamp: data.timestamp || new Date().toISOString(),
          locationName: data.locationName || "Unknown Sector",
          region: data.region || "Operational Sector",
          coordinates: data.coordinates || { lat: 22.5, lng: 78.9 },
          confidenceScore: data.confidenceScore ?? 0.9,
          sourceCount: data.sourceCount ?? (data.sourceAgencies?.length || 1),
          sourceAgencies: data.sourceAgencies || ["Operational Telemetry"],
          verificationStatus: data.verificationStatus || "VERIFIED_BY_AUTHORITY",
          summary: data.summary || "",
          affectedHabitationsCount: data.affectedHabitationsCount ?? 0,
          populationAtRisk: data.populationAtRisk ?? 0,
          hazardZoneLevel: data.hazardZoneLevel || "RED_ZONE",
          carryingCapacityStatus: data.carryingCapacityStatus || "WARNING",
          relocationScore: data.relocationScore ?? 50,
          escalationRisk: data.escalationRisk || "ELEVATED",
          evidenceIds: data.evidenceIds || [],
        };
      });

      return incidents;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, "incidents");
      return [...DEMO_INCIDENTS];
    }
  }

  /**
   * Fetch single incident by ID
   */
  async getIncidentById(id: string, isDemoMode: boolean = true): Promise<IntelligenceEvent | null> {
    if (isDemoMode || !auth.currentUser) {
      return DEMO_INCIDENTS.find((i) => i.id === id) || null;
    }

    try {
      const docRef = doc(db, "incidents", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...(docSnap.data() as Omit<IntelligenceEvent, "id">) };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `incidents/${id}`);
      return null;
    }
  }

  /**
   * Subscribe to real-time incident changes
   */
  subscribeIncidents(
    arg1: boolean | ((incidents: IntelligenceEvent[]) => void),
    arg2?: boolean | ((incidents: IntelligenceEvent[]) => void),
    onError?: (err: Error) => void
  ): () => void {
    const callback = typeof arg1 === "function" ? arg1 : (typeof arg2 === "function" ? arg2 : () => {});
    const isDemoMode = typeof arg1 === "boolean" ? arg1 : (typeof arg2 === "boolean" ? arg2 : false);

    // If demo mode or unauthenticated, deliver demo incidents directly without attaching Firestore listener
    if (isDemoMode || !auth.currentUser) {
      callback([...DEMO_INCIDENTS]);
      return () => {};
    }

    try {
      const incidentsCol = collection(db, "incidents");
      const unsubscribe = onSnapshot(
        incidentsCol,
        (snapshot) => {
          const firestoreList: IntelligenceEvent[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<IntelligenceEvent, "id">),
          }));
          if (firestoreList.length > 0) {
            callback(firestoreList);
          } else {
            callback([]);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, "incidents");
          onError?.(error);
          callback([...DEMO_INCIDENTS]);
        }
      );
      return unsubscribe;
    } catch (err: any) {
      handleFirestoreError(err, OperationType.LIST, "incidents");
      callback([...DEMO_INCIDENTS]);
      return () => {};
    }
  }

  subscribeToIncidents = this.subscribeIncidents;

  /**
   * Create an operational incident in Firestore with atomic multi-agency cascades
   */
  async createIncident(
    input: CreateIncidentInput,
    creator: AuthUser
  ): Promise<{ success: boolean; incidentId?: string; error?: string }> {
    // RBAC validation
    if (!creator) {
      return { success: false, error: "Authentication required to create incident." };
    }

    if (!hasPermission(creator.role, "canCreateIncident")) {
      return { success: false, error: `Unauthorized: User role '${creator.role}' lacks permission to create operational incidents.` };
    }

    // Strict Data Validation (Reject malformed coordinates or incomplete records)
    if (!input.title || input.title.trim().length < 3) {
      return { success: false, error: "Validation Error: Incident title must be at least 3 characters." };
    }

    const lat = Number(input.coordinates?.lat);
    const lng = Number(input.coordinates?.lng);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return { success: false, error: "Validation Error: Latitude must be a valid number between -90 and 90 degrees." };
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return { success: false, error: "Validation Error: Longitude must be a valid number between -180 and 180 degrees." };
    }

    if (!input.locationName || input.locationName.trim().length < 2) {
      return { success: false, error: "Validation Error: Location name is required." };
    }

    if (!input.source || input.source.trim().length < 2) {
      return { success: false, error: "Validation Error: Authoritative intelligence source is required." };
    }

    try {
      const now = new Date().toISOString();
      const codeSuffix = Math.floor(1000 + Math.random() * 9000);
      const incidentId = `INC-${new Date().getFullYear()}-${codeSuffix}`;
      const eventCode = `EVT-${(input.category || "HYD").slice(0, 3)}-${codeSuffix}`;

      const stateName = input.affectedState?.trim() || "Uttarakhand";
      const districtName = input.affectedDistrict?.trim() || "Chamoli";
      const regionName = input.region?.trim() || `${districtName} Sector, ${stateName}`;

      const incidentData: Omit<IntelligenceEvent, "id"> & {
        createdBy: string;
        createdByName: string;
        createdAt: string;
        updatedBy: string;
        updatedAt: string;
      } = {
        eventCode,
        title: input.title.trim(),
        incidentType: input.incidentType || "Flood",
        category: input.category || "NATURAL_HAZARD",
        severity: input.severity,
        status: input.status || "ACTIVE",
        timestamp: `${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC`,
        locationName: input.locationName.trim(),
        country: input.country?.trim() || "India",
        state: stateName,
        district: districtName,
        region: regionName,
        coordinates: {
          lat,
          lng,
          elevationMeters: input.coordinates.elevationMeters,
        },
        confidence: input.confidence || "HIGH",
        confidenceScore: input.confidenceScore ?? (input.confidence === "VERY_HIGH" ? 0.98 : input.confidence === "HIGH" ? 0.92 : input.confidence === "MODERATE" ? 0.75 : 0.6),
        source: input.source.trim(),
        sourceCount: (input.sourceAgencies?.length || 1),
        sourceAgencies: input.sourceAgencies?.length ? input.sourceAgencies : [input.source.trim(), creator.organization || "Command Center"],
        verificationStatus: input.status === "VERIFIED" || input.status === "ACTIVE" ? "VERIFIED_BY_AUTHORITY" : "AWAITING_VERIFICATION",
        detectionTime: input.detectionTime || now,
        summary: input.summary ? input.summary.trim() : `Operational situation registered for ${input.locationName}.`,
        additionalNotes: input.additionalNotes?.trim() || "",
        affectedHabitationsCount: Math.max(1, Math.round(Number(input.populationAtRisk || 0) / 3000)),
        populationAtRisk: Number(input.populationAtRisk) || 0,
        affectedAreaKm2: Number(input.affectedAreaKm2) || 0,
        infrastructureImpact: input.infrastructureImpact?.trim() || "",
        criticalFacilitiesAffected: Number(input.criticalFacilitiesAffected) || 0,
        hazardZoneLevel: input.hazardZoneLevel || (input.severity === "CRITICAL" ? "RED_ZONE" : "WARNING_ZONE"),
        carryingCapacityStatus: input.carryingCapacityStatus || (input.severity === "CRITICAL" ? "CRITICAL" : "WARNING"),
        relocationScore: input.relocationScore ?? (input.severity === "CRITICAL" ? 90 : input.severity === "HIGH" ? 75 : 50),
        escalationRisk: input.escalationRisk || (input.severity === "CRITICAL" ? "EXTREME" : "ELEVATED"),
        evidenceIds: [],
        createdBy: creator.id,
        createdByName: creator.name,
        createdAt: now,
        updatedBy: creator.id,
        updatedAt: now,
        auditLog: [
          {
            timestamp: now,
            action: "INITIAL_REGISTRATION",
            performedBy: `${creator.name} (${creator.role})`,
            details: `Operational incident initialized. Severity: ${input.severity}, Status: ${input.status || "ACTIVE"}`,
          },
        ],
      };

      // 1. Store core incident in Firestore (ONE Canonical Record)
      await setDoc(doc(db, "incidents", incidentId), incidentData);

      // 2. Cascade: Create linked alert if MODERATE, HIGH, or CRITICAL
      if (input.severity === "CRITICAL" || input.severity === "HIGH" || input.severity === "MODERATE" || input.severity === "MEDIUM") {
        const alertId = `ALT-${incidentId.replace("INC-", "")}`;
        const alertData: Alert = {
          id: alertId,
          alertCode: `ALR-${codeSuffix}`,
          title: `OPERATIONAL ALERT: ${input.title}`,
          severity: input.severity,
          alertType: input.severity === "CRITICAL" ? "HAZARD_SURGE" : "EARLY_WARNING",
          location: input.locationName,
          timestamp: "Just now",
          sourceAgency: creator.organization || "Tactical Command",
          confidenceScore: incidentData.confidenceScore,
          status: "ACTIVE",
          relatedEventId: incidentId,
          recommendedAction: `Deploy first responders to ${input.locationName}. Enact evacuation tier for vulnerable habitations.`,
        };
        await setDoc(doc(db, "alerts", alertId), alertData);
      }

      // 3. Cascade: Create baseline timeline anchor referencing canonical incidentId
      const timelineId = `TL-${incidentId.replace("INC-", "")}`;
      const timelineData: TimelineEvent = {
        id: timelineId,
        timestamp: `${new Date().toLocaleDateString("en-GB")} (T-0 / CURRENT)`,
        title: input.title,
        category: input.category,
        severity: input.severity,
        phase: "CURRENT_OBSERVATION",
        summary: `Incident logged and verified. Classification: ${input.incidentType || input.category}. Population at risk: ${(Number(input.populationAtRisk) || 0).toLocaleString()}. Source: ${input.source}.`,
        coordinates: incidentData.coordinates,
        relatedZoneId: incidentId,
      };
      await setDoc(doc(db, "timelines", timelineId), timelineData);

      // 4. Cascade: Create Hazard Red Zone record for Risk Intelligence
      const zoneData: HazardRedZone = {
        id: incidentId,
        zoneCode: incidentId,
        name: `${input.title} Impact Zone`,
        classification: incidentData.hazardZoneLevel || "RED_ZONE",
        hazardType: (input.incidentType?.toUpperCase().includes("CYCLONE") ? "CYCLONE" : input.incidentType?.toUpperCase().includes("LANDSLIDE") ? "LANDSLIDE" : "FLOOD") as any,
        district: districtName,
        state: stateName,
        coordinates: incidentData.coordinates,
        populationExposed: incidentData.populationAtRisk,
        carryingCapacityStatus: incidentData.carryingCapacityStatus || "CRITICAL",
        relocationPriorityScore: incidentData.relocationScore || 85,
        lastAssessmentTimestamp: now,
        sourceAgencies: incidentData.sourceAgencies,
      };
      await setDoc(doc(db, "hazard_zones", incidentId), zoneData);

      // 5. Cascade: Create broadcast notification
      const notifId = `NOTIF-${codeSuffix}`;
      const notifData: NotificationItem = {
        id: notifId,
        title: `OPERATIONAL DISPATCH: ${input.title}`,
        message: `${input.locationName} (${districtName}) flagged as ${input.severity} severity by ${creator.name}.`,
        category: input.severity === "CRITICAL" ? "CRITICAL_ALERT" : "INTEL_UPDATE",
        timestamp: "Just now",
        read: false,
        priority: input.severity === "CRITICAL" ? "HIGH" : "NORMAL",
        actionUrl: "/incidents",
      };
      await setDoc(doc(db, "notifications", notifId), notifData);

      return { success: true, incidentId };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, "incidents");
      return { success: false, error: err?.message || "Failed to persist operational incident to Firestore." };
    }
  }

  /**
   * Update incident fields in Firestore with audit tracking
   */
  async updateIncident(id: string, updates: Partial<IntelligenceEvent>, actor?: AuthUser): Promise<boolean> {
    try {
      const docRef = doc(db, "incidents", id);
      const now = new Date().toISOString();
      const snap = await getDoc(docRef);
      const existingAudit = snap.exists() ? (snap.data()?.auditLog || []) : [];

      const newAuditEntry = {
        timestamp: now,
        action: "RECORD_MODIFIED",
        performedBy: actor ? `${actor.name} (${actor.role})` : "System Operator",
        details: `Updated fields: ${Object.keys(updates).join(", ")}`,
      };

      await updateDoc(docRef, {
        ...updates,
        updatedBy: actor?.id || "operator",
        updatedAt: now,
        auditLog: [...existingAudit, newAuditEntry],
      });
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `incidents/${id}`);
      return false;
    }
  }

  /**
   * Update incident status with audit tracking and timeline event creation
   */
  async updateIncidentStatus(
    id: string,
    newStatus: IntelligenceEvent["status"],
    notes: string,
    actor: AuthUser
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(db, "incidents", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { success: false, error: "Incident document not found." };
      }

      const currentData = snap.data();
      const previousStatus = currentData.status;
      const now = new Date().toISOString();
      const existingAudit = currentData.auditLog || [];

      const auditEntry = {
        timestamp: now,
        action: `STATUS_CHANGED_${newStatus}`,
        performedBy: `${actor.name} (${actor.role})`,
        details: `Status transitioned from ${previousStatus} to ${newStatus}. Notes: ${notes || "No additional commentary"}`,
      };

      await updateDoc(docRef, {
        status: newStatus,
        updatedBy: actor.id,
        updatedAt: now,
        auditLog: [...existingAudit, auditEntry],
      });

      // Add timeline event for status change
      const timelineId = `TL-${id.replace("INC-", "")}-${Date.now().toString().slice(-4)}`;
      const timelineData: TimelineEvent = {
        id: timelineId,
        timestamp: `${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC`,
        title: `Status: ${previousStatus} → ${newStatus}`,
        category: currentData.category || "HYDROMETEOROLOGICAL",
        severity: currentData.severity || "MEDIUM",
        phase: newStatus === "RESOLVED" || newStatus === "CONTAINED" ? "PROJECTED_WINDOW" : "CURRENT_OBSERVATION",
        summary: `Status updated by ${actor.name}. ${notes || "Operational posture adjusted."}`,
        coordinates: currentData.coordinates,
        relatedZoneId: id,
      };
      await setDoc(doc(db, "timelines", timelineId), timelineData);

      return { success: true };
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `incidents/${id}`);
      return { success: false, error: err?.message || "Failed to update incident status." };
    }
  }
}

export const incidentService = new IncidentService();
