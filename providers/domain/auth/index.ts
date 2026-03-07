// Re-exports existing interfaces and provider contracts.
// Concrete implementations are never part of the public API.

// Core classes and types
export { AuthError, ClientAuthProvider, ServerAuthProvider } from './core';
export type {
  AuthResult,
  User,
} from './core/interfaces/auth-provider.interface';
export {
  ROLE_GROUPS,
  ROLE_HIERARCHY,
  USER_ROLES,
} from './core/types/role.types';
export type { UserRole } from './core/types/role.types';

// Provider constants
export { PROVIDER_VENDORS } from '@/providers/provider';
