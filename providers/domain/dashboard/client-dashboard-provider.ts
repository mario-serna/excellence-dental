import {
  Provider,
  PROVIDER_CONTEXTS,
  PROVIDER_DOMAINS,
  ProviderVendor,
} from '@/providers/provider';
import type { IDashboardClientProvider } from './interfaces/dashboard-provider.interface';
import type {
  DashboardConfig,
  DashboardData,
  DashboardResponse,
} from './types/dashboard.types';

/**
 * Client-side base class for dashboard providers.
 * Handles dashboard state management and real-time updates on the client.
 */
export abstract class ClientDashboardProvider
  extends Provider
  implements IDashboardClientProvider
{
  protected currentData: DashboardData | null = null;
  protected currentConfig: DashboardConfig | null = null;
  protected dataCallbacks: Set<(data: DashboardData) => void> = new Set();
  protected configCallbacks: Set<(config: DashboardConfig) => void> = new Set();
  protected dashboardCallbacks: Set<(dashboard: DashboardResponse) => void> =
    new Set();

  abstract refreshDashboardData(): Promise<void>;

  /**
   * Helper method for dashboard providers to generate names.
   * Usage: return ClientDashboardProvider.createName('SUPABASE')
   */
  protected static createName(vendor: ProviderVendor): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.CLIENT,
      PROVIDER_DOMAINS.DASHBOARD
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────

  getCurrentData(): DashboardData | null {
    return this.currentData;
  }

  getCurrentConfig(): DashboardConfig | null {
    return this.currentConfig;
  }

  onDataChange(callback: (data: DashboardData) => void): () => void {
    this.dataCallbacks.add(callback);
    return () => this.dataCallbacks.delete(callback);
  }

  onConfigChange(callback: (config: DashboardConfig) => void): () => void {
    this.configCallbacks.add(callback);
    return () => this.configCallbacks.delete(callback);
  }

  onDashboardChange(
    callback: (dashboard: DashboardResponse) => void
  ): () => void {
    this.dashboardCallbacks.add(callback);
    return () => this.dashboardCallbacks.delete(callback);
  }

  // ── Protected helper methods ─────────────────────────────────────

  protected notifyDataChange(data: DashboardData): void {
    this.currentData = data;
    this.dataCallbacks.forEach((callback) => callback(data));

    // Also notify dashboard change if we have both data and config
    if (this.currentConfig) {
      this.notifyDashboardChange({ data, config: this.currentConfig });
    }
  }

  protected notifyConfigChange(config: DashboardConfig): void {
    this.currentConfig = config;
    this.configCallbacks.forEach((callback) => callback(config));

    // Also notify dashboard change if we have both data and config
    if (this.currentData) {
      this.notifyDashboardChange({ data: this.currentData, config });
    }
  }

  protected notifyDashboardChange(dashboard: DashboardResponse): void {
    this.dashboardCallbacks.forEach((callback) => callback(dashboard));
  }
}
