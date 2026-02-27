---
trigger: always_on
description: When starting a new issue, you must create a new model decision to capture the reason for the creation of the issue, the proposed solution, and the impact on the project.
---

# GitHub Issue Workflow Rules

## Branch Naming Convention

For each issue you work on, you must create a new branch following this pattern:

```
<type>/<user>/<issue>-<scope>
```

### Examples:

- `feature/mario/1-project-set-up`
- `bugfix/mario/42-login-validation`
- `hotfix/mario/99-critical-security-patch`

### Branch Types:

- `feature` - New functionality
- `bugfix` - Bug fixes
- `hotfix` - Critical fixes that need immediate deployment
- `refactor` - Code refactoring without functional changes
- `docs` - Documentation updates
- `test` - Test additions or improvements

## Issue-Based Development Process

0. **Pre-Action Confirmation**
   - **Before creating or editing any GitHub resources (issues, PRs, branches)**
   - **Always ask for user confirmation first**
   - **Show a detailed preview of intended actions including:**
     - What will be created/edited
     - All parameters and configurations
     - Expected outcomes
     - Any side effects
     - **GitHub URLs for reference** (issue links, branch links, etc.)
   - **Wait for explicit user approval before proceeding**

1. **Before Starting Work**
   - Create a new branch using the naming convention above
   - **Agent must run git commands to create the branch and move to it**
   - Reference the issue number in the branch name
   - **Assign the issue to the user working on it**
   - Ensure the issue is assigned to you

2. **During Development**
   - Keep commits focused and atomic
   - Reference the issue number in commit messages: `Fixes #123`
   - Update the issue with progress as needed

3. **Before Creating Pull Request**
   - Ensure all tests pass
   - Update documentation if applicable
   - Link the pull request to the GitHub issue

4. **Pull Request Requirements**
   - Title should clearly describe the change
   - Description must reference the issue number
   - Use the same issue number in the PR title if possible
   - Request review from appropriate team members

## Issue States

- **Open**: Ready to be assigned
- **In Progress**: Branch created and work started
- **Review Ready**: Pull request created AND pushed
- **Done**: Pull request merged and moved to main branch

## Post-Completion Steps

After completing an issue:

- Ensure the pull request is merged
- **Move back to the main branch**
- Clean up local feature branch if needed
