'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/core/hooks/use-auth';
import { useRole } from '@/features/auth/core/hooks/use-role';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { useNavigation } from '@/lib/hooks/use-navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    translationKey: 'dashboard',
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: Users,
    translationKey: 'patients',
  },
  {
    href: '/appointments',
    label: 'Appointments',
    icon: Calendar,
    translationKey: 'appointments',
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Settings,
    adminOnly: true,
    translationKey: 'users',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { hasAccess } = useRole();
  const { navigateToLogin } = useNavigation();
  const t = useTranslations();

  const handleLogout = async () => {
    await signOut();
    navigateToLogin();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {t('common.appName')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('common.appDescription')}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          if (item.adminOnly && !hasAccess(USER_ROLES.admin)) return null;

          const isActive =
            pathname.endsWith(item.href) || pathname.includes(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(`navigation.${item.translationKey}`)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.metadata?.avatar_url} />
            <AvatarFallback className="text-xs">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{user?.email}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
            title={t('auth.signOut')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
