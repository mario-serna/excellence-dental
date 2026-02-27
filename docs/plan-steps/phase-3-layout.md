# 👥 Phase 3 — Layout & Navigation

## Overview

Create the main application shell with sidebar navigation, top navigation, and role-based menu items.

## Steps

### 3.1 Dashboard Layout Shell

```tsx
// app/[locale]/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

### 3.2 Sidebar Component

```tsx
// components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';
import { useRole } from '@/hooks/useRole';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
  FileText,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { isAdmin } = useRole();
  const userRole = user?.app_metadata?.role;

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Dental Clinic</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          const isActive = pathname.startsWith(item.href);
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-xs">
              {user?.user_metadata?.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">
              {user?.user_metadata?.full_name}
            </p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 3.3 Top Navigation Component

```tsx
// components/layout/TopNav.tsx
'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { useTranslations } from 'next-intl';

export function TopNav() {
  const pathname = usePathname();
  const { role } = useRole();
  const t = useTranslations();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return t('navigation.dashboard');
    if (pathname.startsWith('/patients')) return t('navigation.patients');
    if (pathname.startsWith('/appointments'))
      return t('navigation.appointments');
    if (pathname.startsWith('/admin')) return t('navigation.users');
    return 'Dashboard';
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'assistant':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 w-64" />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Role Badge */}
        <Badge variant={getRoleBadgeColor()} className="capitalize">
          {role}
        </Badge>
      </div>
    </header>
  );
}
```

### 3.4 Mobile Responsive Navigation

```tsx
// components/layout/MobileNav.tsx
'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
```

### 3.5 Updated Layout with Mobile Support

```tsx
// app/[locale]/(dashboard)/layout.tsx (updated)
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
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
```

## Navigation Structure

### Role-Based Menu Access

| Menu Item    | Route           | Admin | Doctor | Assistant |
| ------------ | --------------- | ----- | ------ | --------- |
| Dashboard    | `/dashboard`    | ✅    | ✅     | ✅        |
| Patients     | `/patients`     | ✅    | ✅     | ✅        |
| Appointments | `/appointments` | ✅    | ✅     | ✅        |
| Users        | `/admin/users`  | ✅    | ❌     | ❌        |

### Breadcrumb Navigation

```tsx
// components/layout/Breadcrumb.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/admin': 'Admin',
  '/admin/users': 'Users',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = breadcrumbMap[path] || segment;

    return {
      label,
      path,
      isLast: index === pathSegments.length - 1,
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/dashboard" className="hover:text-foreground">
        Home
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {crumb.isLast ? (
            <span className="text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.path} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
```

## Implementation Steps

### Core Layout

- [ ] Create dashboard layout shell
- [ ] Build sidebar component with role-based navigation
- [ ] Implement top navigation with search and notifications
- [ ] Add mobile responsive navigation
- [ ] Create breadcrumb navigation

### Navigation Features

- [ ] Implement active state highlighting
- [ ] Add role-based menu filtering
- [ ] Create user profile section with logout
- [ ] Add search functionality (placeholder for POC)

### Responsive Design

- [ ] Test desktop layout (sidebar persistent)
- [ ] Test mobile layout (hamburger menu)
- [ ] Test tablet layout (collapsible sidebar)
- [ ] Verify navigation works across all screen sizes

## Deliverables

- Complete application layout shell
- Role-based navigation system
- Responsive design for all screen sizes
- User authentication integration
- Mobile-friendly navigation

## Estimated Time

0.5 day
