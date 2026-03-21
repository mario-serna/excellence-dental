import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DashboardPage locale={locale} />;
}
