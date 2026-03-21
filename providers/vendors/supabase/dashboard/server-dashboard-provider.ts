/**
 * Supabase server-side dashboard provider.
 * Handles dashboard data fetching and configuration on the server.
 */

import { PROVIDER_VENDORS, ServerDashboardProvider } from '@/providers';
import { USER_ROLES, type UserRole } from '@/providers/domain/auth';
import type {
  DashboardConfig,
  DashboardData,
} from '@/providers/domain/dashboard/types/dashboard.types';
import { getTranslations } from 'next-intl/server';
import { getSupabaseServerClient } from '../supabase.server';
import { mapAppointment } from './utils';

export class SupabaseServerDashboardProvider extends ServerDashboardProvider {
  readonly name = ServerDashboardProvider.createName(PROVIDER_VENDORS.SUPABASE);

  async getDashboardData(
    userRole: UserRole,
    locale: string,
    request: Request
  ): Promise<DashboardData> {
    const supabase = await getSupabaseServerClient(request);

    // Real Supabase queries based on database schema
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Get today's appointments with patient and doctor relationships
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        patient_id,
        doctor_id,
        scheduled_at,
        duration_mins,
        status,
        service_type,
        notes,
        patients!appointments_patient_id_fkey (
          full_name
        ),
        profiles!appointments_doctor_id_fkey (
          full_name
        )
      `
      )
      .eq('status', 'scheduled') // Only scheduled appointments
      .gte('scheduled_at', `${today}T00:00:00Z`)
      .lte('scheduled_at', `${today}T23:59:59Z`)
      .order('scheduled_at', { ascending: true });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    // Transform database data to Appointment interface
    const todayAppointments = appointmentsData.map(mapAppointment);

    // Get statistics based on user role
    let totalPatients, totalDoctors, weekAppointments, myWeekAppointments;

    if (userRole === USER_ROLES.admin) {
      // Admin can see all statistics
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      const { count: doctorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'doctor');

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { count: weekApptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', weekStart.toISOString())
        .lte('scheduled_at', weekEnd.toISOString());

      totalPatients = patientCount || 0;
      totalDoctors = doctorCount || 0;
      weekAppointments = weekApptCount || 0;
    } else if (userRole === USER_ROLES.doctor) {
      // Doctors can see their own statistics
      // Get current user's profile to get their ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileData) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          const { count: myWeekApptCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', profileData.id)
            .gte('scheduled_at', weekStart.toISOString())
            .lte('scheduled_at', weekEnd.toISOString());

          myWeekAppointments = myWeekApptCount || 0;
        }
      }
    }

    const data: DashboardData = {
      todayAppointments,
      totalPatients,
      totalDoctors,
      weekAppointments,
      myWeekAppointments,
    };

    return data;
  }

  async getDashboardConfig(
    userRole: UserRole,
    locale: string
  ): Promise<DashboardConfig> {
    const t = await getTranslations({ locale });

    // Basic configuration - real implementation would be more sophisticated
    // based on user preferences, system settings, etc.
    switch (userRole) {
      case USER_ROLES.admin:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [],
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
          ],
          showSchedule: true,
        };

      case USER_ROLES.doctor:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [],
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
          ],
          showSchedule: true,
        };

      case USER_ROLES.assistant:
        return {
          title: t('dashboard.title'),
          welcome: t('dashboard.welcome'),
          stats: [],
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
