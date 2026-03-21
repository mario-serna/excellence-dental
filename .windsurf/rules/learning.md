---
trigger: always_on
description: This file serves as the central entry point for all lessons learned and problem-solving strategies. It references the comprehensive lessons in ../lessons/ for detailed educational content.
---

# Learning & Problem-Solving Hub

## Overview

This file serves as the central entry point for all lessons learned and problem-solving strategies. For comprehensive educational content, patterns, and detailed guidance, refer to the lessons directory at **@[.windsurf/lessons]**.

## 🎯 Quick Access to Lessons

### **Critical Lessons for Implementation**

#### **[implementation-checklist.md](../lessons/implementation-checklist.md)** - MANDATORY BEFORE CODING

- 5-step implementation process
- Object-based constants patterns
- Feature-based organization rules
- Dependency injection principles
- Memory triggers and red flags

#### **[development-environment.md](../lessons/development-environment.md)** - FILE NAMING COMPLIANCE

- **kebab-case MANDATORY for ALL files**
- Environment setup procedures
- Common configuration issues
- Recovery commands

#### **[architecture-patterns.md](../lessons/architecture-patterns.md)** - FEATURE-BASED ARCHITECTURE

- Feature-based screaming architecture
- Dashboard classification as feature
- Plugin-based dependency decoupling
- Type-safe role management

#### **[component-reusability.md](../lessons/component-reusability.md)** - COMPONENT REUSABILITY PRINCIPLES

- Critical principles for creating truly reusable React components
- Avoid translation props that violate reusability
- Component self-contained i18n management
- Single responsibility and loose coupling patterns

### **Supporting Lessons**

#### **[github-workflow.md](../lessons/github-workflow.md)** - COLLABORATION

- Branch management and naming
- Pull request processes
- Tool limitations and workarounds

#### **[code-quality.md](../lessons/code-quality.md)** - FORMATTING & STANDARDS

- Prettier configuration
- VSCode setup and automation
- Common formatting issues

#### **[testing.md](../lessons/testing.md)** - QUALITY ASSURANCE

- Testing infrastructure setup
- Test organization and strategies
- Coverage goals and best practices

#### **[ui-design-implementation.md](../lessons/ui-design-implementation.md)** - UI PATTERNS

- Design system guidelines
- Responsive design patterns
- Component conventions

## 🚨 Phase 4 Critical Insights (Dashboard Implementation)

### **Architecture Classification**

**Lesson**: Dashboard is a FEATURE, not shared components
**Details**: See **[architecture-patterns.md](../lessons/architecture-patterns.md)**

```
✅ CORRECT: features/dashboard/ (complete feature)
❌ WRONG: components/dashboard/ (shared components)
```

### **File Naming Compliance**

**Lesson**: kebab-case is MANDATORY for ALL files
**Details**: See **[development-environment.md](../lessons/development-environment.md)**

```
✅ CORRECT: stats-card.tsx, upcoming-appointments.tsx
❌ WRONG: StatsCard.tsx, UpcomingAppointments.tsx
```

### **Object-Based Constants**

**Lesson**: Never use string literals in switch statements
**Details**: See **[implementation-checklist.md](../lessons/implementation-checklist.md)**

```typescript
✅ CORRECT: case APPOINTMENT_STATUS.scheduled:
❌ WRONG: case 'scheduled':
```

## 📋 Implementation Process (MANDATORY)

Before writing ANY code, follow this exact sequence:

1. **LESSONS FIRST** - Read **[implementation-checklist.md](../lessons/implementation-checklist.md)** completely
2. **PATTERNS SECOND** - Study existing codebase patterns (sidebar.tsx example)
3. **COMPLIANCE THIRD** - Verify against **[my-mistakes.md](../rules/my-mistakes.md)**
4. **IMPLEMENT FOURTH** - Write code following established patterns
5. **VERIFY FIFTH** - Test, format, and validate

## 🎯 Memory Triggers

### **Red Flags** → STOP and check lessons

- String literals in switch statements → **[implementation-checklist.md](../lessons/implementation-checklist.md)**
- PascalCase file names → **[development-environment.md](../lessons/development-environment.md)**
- Technical layer organization → **[architecture-patterns.md](../lessons/architecture-patterns.md)**
- React hooks in utilities → **[implementation-checklist.md](../lessons/implementation-checklist.md)**

### **Green Flags** → Continue with confidence

- Object-based constants (USER_ROLES.admin)
- Feature-based organization (features/dashboard/)
- Dependency injection patterns
- kebab-case file naming

## 🔧 Quick Recovery Commands

```bash
# Reset to clean state
git reset --hard HEAD && git clean -fd

# Reinstall dependencies
bun run clean && bun install

# Reformat project
bun run format

# Run tests
bun run test
```

## 📚 When to Study

### **Before Starting Work**

- **MANDATORY**: **[implementation-checklist.md](../lessons/implementation-checklist.md)**
- **MANDATORY**: **[development-environment.md](../lessons/development-environment.md)**
- **MANDATORY**: **[my-mistakes.md](../rules/my-mistakes.md)**

### **During Implementation**

- Pattern verification: **[implementation-checklist.md](../lessons/implementation-checklist.md)**
- Architecture guidance: **[architecture-patterns.md](../lessons/architecture-patterns.md)**
- File naming: **[development-environment.md](../lessons/development-environment.md)**

### **When Encountering Problems**

- Search relevant lesson in **@[.windsurf/lessons]**
- Try recovery commands above
- Check **[my-mistakes.md](../rules/my-mistakes.md)**

---

**REMEMBER: This file is the ENTRY POINT. All detailed educational content lives in the lessons directory. Follow the rules → check lessons → implement correctly.**
