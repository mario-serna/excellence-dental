/**
 * Mock client-side dashboard provider for testing and development.
 * Provides mock dashboard state management without requiring a database connection.
 */

import { PROVIDER_VENDORS, ClientDashboardProvider } from '@/providers';
import type {
  DashboardData,
  DashboardConfig,
} from '@/providers/domain/dashboard/types/dashboard.types';

export class MockClientDashboardProvider extends ClientDashboardProvider {
  readonly name = ClientDashboardProvider.createName(PROVIDER_VENDORS.MOCK);

  async refreshDashboardData(): Promise<void> {
    try {
      // For mock provider, just notify with existing data
      // In a real implementation, this would fetch fresh data from API
      if (this.currentData) {
        this.notifyDataChange(this.currentData);
      }
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
      throw error;
    }
  }

  // Additional mock-specific methods can be added here
  // For example: simulate real-time updates, test data injection, etc.
}
