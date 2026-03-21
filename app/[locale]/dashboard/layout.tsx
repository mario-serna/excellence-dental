import { Sidebar, TopNav } from '@/components/layout';
import { APP_ROUTES } from '@/lib/routes';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverProviders } from '../../../providers/registry/registry-server-provider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const user = await serverProviders.auth.getUser(request);

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
