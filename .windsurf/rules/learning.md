---
trigger: always_on
---

# Learning & Problem-Solving Hub

## Overview

This file serves as the central entry point for all lessons learned and problem-solving strategies. As this knowledge base grows, individual topics have been organized into separate files for better maintainability and focus.

## Topic-Specific Lessons

### [UI Design Implementation](./ui-design-implementation.md)

- Comprehensive UI design system guidelines
- Responsive design patterns and breakpoints
- Role-based UI filtering strategies
- Component conventions and accessibility
- Design tokens and shadcn/ui integration

### [Code Quality & Formatting](./code-quality.md)

- Prettier configuration and best practices
- VSCode setup and automation
- Common formatting issues and solutions
- Recovery commands and templates

### [Testing Setup & Best Practices](./testing.md)

- Testing infrastructure setup (Vitest, Testing Library)
- Test organization and configuration
- Testing strategies and coverage goals
- Common testing issues and solutions

### [GitHub Workflow & Collaboration](./github-workflow.md)

- Branch management and naming conventions
- Pull request processes and requirements
- Tool limitations and workarounds
- Git commands and API examples
- **Branch creation process** - Always check existence before creating

### [Development Environment Setup](./development-environment.md)

- Initial project configuration
- Dependency management
- Git configuration and .gitignore
- Recovery commands and Docker setup

## Quick Reference

### Immediate Actions for Common Issues

#### Tool/Command Problems

1. **PowerShell vs Bash**: Use PowerShell-specific commands
2. **File Encoding**: Use IDE file creation instead of command-line
3. **JSON Errors**: Validate syntax and use proper escaping

#### Git Workflow Issues

1. **Branch Switching**: Commit or stash changes first
2. **Large Commits**: Group related files, plan structure
3. **Line Endings**: Configure .gitattributes early

#### Development Issues

1. **Missing Dependencies**: Install all required packages upfront
2. **Configuration Conflicts**: Understand precedence, document settings
3. **Testing Failures**: Verify setup with basic test

### Essential Recovery Commands

```bash
# Reset to clean state
git reset --hard HEAD && git clean -fd

# Reinstall dependencies
bun run clean && bun install

# Reformat project
bun run format

# Run tests
bun run test

# Check git status
git status --porcelain
```

### Verification Checklist

- [ ] Dependencies installed: `bun install`
- [ ] Formatting working: `bun run format`
- [ ] Tests passing: `bun run test`
- [ ] Git status clean: `git status`
- [ ] Configuration valid: Check JSON syntax

## When to Use This Hub

### Before Starting Work

- Check topic-specific lessons for setup guidance
- Verify environment configuration
- Review best practices checklists

### When Encountering Problems

- Search relevant topic-specific lesson
- Try recovery commands
- Document new solutions

### During Onboarding

- Read all topic-specific lessons
- Set up environment according to templates
- Understand workflow processes

### Regular Maintenance

- Review lessons monthly for updates
- Add new solutions as discovered
- Share with team members

## Adding New Lessons

When encountering new problems or solutions:

1. **Identify the Topic** - Choose existing category or create new one
2. **Document the Problem** - What went wrong and why
3. **Provide Solutions** - Step-by-step resolution process
4. **Include Prevention** - How to avoid in the future
5. **Add Recovery Commands** - Quick fix commands
6. **Update This Hub** - Reference new lesson if needed
7. **Verify Correct Location** - Always create lessons in `.windsurf/lessons/` NOT `.windsurf/rules/lessons/`

### Lesson Template

````markdown
# Topic Name

## Problem Description

- What happened
- Why it occurred
- Impact on workflow

## Solution Steps

1. Step 1 with command/example
2. Step 2 with verification
3. Step 3 with validation

## Prevention Strategies

- How to avoid recurrence
- Best practices to implement
- Monitoring/checks to add

## Recovery Commands

```bash
# Quick fix commands
command1
command2
```
````

## Continuous Improvement

### Review Schedule

- **Daily**: Quick scan of recent issues
- **Weekly**: Update lessons with new findings
- **Monthly**: Comprehensive review and reorganization

### Knowledge Sharing

- Update lessons immediately after learning
- Include specific examples and commands
- Share with team members during onboarding
- Reference lessons in code reviews when relevant

### Tool Evaluation

- Regularly assess current tool effectiveness
- Test new tools in isolated environments
- Document migration strategies
- Keep backup options available

## Memory Triggers

### Red Flags

- Repeated similar errors
- Tool configuration conflicts
- Workflow confusion
- Inconsistent code formatting
- Missing test coverage
- Environment setup failures

### Prevention Opportunities

- Standardize setup processes
- Create templates for common tasks
- Document decision rationales
- Implement automated checks
- Regular knowledge sharing sessions

### When to Study

- Before starting new projects
- When onboarding team members
- During code reviews
- When troubleshooting issues
- Before implementing major changes
