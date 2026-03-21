/**
 * Role utility functions for the auth feature.
 * Imports core types from providers and provides feature-specific utilities.
 * Follows dependency injection pattern for translations.
 */

import type { UserRole } from '@/providers/domain/auth';
import {
  ROLE_GROUPS,
  ROLE_HIERARCHY,
  USER_ROLES,
} from '@/providers/domain/auth';

/**
 * Gets all available user roles.
 */
export function getAllRoles(): UserRole[] {
  return Object.values(USER_ROLES);
}

/**
 * Gets display name for a role using dependency injection.
 * @param role - The role to get display name for
 * @param t - Translation function (injected dependency)
 */
export function getRoleDisplayName(
  role: UserRole,
  t: (key: string, options?: { fallback?: string }) => string
): string {
  const roleKey = `auth.roles.${role}`;
  return t(roleKey, { fallback: role.charAt(0).toUpperCase() + role.slice(1) });
}

/**
 * Checks if a role has higher permissions than another role.
 * @param role - Role to check
 * @param minimumRole - Minimum required role
 */
export function hasHigherRole(role: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Checks if a role belongs to a specific role group.
 * @param role - Role to check
 * @param group - Role group name ('clinical' | 'administrative')
 */
export function isInRoleGroup(
  role: UserRole,
  group: keyof typeof ROLE_GROUPS
): boolean {
  return (ROLE_GROUPS[group] as readonly UserRole[]).includes(role);
}

/**
 * Validates if a string is a valid user role.
 * @param role - Role to validate
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).some((validRole) => validRole === role);
}
