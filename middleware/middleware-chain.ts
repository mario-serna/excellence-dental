import createI18nMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { middleware as authMiddleware } from '../features/auth/middleware/auth-middleware';

const i18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});

export function createMiddlewareChain() {
  return async (request: NextRequest) => {
    try {
      // Apply auth middleware first
      const authResult = await authMiddleware(request);

      // If auth middleware returns a redirect, use it
      if (authResult && authResult instanceof NextResponse) {
        return authResult;
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
