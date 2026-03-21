# Provider Architecture — Foundation Plan

## Registry + Auth Provider | Next.js 16 + TypeScript

> This is the **foundation layer**. Get this right and every future provider
> (database, storage, notifications) slots in without touching existing code.

---

## Folder Structure

```
/config
  env.config.ts                         ← All env vars loaded, validated, and exported here

/providers
  provider.ts                           ← Root abstract class — all providers extend this
  index.ts                              ← Public API — the only import consumers need
  registry.ts                           ← ProviderRegistry class + RegistryError
  bootstrap.server.ts                   ← bootstrapServerProviders() — server-only
  RegistryProvider.tsx                  ← Client bootstrap + React context + hooks

  /infrastructure
    /supabase
      server-client.ts                  ← getSupabaseServerClient() — imports from env.config
      client-client.ts                  ← getSupabaseBrowserClient() — imports from env.config

  /auth
    /core
      server-auth-provider.ts           ← Server-side base class with Request handling
      client-auth-provider.ts           ← Client-side base class with session management
      auth-error.ts                       ← Shared AuthError class
      index.ts                            ← Re-exports base classes
    /supabase
      utils.ts                          ← mapUser(raw: SupabaseUser): User + other helpers
      server-auth-provider.ts            ← extends ServerAuthProvider
      client-auth-provider.ts            ← extends ClientAuthProvider
      index.ts
    /mock
      mock-auth-provider.ts              ← extends ClientAuthProvider
      index.ts
    index.ts                            ← Re-exports contracts and types only
```

**Total: 17 files.** Every layer has a single responsibility.
Every subfolder has an index. Every implementation satisfies an explicit contract.

**🚨 Compliance Note**: This plan integrates with the existing `features/dashboard/` structure rather than creating parallel provider patterns. Dashboard functionality remains a complete business feature following the established architecture.

---

## File Responsibilities

| File                                       | Depends On                                            | Never Imports                    |
| ------------------------------------------ | ----------------------------------------------------- | -------------------------------- |
| `config/env.config.ts`                     | nothing                                               | Next.js, Supabase, any SDK       |
| `providers/provider.ts`                    | nothing                                               | Next.js, Supabase, any SDK       |
| `auth/core/server-auth-provider.ts`        | root `provider` only                                  | any SDK                          |
| `auth/core/client-auth-provider.ts`        | root `provider` only                                  | any SDK                          |
| `auth/core/auth-error.ts`                  | nothing                                               | any SDK, Next.js                 |
| `infrastructure/supabase/server-client.ts` | `env.config`, Supabase SSR, `next/headers`            | `'use client'` anything          |
| `infrastructure/supabase/client-client.ts` | `env.config`, Supabase browser                        | `next/headers`, server-only APIs |
| `auth/supabase/utils.ts`                   | Supabase types, `User` type                           | Next.js, `next/headers`          |
| `auth/supabase/server-auth-provider.ts`    | `core/server-auth-provider`, `utils`, `server-client` | `'use client'` anything          |
| `auth/supabase/client-auth-provider.ts`    | `core/client-auth-provider`, `utils`, `client-client` | `next/headers`, server-only APIs |
| `auth/mock/mock-auth-provider.ts`          | `core/client-auth-provider`                           | any SDK, Next.js                 |
| `registry.ts`                              | `auth/core/server-auth-provider` type only            | Next.js, Supabase, any SDK       |
| `bootstrap.server.ts`                      | `registry`, `auth/supabase`                           | `'use client'` anything          |
| `RegistryProvider.tsx`                     | `registry`, `auth/supabase`                           | `next/headers`, server-only APIs |

**The dependency rule:** abstractions point inward, implementations point outward.
`env.config.ts` and `Provider.ts` are the two innermost files — nothing depends on them
except everything else.

---

## Step 1 — Environment Config

One file. All env vars loaded, typed, and validated at startup.
No `process.env` access anywhere else in the codebase.

```ts
// config/env.config.ts

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: "${key}"\n` +
        `Add it to your .env.local file.`
    );
  }
  return value;
}

