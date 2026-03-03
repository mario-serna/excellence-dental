'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRole } from '@/features/auth/core/hooks/use-role';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { APP_ROUTES } from '@/lib/routes';
import { Bell, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';
import { MobileNav } from './mobile-nav';

function TopNavComponent() {
  const pathname = usePathname();
  const { role } = useRole();
  const t = useTranslations();

  const pageTitle = useMemo(() => {
    if (pathname.startsWith(APP_ROUTES.dashboard))
      return t('navigation.dashboard');
    if (pathname.startsWith(APP_ROUTES.patients))
      return t('navigation.patients');
    if (pathname.startsWith(APP_ROUTES.appointments))
      return t('navigation.appointments');
    if (pathname.startsWith(APP_ROUTES.users)) return t('navigation.users');
    return t('navigation.dashboard');
  }, [pathname, t]);

  const roleBadgeColor = useMemo(() => {
    switch (role) {
      case USER_ROLES.admin:
        return 'destructive';
      case USER_ROLES.doctor:
        return 'default';
      case USER_ROLES.assistant:
        return 'secondary';
      default:
        return 'outline';
    }
  }, [role]);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile Navigation - Integrated into header */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        <h1 className="text-base md:text-lg font-semibold truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - Hidden on mobile, visible on desktop */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 w-32 md:w-64" />
        </div>

        {/* Mobile Search Icon - Only on mobile */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Role Badge - Hidden on very small screens */}
        <Badge variant={roleBadgeColor} className="capitalize hidden sm:block">
          {role}
        </Badge>
      </div>
    </header>
  );
}

export const TopNav = memo(TopNavComponent);
