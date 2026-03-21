/**
 * Mock server-side dashboard provider for testing and development.
 * Provides mock dashboard data without requiring a database connection.
 */

import { PROVIDER_VENDORS, ServerDashboardProvider } from '@/providers';
import { USER_ROLES, type UserRole } from '@/providers/domain/auth';
import type {
  DashboardConfig,
  DashboardData,
} from '@/providers/domain/dashboard/types/dashboard.types';
import { APPOINTMENT_STATUS } from '@/providers/domain/dashboard/types/dashboard.types';
import { getTranslations } from 'next-intl/server';

export class MockServerDashboardProvider extends ServerDashboardProvider {
  readonly name = ServerDashboardProvider.createName(PROVIDER_VENDORS.MOCK);

  async getDashboardData(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardData> {
    // Mock data for testing - no database required
    const mockData: DashboardData = {
      todayAppointments: [
        {
          id: '1',
          patientId: 'patient-1',
          doctorId: 'doctor-1',
          scheduledAt: '2024-03-16T09:00:00Z',
          durationMins: 30,
          status: APPOINTMENT_STATUS.scheduled,
          serviceType: 'Checkup',
          notes: 'Regular checkup',
          patient: {
            id: 'patient-1',
            name: 'John Doe',
          },
          doctor: {
            id: 'doctor-1',
            name: 'Dr. Smith',
          },
          // Computed display fields
          time: '09:00 AM',
          duration: '30m',
          type: 'Checkup',
        },
        {
          id: '2',
          patientId: 'patient-2',
          doctorId: 'doctor-1',
          scheduledAt: '2024-03-16T10:30:00Z',
          durationMins: 45,
          status: APPOINTMENT_STATUS.confirmed,
          serviceType: 'Cleaning',
          notes: 'Teeth cleaning',
          patient: {
            id: 'patient-2',
            name: 'Jane Smith',
          },
          doctor: {
            id: 'doctor-1',
            name: 'Dr. Smith',
          },
          // Computed display fields
          time: '10:30 AM',
          duration: '45m',
          type: 'Cleaning',
        },
        {
          id: '3',
          patientId: 'patient-3',
          doctorId: 'doctor-2',
          scheduledAt: '2024-03-16T14:00:00Z',
          durationMins: 30,
          status: APPOINTMENT_STATUS.scheduled,
          serviceType: 'Consultation',
          notes: 'Initial consultation',
          patient: {
            id: 'patient-3',
            name: 'Bob Johnson',
          },
          doctor: {
            id: 'doctor-2',
            name: 'Dr. Johnson',
          },
          // Computed display fields
          time: '02:00 PM',
          duration: '30m',
          type: 'Consultation',
        },
        {
          id: '4',
          patientId: 'patient-4',
          doctorId: 'doctor-2',
          scheduledAt: '2024-03-16T15:30:00Z',
          durationMins: 45,
          status: APPOINTMENT_STATUS.confirmed,
          serviceType: 'Follow-up',
          notes: 'Follow-up visit',
          patient: {
            id: 'patient-4',
            name: 'Alice Brown',
          },
          doctor: {
            id: 'doctor-2',
            name: 'Dr. Johnson',
          },
          // Computed display fields
          time: '03:30 PM',
          duration: '45m',
          type: 'Follow-up',
        },
      ],
      totalPatients: userRole === USER_ROLES.admin ? 150 : undefined,
      totalDoctors: userRole === USER_ROLES.admin ? 8 : undefined,
      weekAppointments: userRole === USER_ROLES.admin ? 45 : undefined,
      myWeekAppointments: userRole === USER_ROLES.doctor ? 12 : undefined,
    };

    return mockData;
  }

  async getDashboardConfig(
    userRole: UserRole,
    locale: string
  ): Promise<DashboardConfig> {
    const t = await getTranslations({ locale });

    switch (userRole) {
      case USER_ROLES.admin:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [
            {
              title: t('dashboard.stats.totalPatients'),
              value: 150,
              description: t('dashboard.stats.registeredPatients'),
              icon: 'Users',
              trend: { value: 3, isPositive: true },
            },
            {
              title: t('dashboard.stats.todayAppointments'),
              value: 8,
              description: t('dashboard.stats.scheduledToday'),
              icon: 'Calendar',
            },
            {
              title: t('dashboard.stats.activeDoctors'),
              value: 8,
              description: t('dashboard.stats.onStaff'),
              icon: 'TrendingUp',
            },
            {
              title: t('dashboard.stats.weekAppointments'),
              value: 45,
              description: t('dashboard.stats.thisWeek'),
              icon: 'Activity',
            },
          ],
          quickActions: [
            {
              href: '/patients/new',
              icon: 'UserPlus',
              text: t('dashboard.quickActions.registerPatient'),
              variant: 'default',
            },
            {
              href: '/appointments/new',
              icon: 'CalendarPlus',
              text: t('dashboard.quickActions.bookAppointment'),
              variant: 'outline',
            },
            {
              href: '/doctors',
              icon: 'Users',
              text: t('dashboard.quickActions.manageDoctors'),
              variant: 'outline',
            },
            {
              href: '/reports',
              icon: 'TrendingUp',
              text: t('dashboard.quickActions.viewReports'),
              variant: 'outline',
            },
          ],
          showSchedule: true,
        };

      case USER_ROLES.doctor:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [
            {
              title: t('dashboard.stats.todayAppointments'),
              value: 12,
              description: t('dashboard.stats.scheduledToday'),
              icon: 'Calendar',
              trend: { value: 8, isPositive: true },
            },
            {
              title: t('dashboard.stats.weekAppointments'),
              value: 45,
              description: t('dashboard.stats.thisWeek'),
              icon: 'Calendar',
              trend: { value: 12, isPositive: true },
            },
            {
              title: t('dashboard.stats.patientsSeen'),
              value: 28,
              description: t('dashboard.stats.thisMonth'),
              icon: 'Users',
              trend: { value: 5, isPositive: true },
            },
            {
              title: t('dashboard.stats.avgDuration'),
              value: '25 min',
              description: t('dashboard.stats.perVisit'),
              icon: 'Clock',
              trend: { value: -2, isPositive: false },
            },
          ],
          quickActions: [
            {
              href: '/appointments/new',
              icon: 'CalendarPlus',
              text: t('dashboard.quickActions.bookAppointment'),
              variant: 'default',
            },
            {
              href: '/patients',
              icon: 'Users',
              text: t('dashboard.quickActions.viewPatients'),
              variant: 'outline',
            },
            {
              href: '/reports',
              icon: 'TrendingUp',
              text: t('dashboard.quickActions.viewReports'),
              variant: 'outline',
            },
          ],
          showSchedule: true,
        };

      case USER_ROLES.assistant:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [
            {
              title: t('dashboard.stats.todayAppointments'),
              value: 8,
              description: t('dashboard.stats.scheduledToday'),
              icon: 'Calendar',
            },
            {
              title: t('dashboard.stats.checkIns'),
              value: '12',
              description: t('dashboard.stats.soFar'),
              icon: 'CalendarCheck2',
            },
            {
              title: t('dashboard.stats.availableSlots'),
              value: '8',
              description: t('dashboard.stats.today'),
              icon: 'CalendarPlus',
            },
            {
              title: t('dashboard.stats.pendingForms'),
              value: '3',
              description: t('dashboard.stats.needAttention'),
              icon: 'ClipboardClock',
            },
          ],
          quickActions: [
            {
              href: '/appointments/new',
              icon: 'CalendarPlus',
              text: t('dashboard.quickActions.bookAppointment'),
              variant: 'default',
            },
            {
              href: '/patients/new',
              icon: 'UserPlus',
              text: t('dashboard.quickActions.registerPatient'),
              variant: 'outline',
            },
            {
              href: '/appointments/check-in',
              icon: 'CalendarCheck2',
              text: t('dashboard.quickActions.checkIn'),
              variant: 'outline',
            },
            {
              href: '/reports/daily',
              icon: 'TrendingUp',
              text: t('dashboard.quickActions.dailyReport'),
              variant: 'outline',
            },
          ],
          showSchedule: true,
        };

      default:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [],
          quickActions: [],
          showSchedule: false,
        };
    }
  }
}
