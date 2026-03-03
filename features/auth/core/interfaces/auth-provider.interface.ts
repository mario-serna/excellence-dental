import type { UserRole } from '../types/role.types';

export interface IAuthProvider {
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
  updateUserRole(userId: string, role: UserRole): Promise<void>;
}

export interface IMiddlewareAuthProvider {
  createMiddlewareClient(request: Request): any;
  getSession(request: Request): Promise<{ data: { session: any } }>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  metadata?: Record<string, any>;
}
