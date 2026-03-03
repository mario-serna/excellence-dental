export * from './components/login-form';
export * from './components/role-guard';
export * from './config/auth-config';
export * from './core/hooks/use-auth';
export * from './core/hooks/use-role';
export type {
  AuthResult,
  IAuthProvider,
  User,
} from './core/interfaces/auth-provider.interface';
export { authService } from './core/services/auth.service';
export * from './core/types/role.types';
export {
  getAuthErrorMessage,
  getRoleDisplayName as getRoleDisplayNameI18n,
} from './core/utils/i18n';
export {
  getAllRoles,
  getRoleDisplayName,
  hasHigherRole,
  isInRoleGroup,
  isValidRole,
} from './core/utils/role-utils';
export * from './pages/login-page';
