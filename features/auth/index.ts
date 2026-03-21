/**
 * Authentication feature public API.
 * Exports all auth-related functionality from providers system.
 */

// Components
export { LogoutButton } from './components/logout-button';

// Actions
export { signInAction, signOutAction } from './actions/auth.actions';

// Middleware
export { config } from './middleware/auth-middleware';

// Re-export types from providers (maintains clean feature API)
export type { AuthResult, User, UserRole } from '@/providers/domain/auth';

// Re-export core classes from providers
export {
  AuthError,
  ClientAuthProvider,
  ServerAuthProvider,
} from '@/providers/domain/auth';

// Feature-specific utilities (using providers implementation)
export {
  getAllRoles,
  getRoleDisplayName,
  hasHigherRole,
  isInRoleGroup,
  isValidRole,
} from './utils/role-utils';

// Pages
export * from './pages/login-page';
