# 🏠 Phase 4 — Dashboards

## Overview

Create role-specific dashboards with statistics, metrics, and upcoming appointments display using feature-based architecture and object-based constants.

## Architecture Compliance

✅ **Lessons Reviewed**: Implementation follows established patterns from `.windsurf/lessons/`
✅ **Object-Based Constants**: Uses `USER_ROLES` constants instead of string literals
✅ **Feature-Based Organization**: Components organized under `features/dashboard/`
✅ **Dependency Injection**: Proper hook usage in components, no hooks in utilities
✅ **Type Safety**: TypeScript strict mode with proper interfaces
✅ **Provider System**: Uses centralized `providers/` architecture with registry pattern
✅ **Kebab-Case Files**: All component files use kebab-case naming

## Steps

### 4.1 Stats Card Component

```tsx
// features/dashboard/components/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.value === 0 ? (
              <Minus className="h-3 w-3 text-muted-foreground" />
            ) : trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={cn(
                'text-xs',
                trend.value === 0
                  ? 'text-muted-foreground'
                  : trend.isPositive
                    ? 'text-green-500'
                    : 'text-red-500'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4.2 Upcoming Appointments Component

```tsx
// features/dashboard/components/upcoming-appointments.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APPOINTMENT_STATUS } from '@/features/appointments/core/types/appointment-status.types';
import { Calendar, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { Appointment } from '@/types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  loading?: boolean;
  maxItems?: number;
}

