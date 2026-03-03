import { AUTH_PROVIDERS, authConfig } from '../../config/auth-config';
import { SupabaseAuthProvider } from '../../providers/supabase/supabase-auth-provider';
import { SupabaseMiddlewareProvider } from '../../providers/supabase/supabase-middleware-client';
import {
  IAuthProvider,
  IMiddlewareAuthProvider,
} from '../interfaces/auth-provider.interface';

export class AuthProviderFactory {
  static createAuthProvider(): IAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported auth provider: ${authConfig.provider}`);
    }
  }

  static createMiddlewareProvider(): IMiddlewareAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseMiddlewareProvider();
      default:
        throw new Error(
          `Unsupported middleware provider: ${authConfig.provider}`
        );
    }
  }
}
