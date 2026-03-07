/**
 * Mock authentication provider for development and testing.
 * Simulates authentication without external dependencies.
 */

import { PROVIDER_VENDORS } from '@/providers';
import { ClientAuthProvider } from '../core';
import type {
  AuthResult,
  User,
} from '../core/interfaces/auth-provider.interface';
import type { UserRole } from '../core/types/role.types';
import { USER_ROLES } from '../core/types/role.types';

const DEFAULT_USER: User = {
  id: 'mock-id',
  email: 'doctor@test.com',
  role: USER_ROLES.doctor,
  metadata: {},
};

export class MockAuthProvider extends ClientAuthProvider {
  readonly name = ClientAuthProvider.createName(PROVIDER_VENDORS.MOCK);
  private authStateCallbacks: ((user: User | null) => void)[] = [];
  private currentUser: User | null = DEFAULT_USER;

  constructor(private readonly mockUser: User | null = DEFAULT_USER) {
    super();
    this.currentUser = mockUser;
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    // Mock authentication - always succeeds with default user
    if (email === 'admin@test.com' && password === 'admin') {
      this.currentUser = {
        ...DEFAULT_USER,
        id: 'admin-id',
        email: 'admin@test.com',
        role: USER_ROLES.admin,
      };
    } else {
      this.currentUser = DEFAULT_USER;
    }

    this.notifyAuthStateChange();
    return { success: true, user: this.currentUser };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyAuthStateChange();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = { ...this.currentUser, role };
      this.notifyAuthStateChange();
    }
  }

  private notifyAuthStateChange(): void {
    this.authStateCallbacks.forEach((callback) => callback(this.currentUser));
  }
}
