import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UnauthorizedDashboard() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-8">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        </div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          {t('dashboard.unauthorized.message')}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {t('dashboard.unauthorized.description')}
        </p>
      </div>
    </div>
  );
}
