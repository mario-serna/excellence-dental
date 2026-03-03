---
trigger: always_on
description: Before writing any code, always follow the implementation protocol.
---

# Implementation Protocol - MANDATORY STEPS

## 🚨 BEFORE WRITING ANY CODE - FOLLOW THIS EXACTLY

### Step 1: LESSONS FIRST (MANDATORY)

```bash
# Always run this before implementing:
grep -r "topic" .windsurf/lessons/
cat .windsurf/lessons/implementation-checklist.md
cat .windsurf/rules/my-mistakes.md
```

### Step 2: PATTERN RESEARCH (MANDATORY)

```bash
# Find existing patterns in codebase:
grep -r "similar-pattern" features/
grep -r "USER_ROLES\|ROUTE_TYPES" features/auth/
```

### Step 3: COMPLIANCE CHECK (MANDATORY)

- [ ] Read implementation-checklist.md completely
- [ ] Reviewed my-mistakes.md
- [ ] Found 2+ examples of similar code
- [ ] Verified using object-based constants
- [ ] Confirmed feature-based organization

## 🔥 CRITICAL RULES - NEVER BREAK THESE

### 1. NO STRING LITERALS

```typescript
// ❌ NEVER
case 'admin': return true;

// ✅ ALWAYS
case USER_ROLES.admin: return true;
```

### 2. LESSONS BEFORE CODE

```typescript
// ❌ NEVER - Implement without reading lessons
// Jump straight to coding

// ✅ ALWAYS - Read lessons first
// 1. Read relevant lessons
// 2. Find existing patterns
// 3. Follow exactly
```

### 3. FEATURE-BASED ORGANIZATION

```
❌ NEVER: utils/, types/, components/
✅ ALWAYS: features/auth/core/, features/auth/providers/
```

### 4. DEPENDENCY INJECTION

```typescript
// ❌ NEVER - Hooks in utilities
export const utility = () => {
  const t = useTranslations(); // WRONG!
};

// ✅ ALWAYS - Inject dependencies
export const utility = (t: Function) => {
  return t('key');
};
```

## ⚡ QUICK VERIFICATION COMMANDS

```bash
# Before implementation:
cat .windsurf/lessons/implementation-checklist.md
cat .windsurf/rules/my-mistakes.md

# After implementation:
bun run format
bun run type-check
bun run test
```

## 🎯 MEMORY TRIGGER SYSTEM

When you see these patterns → STOP AND READ LESSONS:

- `case 'string':` → Read implementation-checklist.md
- Creating new files → Read architecture-patterns.md
- Utility functions → Read dependency injection section
- Provider creation → Read factory pattern section

## 📋 IMPLEMENTATION WORKFLOW

1. **STOP** - Don't write code yet
2. **READ** - lessons/implementation-checklist.md
3. **RESEARCH** - existing codebase patterns
4. **VERIFY** - compliance with all rules
5. **IMPLEMENT** - following established patterns exactly
6. **TEST** - format, type-check, test

---

**THIS IS NOT OPTIONAL. THIS IS MANDATORY.**
**LESSONS FIRST, IMPLEMENTATION SECOND.**
