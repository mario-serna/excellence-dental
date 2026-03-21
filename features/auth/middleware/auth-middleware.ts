/**
 * Authentication middleware for Next.js App Router.
 * Protects routes and handles authentication state using providers registry.
 */

import { APP_ROUTES } from '@/lib/routes';
import { NextRequest, NextResponse } from 'next/server';
import { serverProviders } from '../../../providers/registry/registry-server-provider';

/**
 * Middleware configuration for Next.js.
 * Matches all routes except static assets and API routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api.*).*)',
  ],
};

/**
 * Main authentication middleware function.
 * Handles authentication for all routes in the application.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    // Get current user from auth provider registry
    const user = await serverProviders.auth.getUser(request);

    // Extract locale from pathname for route checking
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0]; // First segment is the locale
    const routeWithoutLocale = '/' + segments.slice(1).join('/'); // Remove locale from path

    // Redirect to login if not authenticated and accessing protected route
    if (!user && routeWithoutLocale.startsWith(APP_ROUTES.dashboard)) {
      return NextResponse.redirect(
        new URL(`/${locale}${APP_ROUTES.login}`, request.url)
      );
    }

    // Redirect authenticated users from login page to dashboard
    if (user && routeWithoutLocale.startsWith(APP_ROUTES.login)) {
      return NextResponse.redirect(
        new URL(`/${locale}${APP_ROUTES.dashboard}`, request.url)
      );
    }

    // Continue to the requested route
    return NextResponse.next();
  } catch (error) {
    // Extract locale for redirect with fallback
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0] || 'en';

    // If provider fails, allow access to login page, redirect others
    if (!pathname.includes(APP_ROUTES.login)) {
      return NextResponse.redirect(
        new URL(`/${locale}${APP_ROUTES.login}`, request.url)
      );
    }
    return NextResponse.next();
  }
}
