/**
 * ISIE - Integrated Situation Intelligence Engine
 * Tactical Notification Service
 */

import { NotificationItem } from "../types/isie";
import { DEMO_NOTIFICATIONS } from "@/data/demo/notifications";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase/client";
import { hasFreshVerifiedProvenance } from "@/lib/utils/dataQuality";

export interface INotificationService {
  getNotifications(isDemoMode?: boolean): Promise<NotificationItem[]>;
  markAsRead(notificationId: string, isDemoMode?: boolean): Promise<boolean>;
  clearAll(isDemoMode?: boolean): Promise<boolean>;
}

export class NotificationService implements INotificationService {
  private demoNotifications: NotificationItem[] = [...DEMO_NOTIFICATIONS];

  async getNotifications(isDemoMode: boolean = false): Promise<NotificationItem[]> {
    if (isDemoMode) {
      return [...this.demoNotifications];
    }
    if (!auth.currentUser) return [];

    try {
      const col = collection(db, "notifications");
      const snapshot = await getDocs(query(col));
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs
        .filter((d) => hasFreshVerifiedProvenance(d.data()))
        .map((d) => ({ id: d.id, ...(d.data() as Omit<NotificationItem, "id">) }));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, "notifications");
      throw err;
    }
  }

  async markAsRead(notificationId: string, isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      this.demoNotifications = this.demoNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      return true;
    }
    if (!auth.currentUser) return false;

    void notificationId;
    return false;
  }

  async clearAll(isDemoMode: boolean = false): Promise<boolean> {
    if (isDemoMode) {
      this.demoNotifications = [];
      return true;
    }
    return true;
  }
}

export const notificationService = new NotificationService();
