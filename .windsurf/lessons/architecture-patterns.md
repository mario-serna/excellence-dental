# Feature-Based Architecture & Plugin Design

## Problem Description

- Traditional authentication systems tightly couple business logic to specific providers
- File organization often follows technical concerns rather than feature boundaries
- String-based role definitions lead to maintenance issues and type safety problems
- Hard to switch authentication providers without extensive code changes
- Utility functions that depend on React hooks violate React rules

## Solution Steps

1. **Feature-Based Organization**: Structure code by features (`features/auth/`) rather than technical layers
2. **Plugin Architecture**: Abstract external dependencies behind interfaces for provider swapping
3. **Type-Safe Roles**: Use object-based role definitions instead of string unions
4. **Next.js Integration**: Use thin wrapper route files with feature page components
5. **Dependency Injection**: Pass dependencies (like translation functions) as parameters instead of importing hooks

## Prevention Strategies

- Always design interfaces before implementing providers
- Use dependency injection for external services
- Prefer object-based constants over string literals
- Separate routing concerns from business logic
- **Never use React hooks in utility functions** - pass dependencies as parameters
- **Use factory pattern for provider creation** to enable plugin switching

## Dependency Injection Pattern

### **Problem**

```tsx
// ❌ React hook in utility function - violates rules
export const getRoleDisplayName = (role: string): string => {
  const t = useTranslations('auth.roles'); // Hook violation!
  return t(role, { fallback: role });
};
```

### **Solution**

```tsx
// ✅ Dependency injection - pure function
export const getRoleDisplayName = (
  role: string,
  t: (key: string, options?: { fallback?: string }) => string
): string => {
  return t(role, { fallback: role });
};
```

### **Usage in Components**

```tsx
// In React component
const t = useTranslations('auth.roles');
const displayName = getRoleDisplayName(user.role, t);
```

## Factory Pattern for Providers

### **Provider Factory**

```typescript
export class AuthProviderFactory {
  static createAuthProvider(): IAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported auth provider: ${authConfig.provider}`);
    }
  }

  static createMiddlewareProvider(): IMiddlewareAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseMiddlewareProvider();
      default:
        throw new Error(
          `Unsupported middleware provider: ${authConfig.provider}`
        );
    }
  }
}
```

### **Configuration-Driven Selection**

```typescript
// Environment-based provider switching
export const authConfig = {
  provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || AUTH_PROVIDERS.SUPABASE,
  // ...
};
```

## Recovery Commands

```bash
# Create feature structure
mkdir -p features/auth/{core,providers,components,pages,config}

# Type checking
bun run build

# Format code
bun run format
```

---

# Type-Safe Role Management

## Problem Description

- String union types like `'admin' | 'doctor' | 'assistant'` are hard to maintain
- No single source of truth for role values
- Prone to typos and inconsistencies
- Difficult to iterate over roles or add new ones

## Solution Steps

1. **Object-Based Roles**: Define roles as const objects with keyof typeof
2. **Role Utilities**: Create helper functions for role checking and hierarchy
3. **Type Safety**: Leverage TypeScript for compile-time validation
4. **Enhanced Hooks**: Build role-based hooks with utility functions

## Prevention Strategies

- Never use string literals for role definitions
- Always create utility functions for role operations
- Use const assertions for role objects
- Implement role hierarchy for complex permission systems

## Recovery Commands

```bash
# Check type errors
bun run type-check

# Test role utilities
bun test role-utils.test.ts

# Format role types
bun run format
```

---

# Next.js App Router Integration

## Problem Description

- Feature-based architecture needs to work with Next.js app router conventions
- Page components should be reusable while respecting routing structure
- Need clear separation between route files and business logic
- Confusion about when to use 'use client' directive in page components

## Solution Steps

1. **Two-Layer Pages**: Feature page components + thin route wrappers
2. **Route Integration**: Import feature components into Next.js route files
3. **Layout Integration**: Use feature layouts for route groups
4. **Middleware Connection**: Connect feature services to Next.js middleware
5. **Smart Client Boundaries**: Place 'use client' at the right component level

## Client vs Server Component Guidelines

### **Use Server Components (Default)**

- Pure layout and composition
- Static content rendering
- Only composing client components
- Better performance and SEO

### **Use Client Components ('use client')**

- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onSubmit)
- Browser APIs (window, document)
- Form state management
- Interactive UI elements

### **Example Pattern**

```tsx
// ❌ Wrong: Unnecessary client directive
'use client';
export function LoginPage() {
  return <LoginForm />; // Only composition
}

// ✅ Correct: Server component composing client component
export function LoginPage() {
  return <LoginForm />; // LoginForm handles client logic
}
```

## Prevention Strategies

- Keep route files minimal and focused on routing only
- Place all business logic in feature components
- Use TypeScript for proper prop passing between layers
- Test feature components in isolation
- **Only use 'use client' when page components need React hooks or browser APIs**
- **Prefer server components for page layouts that only compose client components**

## Recovery Commands

```bash
# Verify route structure
find app -name "page.tsx" | head -10

# Test feature components
bun test features/

# Check Next.js build
bun run build
```
