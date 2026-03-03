'use client';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{t('messages.welcome')}</h1>
      <p className="text-lg">{t('messages.description')}</p>
    </div>
  );
}
