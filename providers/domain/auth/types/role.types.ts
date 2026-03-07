/**
 * User role constants with type safety.
 * Follows object-based constants pattern - no string literals.
 */
export const USER_ROLES = {
  admin: 'admin',
  doctor: 'doctor',
  assistant: 'assistant',
  nurse: 'nurse',
  receptionist: 'receptionist',
} as const;

/**
 * Role hierarchy for permission checking.
 * Higher numbers = more permissions.
 */
export const ROLE_HIERARCHY = {
  [USER_ROLES.admin]: 100,
  [USER_ROLES.doctor]: 80,
  [USER_ROLES.assistant]: 60,
  [USER_ROLES.nurse]: 40,
  [USER_ROLES.receptionist]: 20,
} as const;

/**
 * Role groups for bulk permission checking.
 */
export const ROLE_GROUPS = {
  clinical: [USER_ROLES.doctor, USER_ROLES.nurse, USER_ROLES.assistant],
  administrative: [USER_ROLES.admin, USER_ROLES.receptionist],
} as const;

/**
 * User role type derived from constants.
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
