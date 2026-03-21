import {
  Provider,
  PROVIDER_CONTEXTS,
  PROVIDER_DOMAINS,
  ProviderVendor,
} from '@/providers/provider';
import type { UserRole } from '../auth/types/role.types';
import type {
  DashboardConfig,
  DashboardData,
  DashboardResponse,
} from './types/dashboard.types';

/**
 * Server-side base class for dashboard providers.
 * Handles dashboard data fetching and configuration on the server.
 */
export abstract class ServerDashboardProvider extends Provider {
  abstract getDashboardData(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardData>;
  abstract getDashboardConfig(
    userRole: UserRole,
    locale: string
  ): Promise<DashboardConfig>;

  /**
   * Helper method for dashboard providers to generate names.
   * Usage: return ServerDashboardProvider.createName('SUPABASE')
   */
  protected static createName(vendor: ProviderVendor): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.SERVER,
      PROVIDER_DOMAINS.DASHBOARD
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────
  // Default implementation that combines data and configuration

  async getDashboard(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardResponse> {
    const [data, config] = await Promise.all([
      this.getDashboardData(userRole, locale, request),
      this.getDashboardConfig(userRole, locale),
    ]);

    return { data, config };
  }
}
