import { createServerClient } from '@supabase/ssr';
import { authConfig } from '../../config/auth-config';
import { IMiddlewareAuthProvider } from '../../core/interfaces/middleware-provider.interface';

export class SupabaseMiddlewareProvider implements IMiddlewareAuthProvider {
  createMiddlewareClient(request: Request) {
    return createServerClient(
      authConfig.supabase.url,
      authConfig.supabase.anonKey,
      {
        cookies: {
          getAll: () => {
            const cookieHeader = request.headers.get('Cookie');
            if (!cookieHeader) return [];
            return cookieHeader.split(';').map((c) => {
              const [name, ...rest] = c.split('=');
              return { name: name.trim(), value: rest.join('=').trim() };
            });
          },
        },
      }
    );
  }

  async getSession(request: Request) {
    const supabase = this.createMiddlewareClient(request);
    return supabase.auth.getSession();
  }

  async getUser(request: Request) {
    const supabase = this.createMiddlewareClient(request);
    return supabase.auth.getUser();
  }
}

// Export factory function for consistency
export const createSupabaseMiddlewareClient = (request: Request) => {
  const provider = new SupabaseMiddlewareProvider();
  return provider.createMiddlewareClient(request);
};
