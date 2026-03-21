import type { UserRole } from '../../auth/types/role.types';
import type {
  DashboardConfig,
  DashboardData,
  DashboardResponse,
} from '../types/dashboard.types';

/**
 * Server-side dashboard provider interface.
 * Handles dashboard data fetching and configuration on the server.
 */
export interface IDashboardServerProvider {
  /**
   * Get dashboard data for a specific user role.
   */
  getDashboardData(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardData>;

  /**
   * Get dashboard configuration for a specific user role.
   */
  getDashboardConfig(
    userRole: UserRole,
    locale: string
  ): Promise<DashboardConfig>;

  /**
   * Get complete dashboard response (data + config).
   */
  getDashboard(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardResponse>;
}

/**
 * Client-side dashboard provider interface.
 * Handles dashboard state management and real-time updates on the client.
 */
export interface IDashboardClientProvider {
  /**
   * Refresh dashboard data from the server.
   */
  refreshDashboardData(): Promise<void>;

  /**
   * Get current dashboard data.
   */
  getCurrentData(): DashboardData | null;

  /**
   * Get current dashboard configuration.
   */
  getCurrentConfig(): DashboardConfig | null;

  /**
   * Subscribe to dashboard data changes.
   * Returns unsubscribe function.
   */
  onDataChange(callback: (data: DashboardData) => void): () => void;

  /**
   * Subscribe to dashboard configuration changes.
   * Returns unsubscribe function.
   */
  onConfigChange(callback: (config: DashboardConfig) => void): () => void;

  /**
   * Subscribe to complete dashboard response changes.
   * Returns unsubscribe function.
   */
  onDashboardChange(
    callback: (dashboard: DashboardResponse) => void
  ): () => void;
}
