# 🔐 Phase 2 — Authentication

## Overview

Implement authentication system using Supabase with feature-based screaming architecture, plugin-based dependency decoupling, and type-safe role management.

## Architecture Approach

### Feature-Based Structure
```
features/auth/
├── core/
│   ├── interfaces/
│   │   ├── auth-provider.interface.ts
│   │   ├── user.interface.ts
│   │   └── auth-config.interface.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── role.types.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-role.ts
│   └── services/
│       └── auth.service.ts
├── providers/
│   └── supabase/
│       ├── supabase-auth-provider.ts
│       ├── supabase-client.ts
│       └── supabase-config.ts
├── components/
│   ├── login-form.tsx
│   └── role-guard.tsx
├── pages/
│   └── login-page.tsx
├── config/
│   └── auth-config.ts
└── index.ts
```

### Plugin-Based Design
- Abstract external dependencies behind interfaces
- Provider swapping via configuration
- Type-safe role management with object-based constants
- Dependency injection for better testability

## Steps

### 2.1 Supabase Client Setup

#### Browser Client
```ts
// features/auth/providers/supabase/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

export const createSupabaseClient = () => {
  return createBrowserClient(
    supabaseConfig.url,
    supabaseConfig.anonKey
  );
};
```

#### Server Client
```ts
// features/auth/providers/supabase/supabase-server-client.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from './supabase-config';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};
```

#### Middleware Client
```ts
// features/auth/providers/supabase/supabase-middleware-client.ts
import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

export const createSupabaseMiddlewareClient = (request: Request) => {
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll: () => {
          const cookieHeader = request.headers.get('Cookie');
          if (!cookieHeader) return [];
          return cookieHeader.split(';').map(c => {
            const [name, ...rest] = c.split('=');
            return { name: name.trim(), value: rest.join('=').trim() };
          });
        },
      },
    }
  );
};
```

### 2.2 Core Interfaces

#### Auth Provider Interface
```ts
// features/auth/core/interfaces/auth-provider.interface.ts
export interface IAuthProvider {
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
  updateUserRole(userId: string, role: string): Promise<void>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}
```

#### User Interface
```ts
// features/auth/core/interfaces/user.interface.ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  metadata?: Record<string, any>;
}
```

### 2.3 Type-Safe Role Management

#### Role Definitions
```ts
// features/auth/core/types/role.types.ts
export const USER_ROLES = {
  admin: 'admin',
  doctor: 'doctor',
  assistant: 'assistant',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type RoleValue = typeof USER_ROLES[UserRole];

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  [USER_ROLES.admin]: 100,
  [USER_ROLES.doctor]: 50,
  [USER_ROLES.assistant]: 25,
} as const;

// Role groups for easier permission checking
export const ROLE_GROUPS = {
  clinical: [USER_ROLES.doctor, USER_ROLES.assistant],
  administrative: [USER_ROLES.admin],
  all: Object.values(USER_ROLES),
} as const;
```

#### Role Utilities
```ts
// features/auth/core/utils/role-utils.ts
import { USER_ROLES, ROLE_HIERARCHY, ROLE_GROUPS, type UserRole } from '../types/role.types';

export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}

export function hasHigherRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isInRoleGroup(userRole: UserRole, group: keyof typeof ROLE_GROUPS): boolean {
  return ROLE_GROUPS[group].includes(userRole);
}
```

### 2.4 Supabase Provider Implementation

```ts
// features/auth/providers/supabase/supabase-auth-provider.ts
import { IAuthProvider, AuthResult, User } from '../../core/interfaces/auth-provider.interface';
import { createSupabaseClient } from './supabase-client';
import { USER_ROLES, type UserRole } from '../../core/types/role.types';

export class SupabaseAuthProvider implements IAuthProvider {
  private client = createSupabaseClient();

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata?.role as UserRole,
        }
      };
    } catch (err) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role as UserRole,
    };
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = this.client.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          callback(null);
          return;
        }

        callback({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role as UserRole,
        });
      }
    );

    return () => subscription.unsubscribe();
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await this.client.auth.admin.updateUserById(userId, {
      user_metadata: { role },
      app_metadata: { role },
    });
  }
}
```

### 2.5 Authentication Service

```ts
// features/auth/core/services/auth.service.ts
import { IAuthProvider } from '../interfaces/auth-provider.interface';
import { SupabaseAuthProvider } from '../../providers/supabase/supabase-auth-provider';
import { authConfig } from '../../config/auth-config';

export class AuthService {
  private provider: IAuthProvider;

  constructor() {
    this.provider = this.createProvider();
  }

  private createProvider(): IAuthProvider {
    switch (authConfig.provider) {
      case 'supabase':
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported auth provider: ${authConfig.provider}`);
    }
  }

  async signIn(email: string, password: string) {
    return this.provider.signIn(email, password);
  }

  async signOut() {
    return this.provider.signOut();
  }

  async getCurrentUser() {
    return this.provider.getCurrentUser();
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.provider.onAuthStateChange(callback);
  }
}