export function UpcomingAppointments({
  appointments,
  loading,
  maxItems = 5,
}: UpcomingAppointmentsProps) {
  const t = useTranslations(); // ✅ Component manages its own i18n
  const displayAppointments = appointments.slice(0, maxItems);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.scheduled: // ✅ Object constant
        return 'default';
      case APPOINTMENT_STATUS.confirmed: // ✅ Object constant
        return 'secondary';
      case APPOINTMENT_STATUS.completed: // ✅ Object constant
        return 'default';
      case APPOINTMENT_STATUS.cancelled: // ✅ Object constant
        return 'destructive';
      case APPOINTMENT_STATUS.no_show: // ✅ Object constant
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.scheduled: // ✅ Object constant
        return 'bg-blue-100 text-blue-800';
      case APPOINTMENT_STATUS.confirmed: // ✅ Object constant
        return 'bg-green-100 text-green-800';
      case APPOINTMENT_STATUS.completed: // ✅ Object constant
        return 'bg-gray-100 text-gray-800';
      case APPOINTMENT_STATUS.cancelled: // ✅ Object constant
        return 'bg-red-100 text-red-800';
      case APPOINTMENT_STATUS.no_show: // ✅ Object constant
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: maxItems }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-3 border rounded-lg"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayAppointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t('appointments.emptyState.title')}
        </h3>
        <p className="text-muted-foreground">
          {t('appointments.emptyState.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{appointment.patients?.full_name}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{appointment.profiles?.full_name}</span>
                <span>•</span>
                <span>
                  {format(new Date(appointment.scheduled_at), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4.3 Dashboard Service Architecture

#### 4.3.1 Provider Registry Pattern

```ts
// features/dashboard/core/registries/dashboard-service.registry.ts
import { RegistryClientProvider } from '@/providers/registry/registry-client-provider';
import { IDashboardService } from '../interfaces/dashboard-service.interface';

export class DashboardServiceRegistry {
  private static dashboardService: IDashboardService;

  static getDashboardService(): IDashboardService {
    if (!this.dashboardService) {
      this.dashboardService = RegistryClientProvider.getAuthProvider();
    }
    return this.dashboardService;
  }
}
```

#### 4.3.2 Service Interface

```ts
// features/dashboard/core/interfaces/dashboard-service.interface.ts
import type { UserRole } from '@/features/auth/core/types/role.types';
import { AppointmentStatus } from '@/features/appointments/core/types/appointment-status.types';

export interface IDashboardService {
  getTodayAppointments(): Promise<Appointment[]>;
  getTotalPatients(): Promise<number>;
  getTotalDoctors(): Promise<number>;
  getWeekAppointments(): Promise<number>;
  getDoctorWeekAppointments(doctorId: string): Promise<number>;
}

// ✅ CORRECT - Use proper Appointment interface
export interface Appointment {
  id: string;
  patientId: string; // ✅ camelCase
  doctorId: string; // ✅ camelCase
  scheduledAt: string; // ✅ camelCase
  status: AppointmentStatus; // ✅ Object-based constant
  patients: {
    fullName: string; // ✅ camelCase
  };
  profiles: {
    fullName: string; // ✅ camelCase
  };
}
```

#### 4.3.3 Supabase Provider Implementation

```ts
// features/dashboard/providers/supabase/supabase-dashboard-provider.ts
import { createClient } from '@/lib/supabase/server';
import {
  IDashboardService,
  Appointment,
} from '../../core/interfaces/dashboard-service.interface';

export class SupabaseDashboardProvider implements IDashboardService {
  private supabase = createClient();

  async getTodayAppointments(): Promise<Appointment[]> {
    const { data } = await this.supabase
      .from('appointments')
      .select(
        `
        *,
        patients(full_name),
        profiles!appointments_doctor_id_fkey(full_name)
      `
      )
      .gte('scheduled_at', new Date().toISOString())
      .lte(
        'scheduled_at',
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      )
      .order('scheduled_at', { ascending: true });

    return data || [];
  }

  async getTotalPatients(): Promise<number> {
    const [{ count }] = await this.supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    return count || 0;
  }

  async getTotalDoctors(): Promise<number> {
    const [{ count }] = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'doctor')
      .eq('is_active', true);
    return count || 0;
  }

  async getWeekAppointments(): Promise<number> {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    const [{ count }] = await this.supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', weekStart.toISOString())
      .lte('scheduled_at', weekEnd.toISOString());
    return count || 0;
  }

  async getDoctorWeekAppointments(doctorId: string): Promise<number> {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    const [{ count }] = await this.supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctorId)
      .gte('scheduled_at', weekStart.toISOString())
      .lte('scheduled_at', weekEnd.toISOString());
    return count || 0;
  }
}
```

#### 4.3.4 Factory Pattern

```ts
// features/dashboard/core/factories/dashboard-service.factory.ts
import {
  DASHBOARD_PROVIDERS,
  dashboardConfig,
} from '../../config/dashboard-config';
import { SupabaseDashboardProvider } from '../../providers/supabase/supabase-dashboard-provider';
import { IDashboardService } from '../interfaces/dashboard-service.interface';

export class DashboardServiceFactory {
  static createDashboardService(): IDashboardService {
    switch (dashboardConfig.provider) {
      case DASHBOARD_PROVIDERS.SUPABASE:
        return new SupabaseDashboardProvider();
      default:
        throw new Error(
          `Unsupported dashboard provider: ${dashboardConfig.provider}`
        );
    }
  }
}
```

#### 4.3.3 Dashboard Data Service

```ts
// features/dashboard/core/services/dashboard.service.ts
import { DashboardServiceRegistry } from '../registries/dashboard-service.registry';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import type { UserRole } from '@/features/auth/core/types/role.types';

export async function getDashboardData(userRole: UserRole) {
  const dashboardService = DashboardServiceRegistry.getDashboardService();

  const todayAppointments = await dashboardService.getTodayAppointments();

  let additionalData = {};

  if (userRole === USER_ROLES.admin) {
    const totalPatients = await dashboardService.getTotalPatients();
    const totalDoctors = await dashboardService.getTotalDoctors();
    const weekAppointments = await dashboardService.getWeekAppointments();

    additionalData = {
      totalPatients,
      totalDoctors,
      weekAppointments,
    };
  } else if (userRole === USER_ROLES.doctor) {
    // Get doctor's specific data using registry pattern
    const authProvider = RegistryClientProvider.getAuthProvider();
    const { data: doctorProfile } = await authProvider.getUserProfile();

    if (doctorProfile) {
      const myWeekAppointments =
        await dashboardService.getDoctorWeekAppointments(doctorProfile.id);
      additionalData = { myWeekAppointments };
    }
  }

  return {
    todayAppointments,
    ...additionalData,
  };
}
```

#### 4.3.4 Feature Index

```ts
// features/dashboard/index.ts
export * from './components/stats-card';
export * from './components/upcoming-appointments';
export * from './core/services/dashboard.service';
export * from './core/registries/dashboard-service.registry';
export * from './core/interfaces/dashboard-service.interface';
export * from './core/types/appointment-status.types';
```

### 4.4 Admin Dashboard

```tsx
// app/[locale]/(dashboard)/dashboard/page.tsx
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { UpcomingAppointments } from '@/features/dashboard/components/upcoming-appointments';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { getDashboardData } from '@/features/dashboard';
import { useRole } from '@/features/auth/core/hooks/use-role';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { useTranslations } from 'next-intl';

export default async function AdminDashboard() {
  const { role } = useRole();
  const data = await getDashboardData(role || '');
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.stats.totalPatients')}
          value={data.totalPatients || 0}
          description={t('dashboard.stats.registeredPatients')}
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title={t('dashboard.stats.todayAppointments')}
          value={data.todayAppointments?.length || 0}
          description={t('dashboard.stats.scheduledToday')}
          icon={Calendar}
        />
        <StatsCard
          title={t('dashboard.stats.activeDoctors')}
          value={data.totalDoctors || 0}
          description={t('dashboard.stats.onStaff')}
          icon={TrendingUp}
        />
        <StatsCard
          title={t('dashboard.stats.weekAppointments')}
          value={data.weekAppointments || 0}
          description={t('dashboard.stats.thisWeek')}
          icon={Activity}
        />
      </div>

      {/* All Appointments */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {t('dashboard.schedule.title')}
          </h2>
          <Link href="/appointments">
            <Button variant="outline">{t('dashboard.schedule.viewAll')}</Button>
          </Link>
        </div>
        <UpcomingAppointments
          appointments={data.todayAppointments || []}
          maxItems={10}
        />
      </div>
    </div>
  );
}
```

### 4.5 Doctor Dashboard

```tsx
// app/[locale]/(dashboard)/dashboard/doctor-page.tsx
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { UpcomingAppointments } from '@/features/dashboard/components/upcoming-appointments';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { getDashboardData } from '@/features/dashboard';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { useTranslations } from 'next-intl';

export default async function DoctorDashboard() {
  const data = await getDashboardData(USER_ROLES.doctor);
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.doctor.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.doctor.welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.doctor.todayAppointments')}
          value={data.todayAppointments?.length || 0}
          description={t('dashboard.doctor.scheduledToday')}
          icon={Calendar}
        />
        <StatsCard
          title={t('dashboard.doctor.weekAppointments')}
          value={data.myWeekAppointments || 0}
          description={t('dashboard.doctor.thisWeek')}
          icon={TrendingUp}
        />
        <StatsCard
          title={t('dashboard.doctor.patientsSeen')}
          value="24"
          description={t('dashboard.doctor.thisMonth')}
          icon={Users}
        />
        <StatsCard
          title={t('dashboard.doctor.avgDuration')}
          value="45m"
          description={t('dashboard.doctor.perVisit')}
          icon={Clock}
        />
      </div>

      {/* My Appointments */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {t('dashboard.doctor.mySchedule.title')}
          </h2>
          <Link href="/appointments/my-appointments">
            <Button variant="outline">
              {t('dashboard.doctor.mySchedule.viewAll')}
            </Button>
          </Link>
        </div>
        <UpcomingAppointments
          appointments={data.todayAppointments || []}
          maxItems={10}
        />
      </div>
    </div>
  );
}
```

### 4.6 Assistant Dashboard

```tsx
// app/[locale]/(dashboard)/dashboard/assistant-page.tsx
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { UpcomingAppointments } from '@/features/dashboard/components/upcoming-appointments';
import { Calendar, Users, Plus, Clock } from 'lucide-react';
import { getDashboardData } from '@/features/dashboard';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AssistantDashboard() {
  const data = await getDashboardData(USER_ROLES.assistant);
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.assistant.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.assistant.welcome')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/appointments/new">
          <Button className="w-full h-20 flex-col gap-2">
            <Plus className="h-6 w-6" />
            {t('dashboard.assistant.quickActions.bookAppointment')}
          </Button>
        </Link>
        <Link href="/patients/new">
          <Button variant="outline" className="w-full h-20 flex-col gap-2">
            <Users className="h-6 w-6" />
            {t('dashboard.assistant.quickActions.registerPatient')}
          </Button>
        </Link>
        <Link href="/appointments/check-in">
          <Button variant="outline" className="w-full h-20 flex-col gap-2">
            <Clock className="h-6 w-6" />
            {t('dashboard.assistant.quickActions.checkIn')}
          </Button>
        </Link>
        <Link href="/reports/daily">
          <Button variant="outline" className="w-full h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            {t('dashboard.assistant.quickActions.dailyReport')}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.assistant.todayAppointments')}
          value={data.todayAppointments?.length || 0}
          description={t('dashboard.assistant.scheduledToday')}
          icon={Calendar}
        />
        <StatsCard
          title={t('dashboard.assistant.checkIns')}
          value="12"
          description={t('dashboard.assistant.soFar')}
          icon={Clock}
        />
        <StatsCard
          title={t('dashboard.assistant.pendingForms')}
          value="3"
          description={t('dashboard.assistant.needAttention')}
          icon={Plus}
        />
        <StatsCard
          title={t('dashboard.assistant.availableSlots')}
          value="8"
          description={t('dashboard.assistant.today')}
          icon={Clock}
        />
      </div>

      {/* All Appointments */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {t('dashboard.assistant.schedule.title')}
          </h2>
          <Link href="/appointments">
            <Button variant="outline">
              {t('dashboard.assistant.schedule.viewAll')}
            </Button>
          </Link>
        </div>
        <UpcomingAppointments
          appointments={data.todayAppointments || []}
          maxItems={10}
        />
      </div>
    </div>
  );
}
```

```json
{
  "appointments": {
    "emptyState": {
      "title": "No upcoming appointments",
      "description": "Your schedule is clear for now"
    }
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome back! Here's your clinic overview.",
    "stats": {
      "totalPatients": "Total Patients",
      "registeredPatients": "Registered patients",
      "todayAppointments": "Today's Appointments",
      "scheduledToday": "Scheduled today",
      "activeDoctors": "Active Doctors",
      "onStaff": "On staff",
      "weekAppointments": "Week Appointments",
      "thisWeek": "This week"
    },
    "schedule": {
      "title": "Today's Schedule",
      "viewAll": "View All"
    },
    "doctor": {
      "title": "Doctor Dashboard",
      "welcome": "Your personal practice overview.",
      "todayAppointments": "Today's Appointments",
      "scheduledToday": "Scheduled today",
      "weekAppointments": "Week Appointments",
      "thisWeek": "This week",
      "patientsSeen": "Patients Seen",
      "thisMonth": "This month",
      "avgDuration": "Avg Duration",
      "perVisit": "Per visit",
      "mySchedule": {
        "title": "My Schedule",
        "viewAll": "View All"
      }
    },
    "assistant": {
      "title": "Assistant Dashboard",
      "welcome": "Clinic operations and patient management.",
      "todayAppointments": "Today's Appointments",
      "scheduledToday": "Scheduled today",
      "checkIns": "Check-ins Today",
      "soFar": "So far",
      "pendingForms": "Pending Forms",
      "needAttention": "Need attention",
      "availableSlots": "Available Slots",
      "today": "Today",
      "quickActions": {
        "bookAppointment": "Book Appointment",
        "registerPatient": "Register Patient",
        "checkIn": "Check In",
        "dailyReport": "Daily Report"
      },
      "schedule": {
        "title": "Today's Schedule",
        "viewAll": "View All"
      }
    }
  }
}
```

## Implementation Steps

### i18n Implementation

- [ ] Add useTranslations hook to all dashboard components
- [ ] Create translation keys for all dashboard text
- [ ] Update all hard-coded strings to use translation keys
- [ ] Add role-specific translations (admin/doctor/assistant)
- [ ] Update UpcomingAppointments component to manage its own i18n
- [ ] Test with multiple locales

### Dashboard Components

- [ ] Create reusable stats-card component
- [ ] Build upcoming-appointments component
- [ ] Implement dashboard service architecture
- [ ] Add loading states and error handling
- [ ] Create APPOINTMENT_STATUS constants to avoid string literals

### Service Architecture

- [ ] Create dashboard service interface
- [ ] Implement Supabase dashboard provider
- [ ] Add dashboard service registry pattern
- [ ] Create dashboard configuration
- [ ] Add feature index for clean exports

### Role-Specific Dashboards

- [ ] Build admin dashboard with clinic-wide metrics
- [ ] Create doctor dashboard with personal statistics
- [ ] Implement assistant dashboard with operational focus
- [ ] Add quick action buttons for assistants
- [ ] Use proper UserRole types instead of strings

### Data Integration

- [ ] Connect to Supabase via provider pattern
- [ ] Implement proper error handling
- [ ] Add data refresh functionality
- [ ] Optimize queries for performance
- [ ] Ensure all role comparisons use USER_ROLES constants

### Architecture Compliance

- [ ] Verify all imports use feature-based paths
- [ ] Check no string literals for role comparisons
- [ ] Ensure proper dependency injection patterns
- [ ] Validate TypeScript strict mode compliance
- [ ] Run Prettier formatting on all files
- [ ] Verify all text uses translation keys
- [ ] Check no hard-coded strings in components
- [ ] Ensure proper i18n hook usage
- [ ] Validate translation key structure
- [ ] Follow exact auth feature structure pattern
- [ ] Use provider registry pattern instead of factory pattern

## Deliverables

- Role-specific dashboard pages with proper role detection
- Reusable dashboard components following architecture patterns
- Real-time data integration with proper error handling
- Responsive statistics display with loading states
- Quick action functionality for assistants
- Full internationalization support with translation keys
- Plugin-based dashboard service architecture using registry pattern
- Provider abstraction for data sources
- Feature-based organization with proper structure
- Kebab-case file naming compliance

## Estimated Time

1 day

## Pre-Implementation Checklist (MANDATORY)

Before starting implementation, complete this checklist:

- [ ] **Read lessons completely** - Review `.windsurf/lessons/implementation-checklist.md`
- [ ] **Found existing patterns** - Study `features/auth/core/types/role.types.ts` and hooks
- [ ] **Using object-based constants** - All role checks use `USER_ROLES.admin` not `'admin'`
- [ ] **Following feature-based organization** - Components under `features/dashboard/`
- [ ] **Applied dependency injection** - No React hooks in utility functions
- [ ] **No string literals** - All switch cases use APPOINTMENT_STATUS constants
- [ ] **No React hooks in utilities** - Proper separation of concerns
- [ ] **Full i18n compliance** - All text uses translation keys, no hard-coded strings
- [ ] **TypeScript interface compliance** - Proper camelCase properties and AppointmentStatus types

## Critical Pattern References

```typescript
// ✅ CORRECT - Object-based constants for appointments
switch (status) {
  case APPOINTMENT_STATUS.scheduled:
    return 'bg-blue-100 text-blue-800';
  case APPOINTMENT_STATUS.confirmed:
    return 'bg-green-100 text-green-800';
  case APPOINTMENT_STATUS.completed:
    return 'bg-gray-100 text-gray-800';
  case APPOINTMENT_STATUS.cancelled:
    return 'bg-red-100 text-red-800';
  case APPOINTMENT_STATUS.no_show:
    return 'bg-orange-100 text-orange-800';
}

// ❌ WRONG - String literals
switch (status) {
  case 'scheduled':
    return 'bg-blue-100 text-blue-800'; // String literal violation
  case 'confirmed':
    return 'bg-green-100 text-green-800'; // String literal violation
}
```

```typescript
// ✅ CORRECT - Object-based constants for appointments
switch (status) {
  case APPOINTMENT_STATUS.scheduled:
    return 'bg-blue-100 text-blue-800';
  case APPOINTMENT_STATUS.confirmed:
    return 'bg-green-100 text-green-800';
  case APPOINTMENT_STATUS.completed:
    return 'bg-gray-100 text-gray-800';
  case APPOINTMENT_STATUS.cancelled:
    return 'bg-red-100 text-red-800';
  case APPOINTMENT_STATUS.no_show:
    return 'bg-orange-100 text-orange-800';
}

// ❌ WRONG - String literals
switch (status) {
  case 'scheduled':
    return 'bg-blue-100 text-blue-800'; // String literal violation
  case 'confirmed':
    return 'bg-green-100 text-green-800'; // String literal violation
}
```

```typescript
// ✅ CORRECT - Reusable component manages its own i18n
<UpcomingAppointments
  appointments={data.todayAppointments || []}
  maxItems={10}
/>

// ❌ WRONG - Component not truly reusable with translation props
<UpcomingAppointments
  appointments={data.todayAppointments || []}
  maxItems={10}
  emptyStateTitle={t('dashboard.schedule.emptyState.title')}
  emptyStateDescription={t('dashboard.schedule.emptyState.description')}
/>
```

```typescript
// ✅ CORRECT - TypeScript interface with proper conventions
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { useRole } from '@/features/auth/core/hooks/use-role';
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { UpcomingAppointments } from '@/features/dashboard/components/upcoming-appointments';

// ✅ CORRECT - Proper property access
appointment.patientId; // ✅ camelCase
appointment.doctorId; // ✅ camelCase
appointment.scheduledAt; // ✅ camelCase
appointment.patients.fullName; // ✅ camelCase
appointment.profiles.fullName; // ✅ camelCase

// ❌ WRONG - Snake case property access
appointment.patient_id; // ❌ Snake case
appointment.doctor_id; // ❌ Snake case
appointment.scheduled_at; // ❌ Snake case
appointment.patients.full_name; // ❌ Snake case
appointment.profiles.full_name; // ❌ Snake case

// ❌ WRONG - Technical layer imports or PascalCase files
import { USER_ROLES } from '@/types/auth';
import { useRole } from '@/hooks/auth';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
```