export const env = {
  supabase: {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
} as const;
```

**Why `as const`?** Makes every value a string literal type, not just `string`.
TypeScript will catch typos like `env.supabase.urll` at compile time.

When you add new providers, you add blocks here. The rest of the codebase
imports from `env.config` — no hunt for scattered `process.env` calls.

---

## Step 2 — Root Provider Abstract Class

Every provider in the system extends this. It enforces the `name` property
across all domains — auth, database, storage — without each abstract class
re-declaring it independently.

```ts
// providers/provider.ts

// Provider scope constants - avoids string repetition
export const PROVIDER_SCOPES = {
  SUPABASE: 'supabase',
  MOCK: 'mock',
} as const;

export const PROVIDER_CONTEXTS = {
  SERVER: 'server',
  CLIENT: 'client',
} as const;

export const PROVIDER_DOMAINS = {
  AUTH: 'auth',
  DATABASE: 'database',
  STORAGE: 'storage',
} as const;

export abstract class Provider {
  /**
   * Identifies the vendor, context, and domain of this implementation.
   * Convention: '<vendor>:<context>:<domain>'
   *
   * Examples:
   *   'supabase:server:auth'
   *   'supabase:client:auth'
   *   'mock:client:auth'
   */
  abstract readonly name: string;

  /**
   * Helper method to generate standardized provider names
   * Prevents string repetition across implementations
   */
  protected static createName(
    vendor: keyof typeof PROVIDER_SCOPES,
    context: keyof typeof PROVIDER_CONTEXTS,
    domain: keyof typeof PROVIDER_DOMAINS
  ): string {
    return `${PROVIDER_SCOPES[vendor]}:${PROVIDER_CONTEXTS[context]}:${PROVIDER_DOMAINS[domain]}`;
  }
}
```

**Benefits of this approach:**

- ✅ **No string repetition** - Each provider uses `ServerAuthProvider.createName(PROVIDER_SCOPES.SUPABASE)`
- ✅ **Type safety** - TypeScript validates vendor, context, and domain values
- ✅ **Consistent naming** - All providers follow the same convention
- ✅ **Easy refactoring** - Change naming in one place, updates everywhere
- ✅ **IntelliSense support** - Auto-complete for vendor/context/domain options

---

## Step 3 — Provider Naming Convention

Every provider uses the scoped naming convention with helper methods to avoid string repetition.

**Benefits of this approach:**

- ✅ **No string repetition** - Each provider uses `ServerAuthProvider.createName(PROVIDER_SCOPES.SUPABASE)`
- ✅ **Type safety** - TypeScript validates vendor, context, and domain values
- ✅ **Consistent naming** - All providers follow the same convention
- ✅ **Easy refactoring** - Change naming in one place, updates everywhere
- ✅ **IntelliSense support** - Auto-complete for vendor/context/domain options

---

## Step 4 — Auth Core Classes

Separate files for server and client base classes to handle different requirements.

```ts
// providers/auth/core/server-auth-provider.ts

import { Provider, PROVIDER_CONTEXTS, PROVIDER_DOMAINS } from '../../provider';
import type { User } from '../core/interfaces/auth-provider.interface';
import type { UserRole } from '../core/types/role.types';

export abstract class ServerAuthProvider extends Provider {
  abstract getUser(request: Request): Promise<User | null>;

  /**
   * Helper method for auth providers to generate names
   * Usage: return ServerAuthProvider.createName(PROVIDER_SCOPES.SUPABASE)
   */
  protected static createName(vendor: keyof typeof PROVIDER_SCOPES): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.SERVER,
      PROVIDER_DOMAINS.AUTH
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────────────
  // Every subclass — Supabase, mock — inherits these for free.
  // They are implemented here once because they depend only on getUser(),
  // which every auth provider must implement.

  async isAuthenticated(request: Request): Promise<boolean> {
    return (await this.getUser(request)) !== null;
  }

  async requireAuth(request: Request): Promise<User> {
    const user = await this.getUser(request);
    if (!user) {
      throw new AuthError('auth.errors.notAuthenticated', 401);
    }
    return user;
  }

  async requireRole(request: Request, ...roles: User['role'][]): Promise<User> {
    const user = await this.requireAuth(request);
    if (!roles.includes(user.role)) {
      throw new AuthError('auth.errors.insufficientRole', 403);
    }
    return user;
  }

  async isAdmin(request: Request): Promise<boolean> {
    const user = await this.getUser(request);
    return user?.role === USER_ROLES.admin;
  }
}
```

```ts
// providers/auth/core/client-auth-provider.ts

import { Provider, PROVIDER_CONTEXTS, PROVIDER_DOMAINS } from '../../provider';
import type {
  User,
  AuthResult,
} from '../core/interfaces/auth-provider.interface';
import type { UserRole } from '../core/types/role.types';
import { USER_ROLES } from '../core/types/role.types';

export abstract class ClientAuthProvider extends Provider {
  abstract signIn(email: string, password: string): Promise<AuthResult>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Promise<User | null>;
  abstract onAuthStateChange(callback: (user: User | null) => void): () => void;
  abstract updateUserRole(userId: string, role: UserRole): Promise<void>;

  /**
   * Helper method for auth providers to generate names
   * Usage: return ClientAuthProvider.createName(PROVIDER_SCOPES.SUPABASE)
   */
  protected static createName(vendor: keyof typeof PROVIDER_SCOPES): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.CLIENT,
      PROVIDER_DOMAINS.AUTH
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────────────
  // Client-side convenience methods that use getCurrentUser()

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  }

  async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new AuthError('auth.errors.notAuthenticated', 401);
    }
    return user;
  }

  async requireRole(...roles: User['role'][]): Promise<User> {
    const user = await this.requireAuth();
    if (!roles.includes(user.role)) {
      throw new AuthError('auth.errors.insufficientRole', 403);
    }
    return user;
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === USER_ROLES.admin;
  }

  // For server interface compatibility (used by registry)
  async getUser(request: Request): Promise<User | null> {
    return this.getCurrentUser();
  }
}
```

```ts
// providers/auth/core/auth-error.ts

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 401 | 403
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

