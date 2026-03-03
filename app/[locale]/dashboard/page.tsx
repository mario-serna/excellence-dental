import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('navigation.dashboard')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">
            {t('dashboard.metrics.totalPatients')}
          </h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.metrics.activePatients')}
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">
            {t('dashboard.metrics.todaysAppointments')}
          </h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.metrics.scheduledToday')}
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">
            {t('dashboard.metrics.pendingTasks')}
          </h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.metrics.toBeCompleted')}
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">
            {t('dashboard.metrics.revenueThisMonth')}
          </h3>
          <p className="text-2xl font-bold text-primary">$0</p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.metrics.totalCollected')}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.recentActivity')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {t('dashboard.noRecentActivity')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
