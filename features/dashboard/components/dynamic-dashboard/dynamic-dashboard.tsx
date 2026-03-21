import { type User, type UserRole } from '@/providers/domain/auth';
import type {
  Appointment,
  DashboardConfig,
} from '@/providers/domain/dashboard';
import { getTranslations } from 'next-intl/server';
import { DashboardHeader } from './dashboard-header';
import { DashboardQuickActions } from './dashboard-quick-actions';
import { DashboardSchedule } from './dashboard-schedule';
import { DashboardStatsGrid } from './dashboard-stats-grid';

interface DynamicDashboardProps {
  data: {
    todayAppointments: Appointment[];
    totalPatients?: number;
    totalDoctors?: number;
    weekAppointments?: number;
    myWeekAppointments?: number;
  };
  locale: string;
  userRole: UserRole;
  user: User;
  config?: DashboardConfig; // Optional config from provider
}

export async function DynamicDashboard({
  data,
  locale,
  userRole,
  user,
  config,
}: DynamicDashboardProps) {
  const t = await getTranslations({ locale });

  // Use provided config or fall back to basic rendering
  const dashboardConfig = config || {
    title: t('dashboard.title'),
    welcome: t('dashboard.welcome'),
    stats: [],
    quickActions: [],
    showSchedule: true,
  };

  // Extract user name from email or metadata
  const userName = user.metadata?.name || user.email.split('@')[0];

  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-6 space-y-6">
      {/* Page Header */}
      <DashboardHeader
        userName={userName}
        locale={locale}
        className="lg:col-span-6"
      />

      {/* Stats Grid */}
      <DashboardStatsGrid
        stats={dashboardConfig.stats}
        className="lg:col-span-6"
      />

      {/* Quick Actions */}
      <DashboardQuickActions
        actions={dashboardConfig.quickActions}
        className="lg:col-span-2"
      />

      {/* Schedule/Appointments */}
      {dashboardConfig.showSchedule && (
        <DashboardSchedule
          appointments={data.todayAppointments || []}
          maxItems={5}
          className="lg:col-span-4"
        />
      )}
    </div>
  );
}
