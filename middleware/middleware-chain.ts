import createI18nMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthMiddleware } from '../features/auth/middleware/auth-middleware';

const i18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});

export function createMiddlewareChain() {
  return async (request: NextRequest) => {
    try {
      // Apply auth middleware first
      const authResult = await AuthMiddleware.handleAuth(request);

      // Handle redirects from auth decisions
      if (authResult.redirectUrl) {
        return NextResponse.redirect(
          new URL(authResult.redirectUrl, request.url)
        );
      }

      // If access is denied and no redirect, return 401
      if (!authResult.allowAccess) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Apply internationalization middleware
      return i18nMiddleware(request);
    } catch (error) {
      console.error('Middleware chain error:', error);
      // Fallback to i18n middleware on error
      return i18nMiddleware(request);
    }
  };
}
