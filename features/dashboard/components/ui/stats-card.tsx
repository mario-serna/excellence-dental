import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string; // LucideIcon component name
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  loading,
}: StatsCardProps) {
  return (
    <Card className="flex flex-col py-2">
      <CardContent className="flex items-center gap-4 flex-1 px-4">
        <div>
          <DynamicIcon
            iconName={icon}
            className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground"
          />
        </div>
        <div className="flex flex-col h-full flex-1">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <div className="flex justify-between gap-2">
                {value}
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
              </div>
            )}
          </div>
          <CardTitle className="text-xs font-medium">{title}</CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}
