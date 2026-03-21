import type { UserRole } from '../types/role.types';

/**
 * User interface for authentication system.
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  metadata?: Record<string, any>;
}

/**
 * Authentication result interface for sign-in operations.
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Server-side authentication provider interface.
 */
export interface IAuthServerProvider {
  getUser(request: Request): Promise<User | null>;
}

/**
 * Client-side authentication provider interface.
 */
export interface IAuthClientProvider {
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
  updateUserRole(userId: string, role: UserRole): Promise<void>;
}
