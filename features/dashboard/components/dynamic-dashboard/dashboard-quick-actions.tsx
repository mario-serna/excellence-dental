'use client';
import { ELEMENT_VARIANTS } from '@/components/ui/types';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';
import { DashboardQuickAction } from '@/providers/domain/dashboard/types/dashboard.types';
import { useTranslations } from 'next-intl';
import { QuickActionButton } from '../ui/quick-action-button';

interface DashboardQuickActionsProps {
  actions: DashboardQuickAction[];
  className?: React.ComponentProps<'div'>['className'];
}

export function DashboardQuickActions({
  actions,
  className,
}: DashboardQuickActionsProps) {
  const isDesktop = useIsDesktop();
  const t = useTranslations();

  if (actions.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div>
        <h2 className="text-lg font-semibold">
          {t('dashboard.quickActions.title')}
        </h2>
      </div>
      <div
        className={`flex gap-3 ${
          isDesktop ? 'flex-col' : 'flex-row overflow-x-auto flex-nowrap'
        } ${!isDesktop && actions.length > 6 ? 'flex-wrap' : ''}`}
      >
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            href={action.href}
            variant={action.variant}
            icon={action.icon}
            isMobile={!isDesktop}
            text={action.text}
          />
        ))}
        <QuickActionButton
          variant={ELEMENT_VARIANTS.outline}
          icon="Plus"
          isMobile={!isDesktop}
          text={t('dashboard.quickActions.addNew')}
          disabled
        />
      </div>
    </div>
  );
}