```ts
// providers/auth/core/index.ts

export { ServerAuthProvider } from './server-auth-provider';
export { ClientAuthProvider } from './client-auth-provider';
export { AuthError } from './auth-error';
export { PROVIDER_SCOPES } from '../../provider';
```

---

## Step 5 — Infrastructure: Supabase Client Factory

Imports from `env.config` — no `process.env` access here.

```ts
// providers/infrastructure/supabase/server-client.ts
// ⚠️ Server-only. Uses next/headers — never import from Client Components.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/config/env.config';

export function getSupabaseServerClient() {
  return createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      getAll: () => cookies().getAll(),
      setAll: (cookiesToSet) =>
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies().set(name, value, options)
        ),
    },
  });
}
```

```ts
// providers/infrastructure/supabase/client-client.ts

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/config/env.config';

let instance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!instance) {
    instance = createBrowserClient(env.supabase.url, env.supabase.anonKey);
  }
  return instance;
}
```

---

## Step 6 — Supabase Auth Utils

All Supabase-specific helper functions for the auth domain live here.
The input is typed as `SupabaseUser` — not `any` — so shape changes
from the SDK are caught at compile time.

```ts
// providers/auth/supabase/utils.ts
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '../core/interfaces/auth-provider.interface';
import type { USER_ROLES } from '../core/types/role.types';

/**
 * Maps a raw Supabase user object to the application's User type.
 * This is the only place in the codebase that knows the Supabase user shape.
 * If Supabase changes their API, fix it here — nowhere else.
 */
export function mapUser(raw: SupabaseUser): User {
  return {
    id: raw.id,
    email: raw.email!,
    role: (raw.app_metadata?.role as User['role']) ?? USER_ROLES.assistant,
    metadata: {
      full_name: raw.user_metadata?.full_name as string,
      ...raw.user_metadata,
    },
  };
}

// Add future Supabase-specific auth helpers here.
// Examples:
//   export function mapSession(raw: SupabaseSession): Session { ... }
//   export function isExpired(raw: SupabaseSession): boolean { ... }
```

---

## Step 7 — Supabase Auth Implementations

Each class explicitly extends the appropriate base class.
TypeScript will error at compile time if a required method is missing.

```ts
// providers/auth/supabase/server-auth-provider.ts
// ⚠️ Server-only

import { getSupabaseServerClient } from '../../infrastructure/supabase/server-client';
import { ServerAuthProvider, PROVIDER_SCOPES } from '../core';
import { mapUser } from './utils';
import type { User } from '../core/interfaces/auth-provider.interface';

export class SupabaseServerAuthProvider extends ServerAuthProvider {
  readonly name = ServerAuthProvider.createName(PROVIDER_SCOPES.SUPABASE);
  private readonly supabase = getSupabaseServerClient();

  async getUser(request: Request): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapUser(data.user);
  }
}
```

