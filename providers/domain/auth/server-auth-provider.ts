import {
  Provider,
  PROVIDER_CONTEXTS,
  PROVIDER_DOMAINS,
  ProviderVendor,
} from '@/providers/provider';
import { AuthError } from './auth-error';
import type { User } from './interfaces/auth-provider.interface';
import { USER_ROLES } from './types/role.types';

/**
 * Server-side base class for authentication providers.
 * Handles Request objects and server-side authentication logic.
 */
export abstract class ServerAuthProvider extends Provider {
  abstract getUser(request: Request): Promise<User | null>;

  /**
   * Helper method for auth providers to generate names.
   * Usage: return ServerAuthProvider.createName('SUPABASE')
   */
  protected static createName(vendor: ProviderVendor): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.SERVER,
      PROVIDER_DOMAINS.AUTH
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────
  // Every subclass — Supabase, mock — inherits these for free.
  // They are implemented here once because they depend only on getUser(),
  // which every auth provider must implement.

  async isAuthenticated(request: Request): Promise<boolean> {
    return (await this.getUser(request)) !== null;
  }

  async requireAuth(request: Request): Promise<User> {
    const user = await this.getUser(request);
    if (!user) {
      throw new AuthError('auth.errors.notAuthenticated', 401);
    }
    return user;
  }

  async requireRole(request: Request, ...roles: User['role'][]): Promise<User> {
    const user = await this.requireAuth(request);
    if (!roles.includes(user.role)) {
      throw new AuthError('auth.errors.insufficientRole', 403);
    }
    return user;
  }

  async isAdmin(request: Request): Promise<boolean> {
    const user = await this.getUser(request);
    return user?.role === USER_ROLES.admin;
  }
}
