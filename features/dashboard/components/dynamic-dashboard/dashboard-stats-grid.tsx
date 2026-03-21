import { cn } from '@/lib/utils';
import { DashboardStat } from '@/providers/domain/dashboard/types/dashboard.types';
import { StatsCard } from '../ui/stats-card';

interface DashboardStatsGridProps {
  stats: DashboardStat[];
  className?: React.ComponentProps<'div'>['className'];
}

export function DashboardStatsGrid({
  stats,
  className,
}: DashboardStatsGridProps) {
  if (stats.length === 0) return null;

  return (
    <div
      className={cn(
        'grid gap-2 md:gap-6 grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
