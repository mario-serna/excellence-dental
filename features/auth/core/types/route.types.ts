export const ROUTE_TYPES = {
  PUBLIC: 'public',
  ADMIN: 'admin',
  CLINICAL: 'clinical',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
} as const;

export type RouteType = (typeof ROUTE_TYPES)[keyof typeof ROUTE_TYPES];

export interface AuthResult {
  isAuthenticated: boolean;
  user?: any;
  redirectUrl?: string;
  allowAccess: boolean;
}
