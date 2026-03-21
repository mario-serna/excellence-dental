'use client';

import { Button } from '@/components/ui/button';
import { Appointment } from '@/providers/domain/dashboard';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { UpcomingAppointments } from '../upcoming-appointments';

interface DashboardScheduleProps {
  appointments: Appointment[];
  maxItems?: number;
  className?: React.ComponentProps<'div'>['className'];
}

export function DashboardSchedule({
  appointments,
  maxItems = 5,
  className,
}: DashboardScheduleProps) {
  const t = useTranslations();
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {t('dashboard.schedule.title')}
        </h2>
        <Link href="/appointments">
          <Button variant="outline">{t('dashboard.schedule.viewAll')}</Button>
        </Link>
      </div>
      <UpcomingAppointments
        appointments={appointments || []}
        maxItems={maxItems}
      />
    </div>
  );
}
