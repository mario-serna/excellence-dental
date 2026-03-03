'use client';
import {
  ROLE_GROUP_KEYS,
  USER_ROLES,
  type RoleGroupKey,
  type UserRole,
} from '../types/role.types';
import { hasHigherRole, isInRoleGroup } from '../utils/role-utils';
import { useAuth } from './use-auth';

export function useRole() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isAdmin: role === USER_ROLES.admin,
    isDoctor: role === USER_ROLES.doctor,
    isAssistant: role === USER_ROLES.assistant,

    // Enhanced role checking
    hasAccess: (requiredRole: UserRole) =>
      role ? hasHigherRole(role, requiredRole) : false,
    isInGroup: (group: RoleGroupKey) =>
      role ? isInRoleGroup(role, group) : false,
    canAccessClinical: role
      ? isInRoleGroup(role, ROLE_GROUP_KEYS.CLINICAL)
      : false,
    canAccessAdmin: role === USER_ROLES.admin,
  };
}
