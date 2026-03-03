import type { NextRequest } from 'next/server';
import { AccessControl } from '../core/access-control';
import { AuthProviderFactory } from '../core/factories/auth-provider-factory';
import { RouteClassifier } from '../core/route-classifier';
import { AuthResult, ROUTE_TYPES } from '../core/types/route.types';

export class AuthMiddleware {
  private static authProvider = AuthProviderFactory.createMiddlewareProvider();

  static async handleAuth(request: NextRequest): Promise<AuthResult> {
    const pathname = request.nextUrl.pathname;

    // Skip auth for static assets and API routes
    if (RouteClassifier.isAssetRoute(pathname)) {
      return { isAuthenticated: false, allowAccess: true };
    }

    const locale = RouteClassifier.extractLocale(pathname);

    // Handle login routes
    if (RouteClassifier.isLoginRoute(pathname)) {
      return this.handleLoginRoute(request, locale);
    }

    // Handle public routes
    if (RouteClassifier.isPublicRoute(pathname)) {
      return { isAuthenticated: false, allowAccess: true };
    }

    // Handle protected routes
    return this.handleProtectedRoute(request, pathname, locale);
  }

  private static async handleLoginRoute(
    request: NextRequest,
    locale: string
  ): Promise<AuthResult> {
    try {
      const {
        data: { user },
      } = await this.authProvider.getUser(request);
      if (user) {
        const redirectUrl = AccessControl.getRedirectForRole(
          user.user_metadata?.role || user.app_metadata?.role,
          locale
        );
        return { isAuthenticated: true, user, redirectUrl, allowAccess: false };
      }
    } catch (error) {
      // Allow access to login on auth check failure
    }
    return { isAuthenticated: false, allowAccess: true };
  }

  private static async handleProtectedRoute(
    request: NextRequest,
    pathname: string,
    locale: string
  ): Promise<AuthResult> {
    try {
      const {
        data: { user },
      } = await this.authProvider.getUser(request);

      if (!user) {
        const redirectUrl = AccessControl.getLoginRedirect(locale, pathname);
        return { isAuthenticated: false, redirectUrl, allowAccess: false };
      }

      const userRole = user.user_metadata?.role || user.app_metadata?.role;

      // Check role-based access
      if (RouteClassifier.isAdminRoute(pathname)) {
        if (!AccessControl.canAccessRoute(userRole, ROUTE_TYPES.ADMIN)) {
          const redirectUrl = AccessControl.getRedirectForRole(
            userRole,
            locale
          );
          return {
            isAuthenticated: true,
            user,
            redirectUrl,
            allowAccess: false,
          };
        }
      }

      if (RouteClassifier.isClinicalRoute(pathname)) {
        if (!AccessControl.canAccessRoute(userRole, ROUTE_TYPES.CLINICAL)) {
          const redirectUrl = AccessControl.getRedirectForRole(
            userRole,
            locale
          );
          return {
            isAuthenticated: true,
            user,
            redirectUrl,
            allowAccess: false,
          };
        }
      }

      return { isAuthenticated: true, user, allowAccess: true };
    } catch (error) {
      console.error('Auth middleware error:', error);
      const redirectUrl = AccessControl.getLoginRedirect(locale);
      return { isAuthenticated: false, redirectUrl, allowAccess: false };
    }
  }
}