```ts
// providers/auth/supabase/client-auth-provider.ts
'use client';

import { getSupabaseBrowserClient } from '../../infrastructure/supabase/client-client';
import { ClientAuthProvider, PROVIDER_SCOPES } from '../core';
import { mapUser } from './utils';
import type { AuthResult } from '../core/interfaces/auth-provider.interface';
import type { UserRole } from '../core/types/role.types';

export class SupabaseClientAuthProvider extends ClientAuthProvider {
  readonly name = ClientAuthProvider.createName(PROVIDER_SCOPES.SUPABASE);
  private authStateCallbacks: ((user: User | null) => void)[] = [];
  private readonly supabase = getSupabaseBrowserClient();

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: mapUser(data.user) };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapUser(data.user);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);

    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? mapUser(session.user) : null;
      callback(user);
    });

    return () => subscription.unsubscribe();
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      id: userId,
      data: {
        app_metadata: {
          role: role,
        },
      },
    });

    if (error) throw error;
  }
}

// providers/auth/supabase/index.ts
export { SupabaseServerAuthProvider } from './server-auth-provider';
export { SupabaseClientAuthProvider } from './client-auth-provider';
```

---

## Step 8 — Mock Auth Provider

```ts
// providers/auth/mock/mock-auth-provider.ts
import { ClientAuthProvider, PROVIDER_SCOPES } from '../core';
import type {
  User,
  AuthResult,
} from '../core/interfaces/auth-provider.interface';
import type { UserRole, USER_ROLES } from '../core/types/role.types';

const DEFAULT_USER: User = {
  id: 'mock-id',
  email: 'doctor@test.com',
  role: USER_ROLES.doctor,
  metadata: {},
};

export class MockAuthProvider extends ClientAuthProvider {
  readonly name = ClientAuthProvider.createName(PROVIDER_SCOPES.MOCK);
  private authStateCallbacks: ((user: User | null) => void)[] = [];

  constructor(private readonly mockUser: User | null = DEFAULT_USER) {
    super();
  }

  async signIn(_email: string, _password: string): Promise<AuthResult> {
    if (!this.mockUser)
      return { success: false, error: 'Mock: no user configured' };
    return { success: true, user: this.mockUser };
  }

  async signOut(): Promise<void> {
    /* no-op */
  }

  async getCurrentUser(): Promise<User | null> {
    return this.mockUser;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);
    callback(this.mockUser);
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    if (this.mockUser && this.mockUser.id === userId) {
      this.mockUser.role = role;
      this.authStateCallbacks.forEach((callback) => callback(this.mockUser));
    }
  }
}
```

```ts
// providers/auth/mock/index.ts
export { MockAuthProvider } from './mock-auth-provider';
```

---

## Step 9 — Auth Domain Index

```ts
// providers/auth/index.ts
// Re-exports existing interfaces and provider contracts.
// Concrete implementations are never part of the public API.

export { ServerAuthProvider, ClientAuthProvider, AuthError } from './core';
export type {
  User,
  AuthResult,
} from '../core/interfaces/auth-provider.interface';
```

---

## Step 10 — ProviderRegistry

```ts
import type { ServerAuthProvider } from './auth/core';

type ProviderMap = {
  auth: ServerAuthProvider;
  // database: DatabaseProvider ← future
  // storage: StorageProvider ← future
  // notifications: NotificationProvider
};

export class RegistryError extends Error {
  constructor(public readonly key: string) {
    super(
      `[ProviderRegistry] "${key}" has not been registered.\n` +
        `Server: call bootstrapServerProviders() in layout.tsx or proxy.ts.\n` +
        `Client: ensure <RegistryProvider> wraps your component tree.`
    );
    this.name = 'RegistryError';
  }
}

class ProviderRegistry {
  private readonly providers = new Map<keyof ProviderMap, unknown>();

  register<K extends keyof ProviderMap>(
    key: K,
    provider: ProviderMap[K]
  ): this {
    this.providers.set(key, provider);
    return this;
  }

  resolve<K extends keyof ProviderMap>(key: K): ProviderMap[K] {
    const provider = this.providers.get(key);
    if (!provider) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `[ProviderRegistry] Failed to resolve "${key}". Call stack:`
        );
        console.trace();
      }
      throw new RegistryError(key);
    }
    return provider as ProviderMap[K];
  }

  isRegistered(key: keyof ProviderMap): boolean {
    return this.providers.has(key);
  }

  /**
   * Returns all registered provider names.
   * Use during development to confirm which implementations are active:
   * console.log(registry.listRegistered())
   * // → { auth: 'supabase:server:auth' }
   */
  listRegistered(): Partial<Record<keyof ProviderMap, string>> {
    const result: Partial<Record<keyof ProviderMap, string>> = {};
    this.providers.forEach((provider, key) => {
      result[key] = (provider as any).name ?? 'unknown';
    });
    return result;
  }
}

export const registry = new ProviderRegistry();

// Typed proxy — property access resolves the provider automatically.
// Eliminates string literals at call sites and gives full autocomplete.
//
// providers.auth.getUser() ← typed as ServerAuthProvider
// providers.database.getPatients() ← typed as DatabaseProvider (future)
//
export const providers: ProviderMap = new Proxy({} as ProviderMap, {
  get(_target, key: string) {
    return registry.resolve(key as keyof ProviderMap);
  },
});
```

