'use client';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('messages');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{t('welcome')}</h1>
      <p className="text-lg">{t('description')}</p>
    </div>
  );
}
