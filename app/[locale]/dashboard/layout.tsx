import { Sidebar, TopNav } from '@/components/layout';
import { AuthProviderFactory } from '@/features/auth/core/factories/auth-provider-factory';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { APP_ROUTES } from '../../../lib/routes';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authProvider = AuthProviderFactory.createMiddlewareProvider();

  // Get actual request headers from the incoming request
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get('cookie') || '';

  // Create request with actual cookies using proper URL construction
  const request = new Request(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    {
      headers: {
        cookie: cookieHeader,
      },
    }
  );

  const {
    data: { user },
  } = await authProvider.getUser(request);

  if (!user) {
    redirect(APP_ROUTES.login);
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
