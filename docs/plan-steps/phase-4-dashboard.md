# 🏠 Phase 4 — Dashboards

## Overview

Create role-specific dashboards with statistics, metrics, and upcoming appointments display.

## Steps

### 4.1 Stats Card Component

```tsx
// components/dashboard/StatsCard.tsx
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
// components/dashboard/UpcomingAppointments.tsx
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
import { Calendar, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
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
  const displayAppointments = appointments.slice(0, maxItems);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
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
        <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
        <p className="text-muted-foreground">Your schedule is clear for now</p>
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

### 4.3 Dashboard Data Fetching

```ts
// lib/dashboard/get-dashboard-data.ts
import { createClient } from '@/lib/supabase/server';
import { useRole } from '@/hooks/useRole';

export async function getDashboardData(userRole: string) {
  const supabase = createClient();
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  // Common data for all roles
  const { data: todayAppointments } = await supabase
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

  // Role-specific data
  let additionalData = {};

  if (userRole === 'admin') {
    const [{ count: totalPatients }] = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const [{ count: totalDoctors }] = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'doctor')
      .eq('is_active', true);

    const [{ count: weekAppointments }] = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', weekStart.toISOString())
      .lte('scheduled_at', weekEnd.toISOString());

    additionalData = {
      totalPatients,
      totalDoctors,
      weekAppointments,
    };
  } else if (userRole === 'doctor') {
    // Get doctor's specific data
    const { data: doctorProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'doctor')
      .single();

    if (doctorProfile) {
      const [{ count: myWeekAppointments }] = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorProfile.id)
        .gte('scheduled_at', weekStart.toISOString())
        .lte('scheduled_at', weekEnd.toISOString());

      additionalData = {
        myWeekAppointments,
      };
    }
  }

  return {
    todayAppointments: todayAppointments || [],
    ...additionalData,
  };
}
```

### 4.4 Admin Dashboard

```tsx
// app/[locale]/(dashboard)/dashboard/page.tsx
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data';
import { useRole } from '@/hooks/useRole';

export default async function AdminDashboard() {
  const { role } = useRole();
  const data = await getDashboardData(role as string);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your clinic overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={data.totalPatients || 0}
          description="Registered patients"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Today's Appointments"
          value={data.todayAppointments?.length || 0}
          description="Scheduled for today"
          icon={Calendar}
        />
        <StatsCard
          title="This Week"
          value={data.weekAppointments || 0}
          description="Appointments this week"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Staff"
          value={data.totalDoctors || 0}
          description="Doctors & assistants"
          icon={Activity}
        />
      </div>

      {/* Upcoming Appointments */}
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
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
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data';

export default async function DoctorDashboard() {
  const data = await getDashboardData('doctor');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your appointments and patients
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Appointments"
          value={data.todayAppointments?.length || 0}
          description="Scheduled for today"
          icon={Calendar}
        />
        <StatsCard
          title="This Week"
          value={data.myWeekAppointments || 0}
          description="Your appointments"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Patients Seen"
          value="24"
          description="This month"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Avg Duration"
          value="45m"
          description="Appointment length"
          icon={Clock}
        />
      </div>

      {/* My Appointments */}
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">My Schedule</h2>
        <UpcomingAppointments
          appointments={data.todayAppointments || []}
          maxItems={8}
        />
      </div>
    </div>
  );
}
```

### 4.6 Assistant Dashboard

```tsx
// app/[locale]/(dashboard)/dashboard/assistant-page.tsx
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { Calendar, Users, Plus, Clock } from 'lucide-react';
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AssistantDashboard() {
  const data = await getDashboardData('assistant');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Assistant Dashboard</h1>
        <p className="text-muted-foreground">
          Manage clinic operations and scheduling
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/appointments/new">
          <Button className="w-full justify-start" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </Link>
        <Link href="/patients/new">
          <Button className="w-full justify-start" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Appointments"
          value={data.todayAppointments?.length || 0}
          description="All doctors"
          icon={Calendar}
        />
        <StatsCard
          title="Patients Registered"
          value="156"
          description="Total patients"
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Check-ins Today"
          value="12"
          description="Patient arrivals"
          icon={Clock}
        />
        <StatsCard
          title="Pending Forms"
          value="3"
          description="Need attention"
          icon={Plus}
        />
      </div>

      {/* All Appointments */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today's Schedule</h2>
          <Link href="/appointments">
            <Button variant="outline">View All</Button>
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

## Implementation Steps

### Dashboard Components

- [ ] Create reusable StatsCard component
- [ ] Build UpcomingAppointments component
- [ ] Implement dashboard data fetching utilities
- [ ] Add loading states and error handling

### Role-Specific Dashboards

- [ ] Build admin dashboard with clinic-wide metrics
- [ ] Create doctor dashboard with personal statistics
- [ ] Implement assistant dashboard with operational focus
- [ ] Add quick action buttons for assistants

### Data Integration

- [ ] Connect to Supabase for real-time data
- [ ] Implement proper error handling
- [ ] Add data refresh functionality
- [ ] Optimize queries for performance

## Deliverables

- Role-specific dashboard pages
- Reusable dashboard components
- Real-time data integration
- Responsive statistics display
- Quick action functionality

## Estimated Time

1 day
