/**
 * Registry key constants for type-safe provider registration.
 * Follows object-based constants pattern - no string literals.
 */

export const REGISTRY_KEYS = {
  AUTH: 'auth',
  DATABASE: 'database',
  STORAGE: 'storage',
  NOTIFICATIONS: 'notifications',
} as const;

export type RegistryKey = (typeof REGISTRY_KEYS)[keyof typeof REGISTRY_KEYS];