// Singleton instance
export const authService = new AuthService();
```

### 2.6 Authentication Hooks

#### Use Auth Hook
```ts
// features/auth/core/hooks/use-auth.ts
'use client';
import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../interfaces/user.interface';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Get initial user
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signIn(email, password);
    
    if (result.success) {
      setUser(result.user!);
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, error, signIn, signOut };
}
```

#### Use Role Hook
```ts
// features/auth/core/hooks/use-role.ts
'use client';
import { useAuth } from './use-auth';
import { USER_ROLES, type UserRole, hasHigherRole, isInRoleGroup } from '../types/role.types';

export function useRole() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isAdmin: role === USER_ROLES.admin,
    isDoctor: role === USER_ROLES.doctor,
    isAssistant: role === USER_ROLES.assistant,
    
    // Enhanced role checking
    hasAccess: (requiredRole: UserRole) => role ? hasHigherRole(role, requiredRole) : false,
    isInGroup: (group: 'clinical' | 'administrative' | 'all') => role ? isInRoleGroup(role, group) : false,
    canAccessClinical: role ? isInRoleGroup(role, 'clinical') : false,
    canAccessAdmin: role === USER_ROLES.admin,
  };
}
```

### 2.7 Authentication Components

#### Login Form
```tsx
// features/auth/components/login-form.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../core/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { signIn, loading, error } = useAuth();
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setShowError(false);
    await signIn(data.email, data.password);
    setShowError(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && showError && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

#### Role Guard Component
```tsx
// features/auth/components/role-guard.tsx
'use client';
import { useRole } from '../core/hooks/use-role';
import { USER_ROLES, type UserRole } from '../core/types/role.types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, requireAll = false, fallback }: RoleGuardProps) {
  const { role, hasAccess } = useRole();

  if (!role) {
    return fallback || <div>Please log in to continue</div>;
  }

  const hasPermission = requireAll
    ? allowedRoles.every(r => hasAccess(r))
    : allowedRoles.some(r => hasAccess(r));

  if (!hasPermission) {
    return fallback || (
      <Alert variant="destructive">
        <AlertDescription>
          You don't have permission to access this page.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Convenience components
export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.admin]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ClinicalGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard 
      allowedRoles={[USER_ROLES.doctor, USER_ROLES.assistant]} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
```

### 2.8 Authentication Pages

#### Login Page
```tsx
// features/auth/pages/login-page.tsx
'use client';
import { LoginForm } from '../components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the clinic management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2.9 Middleware Implementation

```ts
// middleware.ts
import { createMiddlewareClient } from '@/features/auth/providers/supabase/supabase-middleware-client';
import { USER_ROLES, type UserRole } from '@/features/auth/core/types/role.types';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get user role for route protection
  const userRole = session?.user?.user_metadata?.role as UserRole | undefined;

  // Redirect unauthenticated users
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection
  if (request.nextUrl.pathname.startsWith('/admin') && userRole !== USER_ROLES.admin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Clinical routes protection
  if (request.nextUrl.pathname.startsWith('/clinical') && userRole && 
      ![USER_ROLES.doctor, USER_ROLES.assistant].includes(userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 2.10 Configuration

```ts
// features/auth/config/auth-config.ts
export const authConfig = {
  provider: 'supabase' as const,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export type AuthConfig = typeof authConfig;
```

### 2.11 Feature Exports

```ts
// features/auth/index.ts
export * from './core/types/auth.types';
export * from './core/types/role.types';
export * from './core/hooks/use-auth';
export * from './core/hooks/use-role';
export * from './components/login-form';
export * from './components/role-guard';
export * from './pages/login-page';
export * from './config/auth-config';
export { authService } from './core/services/auth.service';
```

## Implementation Steps

### Core Authentication

- [ ] Create core interfaces and types
- [ ] Implement role management system
- [ ] Build authentication service
- [ ] Create authentication hooks
- [ ] Implement Supabase provider
- [ ] Create login page with form validation
- [ ] Implement role guard component

### Testing & Verification

- [ ] Create admin user manually in Supabase Dashboard
- [ ] Test login flow with each role
- [ ] Verify middleware redirects:
  - Unauthenticated users → /login
  - Non-admin users → /dashboard (when accessing /admin)
  - Non-clinical users → /dashboard (when accessing /clinical)
- [ ] Test role-based component rendering
- [ ] Verify provider switching capability

## Deliverables

- Complete plugin-based authentication system
- Type-safe role management
- Middleware route protection
- Feature-based organization
- Login interface with error handling
- Admin user setup process

## Estimated Time

1 day
