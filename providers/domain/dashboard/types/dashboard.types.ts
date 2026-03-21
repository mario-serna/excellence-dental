/**
 * Dashboard data structure for appointments and statistics.
 */
export interface DashboardData {
  todayAppointments: Appointment[];
  totalPatients?: number;
  totalDoctors?: number;
  weekAppointments?: number;
  myWeekAppointments?: number;
}

export const APPOINTMENT_STATUS = {
  scheduled: 'scheduled',
  confirmed: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show',
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

/**
 * Appointment interface for dashboard display.
 * Matches the database schema with additional display fields.
 */
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string; // ISO string from database timestamptz
  durationMins: number;
  status: AppointmentStatus;
  serviceType?: string;
  notes?: string;
  // Relationship objects
  patient: {
    id: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
  };
  // Computed display fields for UI
  time: string; // Formatted time (e.g., "09:00 AM")
  duration: string; // Formatted duration (e.g., "30m")
  type?: string; // Alias for serviceType
}

/**
 * Dashboard statistics configuration.
 */
export interface DashboardStat {
  title: string;
  value: string | number;
  description: string;
  icon: string; // LucideIcon component name (e.g., 'CalendarPlus', 'UserPlus')
  trend?: { value: number; isPositive: boolean };
}

/**
 * Dashboard quick action configuration.
 */
export interface DashboardQuickAction {
  href: string;
  variant?: any;
  icon: string; // LucideIcon component name (e.g., 'CalendarPlus', 'UserPlus')
  text: string;
}

/**
 * Complete dashboard configuration for a specific user role.
 */
export interface DashboardConfig {
  title: string;
  welcome: string;
  stats: DashboardStat[];
  quickActions: DashboardQuickAction[];
  showSchedule?: boolean;
}

/**
 * Dashboard provider response containing both data and configuration.
 */
export interface DashboardResponse {
  data: DashboardData;
  config: DashboardConfig;
}
