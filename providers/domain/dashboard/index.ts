// Core classes
export { ClientDashboardProvider } from './client-dashboard-provider';
export { ServerDashboardProvider } from './server-dashboard-provider';

// Types and interfaces
export type {
  Appointment,
  AppointmentStatus,
  DashboardConfig,
  DashboardData,
  DashboardQuickAction,
  DashboardResponse,
  DashboardStat,
} from './types/dashboard.types';

export { APPOINTMENT_STATUS } from './types/dashboard.types';

export type {
  IDashboardClientProvider,
  IDashboardServerProvider,
} from './interfaces/dashboard-provider.interface';
