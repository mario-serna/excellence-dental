// Core classes
export { AuthError } from './auth-error';
export { ClientAuthProvider } from './client-auth-provider';
export { ServerAuthProvider } from './server-auth-provider';

// Types and interfaces
export type { AuthResult, User } from './interfaces/auth-provider.interface';
export { ROLE_GROUPS, ROLE_HIERARCHY, USER_ROLES } from './types/role.types';
export type { UserRole } from './types/role.types';
