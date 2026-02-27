# ✅ Phase 9 — Polish & POC Wrap-up

## Overview

Final refinements including loading states, error handling, mobile responsiveness, and demo data seeding.

## Steps

### 9.1 Loading States and Skeletons

```tsx
// components/ui/SkeletonCard.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}

// components/ui/SkeletonTable.tsx
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 9.2 Empty States

```tsx
// components/ui/EmptyState.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {description}
        </p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </CardContent>
    </Card>
  );
}
```

### 9.3 Toast Notifications System

```tsx
// components/ui/toaster.tsx
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme = 'system' } = useTheme();

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark' | 'system'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}
```

### 9.4 Confirmation Dialogs

```tsx
// components/ui/ConfirmDialog.tsx
'use client';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void>;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  children,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === 'destructive' && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={
              variant === 'destructive'
                ? 'bg-destructive hover:bg-destructive/90'
                : ''
            }
          >
            {loading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 9.5 Mobile Responsive Navigation

```tsx
// components/layout/MobileSidebar.tsx
'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### 9.6 Demo Data Seeding

```typescript
// scripts/seed-database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const demoDoctors = [
  {
    full_name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1-555-0123',
    email: 'sarah.johnson@dental-clinic.com',
    is_active: true,
  },
  {
    full_name: 'Dr. Michael Chen',
    role: 'doctor',
    phone: '+1-555-0124',
    email: 'michael.chen@dental-clinic.com',
    is_active: true,
  },
];

const demoPatients = [
  {
    full_name: 'John Smith',
    dob: '1985-05-15',
    gender: 'male',
    phone: '+1-555-0101',
    email: 'john.smith@email.com',
    address: '123 Main St, Anytown, USA 12345',
    notes: 'Allergic to penicillin, prefers morning appointments',
  },
  {
    full_name: 'Emily Davis',
    dob: '1992-08-22',
    gender: 'female',
    phone: '+1-555-0102',
    email: 'emily.davis@email.com',
    address: '456 Oak Ave, Sometown, USA 67890',
    notes: 'Regular patient, history of orthodontic work',
  },
  // Add 8 more patients...
];

const demoAppointments = [
  {
    patient_id: '', // Will be set after patient creation
    doctor_id: '', // Will be set after doctor creation
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration_mins: 60,
    status: 'confirmed',
    service_type: 'checkup',
    notes: 'Regular 6-month checkup',
  },
  // Add more appointments...
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Create doctors
    console.log('Creating doctors...');
    const { data: createdDoctors, error: doctorsError } = await supabase
      .from('profiles')
      .upsert(demoDoctors, { onConflict: 'email' })
      .select();

    if (doctorsError) throw doctorsError;
    console.log(`Created ${createdDoctors?.length || 0} doctors`);

    // Create patients
    console.log('Creating patients...');
    const { data: createdPatients, error: patientsError } = await supabase
      .from('patients')
      .upsert(demoPatients, { onConflict: 'email' })
      .select();

    if (patientsError) throw patientsError;
    console.log(`Created ${createdPatients?.length || 0} patients`);

    // Create appointments (linking to created doctors and patients)
    console.log('Creating appointments...');
    const appointmentsWithIds = demoAppointments.map((apt, index) => ({
      ...apt,
      patient_id:
        createdPatients?.[index % (createdPatients?.length || 1)]?.id || '',
      doctor_id:
        createdDoctors?.[index % (createdDoctors?.length || 1)]?.id || '',
    }));

    const { data: createdAppointments, error: appointmentsError } =
      await supabase.from('appointments').insert(appointmentsWithIds).select();

    if (appointmentsError) throw appointmentsError;
    console.log(`Created ${createdAppointments?.length || 0} appointments`);

    console.log('Database seeding completed successfully!');
    console.log('Demo users:');
    console.log('Admin: admin@dental-clinic.com / Admin123!');
    console.log('Doctor: sarah.johnson@dental-clinic.com / Doctor123!');
    console.log('Assistant: assistant@dental-clinic.com / Assistant123!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
```

### 9.7 Error Boundary

```tsx
// components/ErrorBoundary.tsx
'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to error reporting service
    // reportError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                {this.state.error?.message || 'An unexpected error occurred'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We apologize for the inconvenience. Please try refreshing the
                page or contact support if the problem persists.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 9.8 Performance Optimizations

```typescript
// lib/performance.ts
import { useEffect, useState } from 'react';

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Virtual scrolling for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
    onScroll: setScrollTop,
  };
}
```

## Implementation Steps

### Polish & UX

- [ ] Add loading skeletons to all data-fetching components
- [ ] Implement empty states with helpful CTAs
- [ ] Add toast notifications for all user actions
- [ ] Create confirmation dialogs for destructive actions

### Mobile Responsiveness

- [ ] Test and optimize mobile layouts
- [ ] Implement mobile-specific navigation
- [ ] Add touch-friendly interactions
- [ ] Optimize performance for mobile devices

### Error Handling

- [ ] Implement error boundaries
- [ ] Add comprehensive error logging
- [ ] Create user-friendly error messages
- [ ] Add retry mechanisms where appropriate

### Demo Data

- [ ] Create database seeding script
- [ ] Add realistic demo data
- [ ] Create test user accounts
- [ ] Document demo credentials

## Deliverables

- Polished, production-ready application
- Comprehensive error handling
- Mobile-responsive design
- Demo data and test accounts
- Performance optimizations

## Estimated Time

1 day
