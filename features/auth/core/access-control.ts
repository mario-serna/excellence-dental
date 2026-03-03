import { APP_ROUTES } from '../../../lib/routes';
import { ROLE_GROUPS, ROLE_GROUP_KEYS, USER_ROLES } from './types/role.types';
import { ROUTE_TYPES, RouteType } from './types/route.types';

export class AccessControl {
  static canAccessRoute(userRole: string, routeType: RouteType): boolean {
    switch (routeType) {
      case ROUTE_TYPES.ADMIN:
        return userRole === USER_ROLES.admin;
      case ROUTE_TYPES.CLINICAL:
        return ROLE_GROUPS[ROLE_GROUP_KEYS.CLINICAL].includes(userRole as any);
      default:
        return true;
    }
  }

  static getRedirectForRole(userRole: string, locale: string): string {
    const localizedDashboard = `/${locale}${APP_ROUTES.dashboard}`;
    return localizedDashboard;
  }

  static getLoginRedirect(locale: string, originalPath?: string): string {
    const loginUrl = `/${locale}${APP_ROUTES.login}`;
    return originalPath ? `${loginUrl}?redirectTo=${originalPath}` : loginUrl;
  }
}
