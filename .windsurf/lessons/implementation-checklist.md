# Implementation Checklist & Pattern Reference

## 🎯 Pre-Implementation Checklist

**Before writing ANY code, always complete this checklist:**

### ✅ Phase 1: Research

- [ ] **Read relevant lessons** in `.windsurf/lessons/`
- [ ] **Find existing patterns** in the codebase
- [ ] **Check compliance** with `.windsurf/rules/code.md`
- [ ] **Verify architecture patterns** from lessons

### ✅ Phase 2: Pattern Verification

- [ ] **Using object-based constants** (no string literals)
- [ ] **Following feature-based organization** (`features/auth/`)
- [ ] **Applying dependency injection** (no React hooks in utilities)
- [ ] **Using factory patterns** for providers
- [ ] **Following SOLID principles**

### ✅ Phase 3: Implementation

- [ ] **Code follows established patterns exactly**
- [ ] **TypeScript strict mode compliance**
- [ ] **Proper error handling implemented**
- [ ] **Prettier formatting ready**

## 📚 Critical Pattern References

### ✅ Object-Based Constants (NEVER use string literals)

```typescript
// ❌ WRONG - String literals
switch (type) {
  case 'admin':
    return true; // AVOID!
  case 'clinical':
    return false; // AVOID!
}

// ✅ CORRECT - Object-based constants
switch (type) {
  case USER_ROLES.admin:
    return true; // CORRECT!
  case ROUTE_TYPES.CLINICAL:
    return false; // CORRECT!
}
```

### ✅ Feature-Based Organization

```
features/
├── auth/
│   ├── core/
│   │   ├── types/
│   │   ├── interfaces/
│   │   └── factories/
│   ├── providers/
│   ├── components/
│   └── middleware/
```

### ✅ Dependency Injection Pattern

```typescript
// ❌ WRONG - React hook in utility
export const getRoleName = (role: string) => {
  const t = useTranslations(); // Hook violation!
  return t(role);
};

// ✅ CORRECT - Dependency injection
export const getRoleName = (role: string, t: (key: string) => string) => {
  return t(role);
};
```

### ✅ Factory Pattern for Providers

```typescript
export class AuthProviderFactory {
  static createAuthProvider(): IAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported provider: ${authConfig.provider}`);
    }
  }
}
```

## 🚨 Memory Triggers

### When you see these patterns → STOP and check lessons:

- **Switch statements** → Must use object-based constants
- **New types** → Must use const objects with keyof typeof
- **File organization** → Must follow feature-based structure
- **Utility functions** → Must use dependency injection
- **Provider creation** → Must use factory pattern

### Red Flags 🚩

```
❌ String literals in switch cases
❌ React hooks in utility functions
❌ Technical layer organization
❌ Hardcoded route strings
❌ Direct provider instantiation
❌ Missing dependency injection
```

### Green Flags ✅

```
✅ Object-based constants (USER_ROLES.admin)
✅ Feature-based folders (features/auth/core)
✅ Factory pattern usage
✅ Dependency injection
✅ Interface abstractions
✅ SOLID principles
```

## 🔍 Quick Reference Commands

```bash
# Before implementation:
grep -r "pattern" .windsurf/lessons/
grep -r "similar-pattern" features/
bun run type-check

# After implementation:
bun run format
bun run test
bun run build
```

## 📋 Implementation Process

1. **LESSONS FIRST** - Read relevant lessons completely
2. **PATTERNS SECOND** - Find and study existing examples
3. **COMPLIANCE THIRD** - Verify against all rules
4. **IMPLEMENT FOURTH** - Write the code following patterns
5. **VERIFY FIFTH** - Test, format, and validate

## ⚡ Quick Pattern Templates

### Route Types

```typescript
export const ROUTE_TYPES = {
  PUBLIC: 'public',
  ADMIN: 'admin',
  CLINICAL: 'clinical',
} as const;

export type RouteType = (typeof ROUTE_TYPES)[keyof typeof ROUTE_TYPES];
```

### Role Checking

```typescript
export class AccessControl {
  static canAccess(userRole: string, routeType: RouteType): boolean {
    switch (routeType) {
      case ROUTE_TYPES.ADMIN:
        return userRole === USER_ROLES.admin;
      case ROUTE_TYPES.CLINICAL:
        return ROLE_GROUPS[ROLE_GROUP_KEYS.CLINICAL].includes(userRole as any);
      default:
        return true;
    }
  }
}
```

---

**REMEMBER: The lessons are correct. Follow them exactly. Don't innovate on established patterns.**
