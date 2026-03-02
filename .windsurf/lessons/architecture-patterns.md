# Feature-Based Architecture & Plugin Design

## Problem Description

- Traditional authentication systems tightly couple business logic to specific providers
- File organization often follows technical concerns rather than feature boundaries
- String-based role definitions lead to maintenance issues and type safety problems
- Hard to switch authentication providers without extensive code changes

## Solution Steps

1. **Feature-Based Organization**: Structure code by features (`features/auth/`) rather than technical layers
2. **Plugin Architecture**: Abstract external dependencies behind interfaces for provider swapping
3. **Type-Safe Roles**: Use object-based role definitions instead of string unions
4. **Next.js Integration**: Use thin wrapper route files with feature page components

## Prevention Strategies

- Always design interfaces before implementing providers
- Use dependency injection for external services
- Prefer object-based constants over string literals
- Separate routing concerns from business logic

## Recovery Commands

```bash
# Create feature structure
mkdir -p features/auth/{core,providers,components,pages,config}

# Type checking
bun run type-check

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

## Solution Steps

1. **Two-Layer Pages**: Feature page components + thin route wrappers
2. **Route Integration**: Import feature components into Next.js route files
3. **Layout Integration**: Use feature layouts for route groups
4. **Middleware Connection**: Connect feature services to Next.js middleware

## Prevention Strategies

- Keep route files minimal and focused on routing only
- Place all business logic in feature components
- Use TypeScript for proper prop passing between layers
- Test feature components in isolation

## Recovery Commands

```bash
# Verify route structure
find app -name "page.tsx" | head -10

# Test feature components
bun test features/

# Check Next.js build
bun run build
```
