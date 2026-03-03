import { APP_ROUTES } from '../../../lib/routes';

export class RouteClassifier {
  static readonly LOCALES = ['en', 'es'] as const;

  static getLocalizedRoute(baseRoute: string, locale?: string): string {
    if (!locale) return baseRoute;
    return `/${locale}${baseRoute}`;
  }

  static getAllLocalizedVariants(baseRoute: string): string[] {
    return [
      baseRoute,
      ...this.LOCALES.map((locale) =>
        this.getLocalizedRoute(baseRoute, locale)
      ),
    ];
  }

  static isPublicRoute(pathname: string): boolean {
    const publicRoutes = this.getAllLocalizedVariants(APP_ROUTES.login);
    return publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }

  static isAdminRoute(pathname: string): boolean {
    const adminRoutes = this.getAllLocalizedVariants(APP_ROUTES.admin);
    return adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }

  static isClinicalRoute(pathname: string): boolean {
    const clinicalRoutes = this.getAllLocalizedVariants(APP_ROUTES.clinical);
    return clinicalRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }

  static isLoginRoute(pathname: string): boolean {
    const loginRoutes = this.getAllLocalizedVariants(APP_ROUTES.login);
    return loginRoutes.some((route) => pathname === route);
  }

  static extractLocale(pathname: string): string {
    const localeMatch = pathname.match(/^\/(en|es)/);
    return localeMatch ? localeMatch[1] : 'en';
  }

  static isAssetRoute(pathname: string): boolean {
    return (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    );
  }
}