---

## Step 11 — Bootstrap Files

```ts
// providers/bootstrap.server.ts
// ⚠️ Server-only. Call only from layout.tsx and proxy.ts.

import { registry } from './registry';
import { SupabaseServerAuthProvider } from './auth/supabase';

// To switch to another provider — change this one import:
// import { ServerAuthProvider } from './auth/firebase'

export function bootstrapServerProviders(): void {
  registry.register('auth', new SupabaseServerAuthProvider());
  // .register('database', new ServerDatabaseProvider())  ← future
}

export { registry };
```

```tsx
// providers/RegistryProvider.tsx
'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { registry } from './registry';
import { SupabaseClientAuthProvider } from './auth/supabase';

// To switch to another provider — change this one import:
// import { ClientAuthProvider } from './auth/firebase'

function bootstrapClientRegistry(): void {
  registry.register('auth', new SupabaseClientAuthProvider());
  // .register('database', new ClientDatabaseProvider())  ← future
}

const RegistryContext = createContext(registry);

export function RegistryProvider({ children }: { children: ReactNode }) {
  const bootstrapped = useRef(false);
  if (!bootstrapped.current) {
    bootstrapClientRegistry();
    bootstrapped.current = true;
  }
  return (
    <RegistryContext.Provider value={registry}>
      {children}
    </RegistryContext.Provider>
  );
}

export function useRegistry() {
  return useContext(RegistryContext);
}
export function useAuth() {
  return useContext(RegistryContext).resolve('auth');
}
// export function useDatabase() { return useContext(RegistryContext).resolve('database') }
```

---

## Step 12 — Public API

```ts
// providers/index.ts

// Registry + proxy object — preferred over registry.resolve() at call sites
export { registry, providers, RegistryError } from './registry';

// Server bootstrap
export { bootstrapServerProviders } from './bootstrap.server';

// Client context + hooks
export { RegistryProvider, useRegistry, useAuth } from './RegistryProvider';

// Types and errors — re-export from existing auth interfaces
export type { User, AuthResult } from './auth';
export { AuthError } from './auth';
```

---

## Step 13 — Next.js 16 Integration

### Root layout

```tsx
// app/layout.tsx
import { bootstrapServerProviders } from '@/providers';
import { RegistryProvider } from '@/providers';

bootstrapServerProviders();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <RegistryProvider>{children}</RegistryProvider>
      </body>
    </html>
  );
}
```

### `proxy.ts`

```ts
// proxy.ts
import { type NextRequest, NextResponse } from 'next/server';
import { bootstrapServerProviders, providers } from '@/providers';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
import { APP_ROUTES } from '@/lib/routes';

bootstrapServerProviders();

const PUBLIC_PATHS = [APP_ROUTES.login];

export async function proxy(request: NextRequest) {
  const isPublic = PUBLIC_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );
  if (isPublic) return NextResponse.next();

  const user = await providers.auth.getUser(request);

  if (!user) {
    return NextResponse.redirect(new URL(APP_ROUTES.login, request.url));
  }
  if (
    request.nextUrl.pathname.startsWith(APP_ROUTES.admin) &&
    user.role !== USER_ROLES.admin
  ) {
    return NextResponse.redirect(new URL(APP_ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Server Component

```tsx
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { providers } from '@/providers';
import { APP_ROUTES } from '@/lib/routes';

export default async function DashboardPage() {
  const user = await providers.auth.getUser();
  if (!user) redirect(APP_ROUTES.login);
  return <Dashboard user={user} />;
}
```

### Server Action

```ts
// app/actions/auth.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { providers } from '@/providers';
import { APP_ROUTES } from '@/lib/routes';

