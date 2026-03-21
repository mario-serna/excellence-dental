'use client';

import { useTranslations } from 'next-intl';

interface DashboardHeaderProps {
  userName: string;
  locale: string;
  className?: React.ComponentProps<'div'>['className'];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function formatDate(locale: string): string {
  const now = new Date();
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

export function DashboardHeader({
  userName,
  locale,
  className,
}: DashboardHeaderProps) {
  const t = useTranslations();
  const greeting = getGreeting();
  const formattedDate = formatDate(locale);

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold">
        {t(`greeting.${greeting}`)}, {userName}
      </h2>
      <p className="text-muted-foreground">{formattedDate}</p>
    </div>
  );
}
