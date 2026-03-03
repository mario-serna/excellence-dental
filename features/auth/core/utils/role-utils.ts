import {
  ROLE_GROUPS,
  ROLE_HIERARCHY,
  USER_ROLES,
  type UserRole,
} from '../types/role.types';
import { getRoleDisplayName as getRoleDisplayNameI18n } from './i18n';

export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}

export function hasHigherRole(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isInRoleGroup(
  userRole: UserRole,
  group: keyof typeof ROLE_GROUPS
): boolean {
  return (ROLE_GROUPS[group] as UserRole[]).includes(userRole);
}

export function getAllRoles(): UserRole[] {
  return Object.values(USER_ROLES);
}

export function getRoleDisplayName(
  role: UserRole,
  t: (key: string, options?: { fallback?: string }) => string
): string {
  return getRoleDisplayNameI18n(role, t);
}
