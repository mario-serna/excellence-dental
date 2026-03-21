import { Appointment } from '@/providers/domain/dashboard';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AppointmentItem } from './appointment-item';
import { AppointmentSkeleton } from './appointment-skeleton';

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
  const t = useTranslations();
  const displayAppointments = appointments.slice(0, maxItems);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: maxItems }).map((_, i) => (
          <AppointmentSkeleton key={i} />
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
        <AppointmentItem key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
