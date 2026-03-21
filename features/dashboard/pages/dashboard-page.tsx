import { USER_ROLES, type UserRole } from '@/providers/domain/auth';
import { serverProviders } from '@/providers/registry/registry-server-provider';
import { headers } from 'next/headers';
import { DynamicDashboard } from '../components/dynamic-dashboard';
import { UnauthorizedDashboard } from '../components/unauthorized-dashboard';

interface DashboardPageProps {
  role?: UserRole;
  locale: string;
}

export async function DashboardPage({ role, locale }: DashboardPageProps) {
  // Get user from server-side auth
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get('cookie') || '';

  const request = new Request(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    {
      headers: {
        cookie: cookieHeader,
      },
    }
  );

  const user = await serverProviders.auth.getUser(request);
  const userRole = user?.role as UserRole | undefined;

  // Use dashboard provider to get data and configuration
  if (
    user &&
    userRole &&
    (userRole === USER_ROLES.admin ||
      userRole === USER_ROLES.doctor ||
      userRole === USER_ROLES.assistant)
  ) {
    const dashboard = await serverProviders.dashboard.getDashboard(
      userRole,
      locale,
      request
    );
    return (
      <DynamicDashboard
        data={dashboard.data}
        locale={locale}
        userRole={userRole}
        user={user}
        config={dashboard.config}
      />
    );
  }

  // Fallback for unauthorized users
  return <UnauthorizedDashboard />;
}
