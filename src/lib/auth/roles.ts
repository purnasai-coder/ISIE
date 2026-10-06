/**
 * ISIE - Integrated Situation Intelligence Engine
 * Centralized Role-Based Access Control (RBAC) Architecture
 */

export type UserRole = "ADMIN" | "OPERATOR" | "ANALYST" | "VIEWER" | "DEMO_USER";

export interface RolePermissions {
  canCreateIncident: boolean;
  canEditIncident: boolean;
  canUpdateIncident: boolean;
  canDeleteIncident: boolean;
  canVerifyEvidence: boolean;
  canCreateAlert: boolean;
  canAcknowledgeAlerts: boolean;
  canUpdateCapacity: boolean;
  canAllocateResources: boolean;
  canManageUsers: boolean;
  canAccessSimulations: boolean;
}

const ROLE_PERMISSIONS_MAP: Record<UserRole, RolePermissions> = {
  ADMIN: {
    canCreateIncident: true,
    canEditIncident: true,
    canUpdateIncident: true,
    canDeleteIncident: true,
    canVerifyEvidence: true,
    canCreateAlert: true,
    canAcknowledgeAlerts: true,
    canUpdateCapacity: true,
    canAllocateResources: true,
    canManageUsers: true,
    canAccessSimulations: true,
  },
  OPERATOR: {
    canCreateIncident: true,
    canEditIncident: true,
    canUpdateIncident: true,
    canDeleteIncident: false,
    canVerifyEvidence: true,
    canCreateAlert: true,
    canAcknowledgeAlerts: true,
    canUpdateCapacity: true,
    canAllocateResources: true,
    canManageUsers: false,
    canAccessSimulations: true,
  },
  ANALYST: {
    canCreateIncident: false,
    canEditIncident: true,
    canUpdateIncident: true,
    canDeleteIncident: false,
    canVerifyEvidence: true,
    canCreateAlert: false,
    canAcknowledgeAlerts: true,
    canUpdateCapacity: true,
    canAllocateResources: false,
    canManageUsers: false,
    canAccessSimulations: true,
  },
  VIEWER: {
    canCreateIncident: false,
    canEditIncident: false,
    canUpdateIncident: false,
    canDeleteIncident: false,
    canVerifyEvidence: false,
    canCreateAlert: false,
    canAcknowledgeAlerts: false,
    canUpdateCapacity: false,
    canAllocateResources: false,
    canManageUsers: false,
    canAccessSimulations: false,
  },
  DEMO_USER: {
    canCreateIncident: false,
    canEditIncident: false,
    canUpdateIncident: false,
    canDeleteIncident: false,
    canVerifyEvidence: false,
    canCreateAlert: false,
    canAcknowledgeAlerts: true, // in local memory only
    canUpdateCapacity: false,
    canAllocateResources: false,
    canManageUsers: false,
    canAccessSimulations: true,
  },
};

/**
 * Normalizes any freeform role string from OAuth or registration into canonical UserRole
 */
export function normalizeRole(role?: string): UserRole {
  if (!role) return "VIEWER";
  const upper = role.toUpperCase();
  if (upper.includes("ADMIN") || upper.includes("DIRECTOR") || upper.includes("SUPER")) {
    return "ADMIN";
  }
  if (upper.includes("OPERATOR") || upper.includes("COMMAND") || upper.includes("DISASTER")) {
    return "OPERATOR";
  }
  if (upper.includes("ANALYST") || upper.includes("RESEARCHER") || upper.includes("SCIENTIST")) {
    return "ANALYST";
  }
  if (upper.includes("DEMO")) {
    return "DEMO_USER";
  }
  return "VIEWER";
}

/**
 * Get all permissions associated with a given role
 */
export function getRolePermissions(role?: string): RolePermissions {
  const normalized = normalizeRole(role);
  return ROLE_PERMISSIONS_MAP[normalized] || ROLE_PERMISSIONS_MAP.VIEWER;
}

/**
 * Check if a specific role possesses a specific permission flag
 */
export function hasPermission(role: string | undefined, permission: keyof RolePermissions): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission] ?? false;
}
