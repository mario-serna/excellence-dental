# 🔐 Phase 2 — Authentication

## Overview
Implement authentication system with Supabase, middleware protection, and role-based access control.

## Steps

### 2.1 Supabase Client Setup

#### Browser Client
```ts
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()
```

#### Server Client
```ts
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}
```

#### Middleware Client
```ts
// lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  request.headers.set('x-user-id', session?.user?.id || '')
  request.headers.set('x-user-role', session?.user?.app_metadata?.role || '')

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}
```

### 2.2 Middleware Implementation

```ts
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session headers
  const response = await updateSession(request)
  
  // Get session for route protection
  const supabase = createMiddlewareClient({ req: request, res: response })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect unauthenticated users
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based route protection
  const role = session?.user?.app_metadata?.role
  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

### 2.3 Authentication Hooks

#### User Hook
```ts
// hooks/useUser.ts
'use client'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

#### Role Hook
```ts
// hooks/useRole.ts
'use client'
import { useUser } from './useUser'

export function useRole() {
  const { user } = useUser()
  const role = user?.app_metadata?.role as 'admin' | 'doctor' | 'assistant' | null
  
  return { 
    role, 
    isAdmin: role === 'admin', 
    isDoctor: role === 'doctor', 
    isAssistant: role === 'assistant' 
  }
}
```

### 2.4 Login Page

```tsx
// app/[locale]/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const t = useTranslations('auth')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('login')}</CardTitle>
          <CardDescription>
            Enter your credentials to access the clinic management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : t('loginButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 2.5 Role Guard Component

```tsx
// components/layout/RoleGuard.tsx
'use client'
import { useRole } from '@/hooks/useRole'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'doctor' | 'assistant')[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { role } = useRole()

  if (!role || !allowedRoles.includes(role)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-96">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
```

### 2.6 Initial Admin User Setup

#### Manual Admin Creation
1. Go to Supabase Dashboard → Authentication
2. Click "Add user" 
3. Enter admin email and temporary password
4. Go to Authentication → Users → Select the user
5. In "App metadata", add:
   ```json
   {
     "role": "admin",
     "full_name": "Admin User"
   }
   ```
6. Save changes

#### Admin Verification Script
```ts
// scripts/setup-admin.ts (run once)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupAdmin() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    'USER_UUID_HERE',
    {
      user_metadata: {
        role: 'admin',
        full_name: 'System Administrator'
      },
      app_metadata: {
        role: 'admin'
      }
    }
  )

  if (error) {
    console.error('Error setting up admin:', error)
  } else {
    console.log('Admin user setup complete')
  }
}

setupAdmin()
```

## Implementation Steps

### Core Authentication
- [ ] Create Supabase client configurations
- [ ] Implement middleware for route protection
- [ ] Build authentication hooks
- [ ] Create login page with form validation
- [ ] Implement role guard component

### Testing & Verification
- [ ] Create admin user manually in Supabase Dashboard
- [ ] Test login flow with each role
- [ ] Verify middleware redirects:
  - Unauthenticated users → /login
  - Non-admin users → /dashboard (when accessing /admin)
- [ ] Test role-based component rendering

## Deliverables
- Complete authentication system
- Middleware route protection
- Role-based access control
- Login interface with error handling
- Admin user setup process

## Estimated Time
1 day
