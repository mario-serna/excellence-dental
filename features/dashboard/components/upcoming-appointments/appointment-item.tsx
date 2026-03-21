import { Badge } from '@/components/ui/badge';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Appointment, APPOINTMENT_STATUS } from '@/providers/domain/dashboard';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface AppointmentItemProps {
  appointment: Appointment;
}

export function AppointmentItem({ appointment }: AppointmentItemProps) {
  const t = useTranslations();

  const getStatusConfig = (
    status: string
  ): {
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    icon: LucideIcon;
    label: string;
  } => {
    switch (status) {
      case APPOINTMENT_STATUS.scheduled:
        return {
          variant: 'outline',
          icon: Calendar,
          label: t('appointments.status.scheduled'),
        };
      case APPOINTMENT_STATUS.confirmed:
        return {
          variant: 'default',
          icon: CheckCircle,
          label: t('appointments.status.confirmed'),
        };
      case APPOINTMENT_STATUS.completed:
        return {
          variant: 'secondary',
          icon: Check,
          label: t('appointments.status.completed'),
        };
      case APPOINTMENT_STATUS.cancelled:
        return {
          variant: 'destructive',
          icon: XCircle,
          label: t('appointments.status.cancelled'),
        };
      case APPOINTMENT_STATUS.no_show:
        return {
          variant: 'destructive',
          icon: AlertCircle,
          label: t('appointments.status.noShow'),
        };
      default:
        return {
          variant: 'outline',
          icon: Calendar,
          label: t('appointments.status.unknown'),
        };
    }
  };

  const [time, date] = useMemo(
    () => appointment.time.split(' '),
    [appointment.time]
  );

  return (
    <Item
      variant="outline"
      className="h-20 hover:bg-accent/50 transition-colors"
    >
      <ItemMedia>
        <div className="flex flex-col items-center justify-center">
          <span>{time}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </ItemMedia>
      <Separator orientation="vertical" />
      <ItemContent>
        <div className="font-medium">{appointment.patient.name}</div>
        <div className="text-sm text-muted-foreground">
          {appointment.type || 'General'}
        </div>
      </ItemContent>
      <ItemActions>
        <Badge
          variant={getStatusConfig(appointment.status).variant}
          className="flex items-center gap-1.5"
          aria-label={`${t('appointments.status.label')}: ${getStatusConfig(appointment.status).label}`}
        >
          {(() => {
            const StatusIcon = getStatusConfig(appointment.status).icon;
            return <StatusIcon className="h-3 w-3" aria-hidden="true" />;
          })()}
          {getStatusConfig(appointment.status).label}
        </Badge>
      </ItemActions>
    </Item>
  );
}
