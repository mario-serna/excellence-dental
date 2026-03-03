---
trigger: always_on
description: This file serves as a reference for common mistakes and prevention strategies.
---

# My Common Mistakes & Prevention

## 🚨 Critical Mistakes I Keep Making

### 1. String Literals Instead of Object-Based Constants

**Problem:** Using `'admin'` instead of `USER_ROLES.admin`
**Lesson Reference:** `architecture-patterns.md` - "Never use string literals for role definitions"
**Prevention:** Always use object-based constants from existing codebase

### 2. Not Checking Lessons Before Implementation

**Problem:** Jumping to implementation without reading lessons
**Lesson Reference:** All lessons are there to prevent these exact mistakes
**Prevention:** Mandatory lesson review before any code writing

### 3. Ignoring Established Patterns

**Problem:** Creating new patterns instead of following existing ones
**Lesson Reference:** Study existing codebase patterns first
**Prevention:** Always find 2-3 examples of similar code before implementing

## 🔧 Prevention Commands

### Before Any Implementation

```bash
# 1. Check lessons for relevant patterns
grep -r "topic" .windsurf/lessons/

# 2. Find existing codebase examples
grep -r "similar-pattern" features/

# 3. Verify compliance
bun run type-check
```

### Implementation Checklist

- [ ] Read lessons completely
- [ ] Found existing patterns
- [ ] Using object-based constants
- [ ] Following feature-based organization
- [ ] Applied dependency injection
- [ ] No string literals
- [ ] No React hooks in utilities

## 📚 Pattern Reference (Copy-Paste Ready)

### Object-Based Constants

```typescript
// ✅ ALWAYS do this
case USER_ROLES.admin: return true;
case ROUTE_TYPES.CLINICAL: return false;

// ❌ NEVER do this
case 'admin': return true;
case 'clinical': return false;
```

### Feature Organization

```typescript
// ✅ ALWAYS structure like this
features/auth/core/types/
features/auth/providers/
features/auth/components/

// ❌ NEVER organize by technical layers
utils/auth/
types/auth/
components/auth/
```

### Dependency Injection

```typescript
// ✅ ALWAYS inject dependencies
export const utility = (param: string, dependency: Function) => {
  return dependency(param);
};

// ❌ NEVER use hooks in utilities
export const utility = (param: string) => {
  const hook = useHook(); // WRONG!
  return hook(param);
};
```

## 🎯 Memory Triggers

When I see these → STOP and check lessons:

- `case 'string':` → Must use object constant
- `useTranslations()` in utility → Must use dependency injection
- Creating new files → Must follow feature-based structure
- Provider instantiation → Must use factory pattern

## ⚡ Quick Recovery Commands

```bash
# If I made a mistake:
bun run format
bun run type-check
git checkout -- file-to-reset

# To find correct patterns:
grep -r "USER_ROLES" features/auth/
grep -r "AuthProviderFactory" features/auth/
```

---

**RULE: Read lessons first, implement second. Never the other way around.**