export async function signInAction(formData: FormData) {
  const result = await providers.auth.signIn(
    formData.get('email') as string,
    formData.get('password') as string
  );
  if (result.error) return { error: result.error };
  redirect(APP_ROUTES.dashboard);
}

export async function signOutAction() {
  await providers.auth.signOut();
  redirect(APP_ROUTES.login);
}
```

### Client Component

```tsx
// components/layout/LogoutButton.tsx
'use client';

import { useAuth } from '@/providers';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/lib/routes';

export function LogoutButton() {
  const auth = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await auth.signOut();
        router.push(APP_ROUTES.login);
      }}
    >
      Cerrar sesión
    </button>
  );

This pattern ensures the provider system can grow with the application while maintaining consistency and type safety across all domains!

The auth foundation is never touched. Adding a new domain is mechanical:

```

1.  providers/database/provider.ts extends root provider
2.  providers/database/database-server-service.interface.ts server method contracts
3.  providers/database/database-client-service.interface.ts client method contracts
4.  providers/database/supabase/utils.ts typed mappers + helpers
5.  providers/database/database-client-service.interface.ts ← client method contracts
6.  providers/database/supabase/utils.ts ← typed mappers + helpers
7.  providers/database/supabase/server-database-provider.ts
8.  providers/database/supabase/client-database-provider.ts
9.  providers/database/supabase/index.ts
10. providers/database/mock/mock-database-provider.ts
11. providers/database/mock/index.ts
12. providers/database/index.ts

13. registry.ts → add database: DatabaseProvider to ProviderMap
14. bootstrap.server.ts → add .register('database', new ServerDatabaseProvider())
15. RegistryProvider.tsx → add .register('database', new ClientDatabaseProvider())
    → add export function useDatabase() { ... }
16. providers/index.ts → add exports for new domain
17. config/env.config.ts → add any new env vars (if needed)

```

`ServerDatabaseProvider` imports `getSupabaseServerClient()` from the existing
infrastructure module — same factory, no duplication.

---

## Checklist

### Config

- [ ] `config/env.config.ts` — `requireEnv()`, typed `env` object with `as const`

### Root

- [ ] `providers/provider.ts` — root abstract class with `abstract readonly name: string`

### Infrastructure

- [ ] `providers/infrastructure/supabase/server-client.ts` — `getSupabaseServerClient()`, imports `env.config`
- [ ] `providers/infrastructure/supabase/client-client.ts` — `getSupabaseBrowserClient()`, imports `env.config`

### Auth Domain

- [ ] `providers/auth/core/server-auth-provider.ts` — Server-side base class with Request handling
- [ ] `providers/auth/core/client-auth-provider.ts` — Client-side base class with session management
- [ ] `providers/auth/core/auth-error.ts` — Shared AuthError class
- [ ] `providers/auth/core/index.ts` — Re-exports base classes
- [ ] `providers/auth/supabase/utils.ts` — `mapUser(raw: SupabaseUser): User`
- [ ] `providers/auth/supabase/server-auth-provider.ts` — `name = PROVIDER_SCOPES.SUPABASE`, extends ServerAuthProvider
- [ ] `providers/auth/supabase/client-auth-provider.ts` — `name = PROVIDER_SCOPES.SUPABASE`, extends ClientAuthProvider
- [ ] `providers/auth/supabase/index.ts` — Exports Supabase providers
- [ ] `providers/auth/mock/mock-auth-provider.ts` — `name = PROVIDER_SCOPES.MOCK`, configurable
- [ ] `providers/auth/mock/index.ts` — Exports MockAuthProvider
- [ ] `providers/auth/index.ts` — Exports contracts and types only

### Registry & Bootstrap

- [ ] `providers/registry.ts` — `ProviderRegistry`, `RegistryError`, `providers` proxy, `listRegistered()`
- [ ] `providers/bootstrap.server.ts` — `bootstrapServerProviders()`
- [ ] `providers/RegistryProvider.tsx` — client bootstrap, `RegistryProvider`, `useAuth`
- [ ] `providers/index.ts` — full public API including `providers` proxy

### Next.js Wiring

- [ ] `app/layout.tsx` — `bootstrapServerProviders()` + `<RegistryProvider>`
- [ ] `proxy.ts` — `bootstrapServerProviders()` + `providers.auth.getUser()`
- [ ] `app/actions/auth.actions.ts` — `signInAction`, `signOutAction`

```

```

```
