export const USER_ROLES = {
  admin: 'admin',
  doctor: 'doctor',
  assistant: 'assistant',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type RoleValue = (typeof USER_ROLES)[UserRole];

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  [USER_ROLES.admin]: 100,
  [USER_ROLES.doctor]: 50,
  [USER_ROLES.assistant]: 25,
} as const;

// Role groups for easier permission checking
export const ROLE_GROUPS = {
  clinical: [USER_ROLES.doctor, USER_ROLES.assistant],
  administrative: [USER_ROLES.admin],
  all: Object.values(USER_ROLES),
} as const;

// Role group keys for type safety
export const ROLE_GROUP_KEYS = {
  CLINICAL: 'clinical',
  ADMINISTRATIVE: 'administrative',
  ALL: 'all',
} as const;

export type RoleGroupKey =
  (typeof ROLE_GROUP_KEYS)[keyof typeof ROLE_GROUP_KEYS];
