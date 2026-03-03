import createI18nMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthProviderFactory } from './features/auth/core/factories/auth-provider-factory';
import { USER_ROLES } from './features/auth/core/types/role.types';

const authProvider = AuthProviderFactory.createMiddlewareProvider();

const i18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});

export default async function proxy(request: NextRequest) {
  // Skip middleware for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return i18nMiddleware(request);
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/en/login', '/es/login'];

  // Define protected routes by role
  const adminRoutes = ['/admin'];
  const clinicalRoutes = ['/clinical'];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Check if current path requires specific roles
  const isAdminRoute = adminRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`)
  );

  const isClinicalRoute = clinicalRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`)
  );

  // Apply internationalization middleware first
  const intlResponse = i18nMiddleware(request);

  // If it's a public route, just return the intl response
  if (isPublicRoute) {
    return intlResponse;
  }

  // For protected routes, check authentication
  try {
    const {
      data: { session },
    } = await authProvider.getSession(request);

    if (!session) {
      // User is not authenticated, redirect to login page
      // Preserve the current locale in the redirect
      const locale = request.nextUrl.pathname.startsWith('/es') ? 'es' : 'en';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      // Add the original URL as a redirect parameter
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access for protected routes
    const userRole =
      session.user.user_metadata?.role || session.user.app_metadata?.role;

    // Admin routes protection
    if (isAdminRoute && userRole !== USER_ROLES.admin) {
      const locale = request.nextUrl.pathname.startsWith('/es') ? 'es' : 'en';
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Clinical routes protection (doctors and assistants only)
    if (
      isClinicalRoute &&
      userRole !== USER_ROLES.doctor &&
      userRole !== USER_ROLES.assistant
    ) {
      const locale = request.nextUrl.pathname.startsWith('/es') ? 'es' : 'en';
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // User is authenticated and has proper role access, proceed with intl middleware
    return intlResponse;
  } catch (error) {
    console.error('Auth middleware error:', error);
    // On error, redirect to login as fallback
    const locale = request.nextUrl.pathname.startsWith('/es') ? 'es' : 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // Match all pathnames except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
