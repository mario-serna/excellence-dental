# 🦷 Dental Clinic Management System — POC Plan

## Overview

This document provides the main overview and entry point to the detailed implementation phases. Each phase has been broken down into separate files for easier navigation and focused development.

## Quick Access to Phases

| Phase            | File                                                            | Est. Time    | Status |
| ---------------- | --------------------------------------------------------------- | ------------ | ------ |
| 0 — Setup        | [phase-0-setup.md](./plan-steps/phase-0-setup.md)               | 0.5 day      | ⏳     |
| 1 — Database     | [phase-1-database.md](./plan-steps/phase-1-database.md)         | 1 day        | ⏳     |
| 2 — Auth         | [phase-2-auth.md](./plan-steps/phase-2-auth.md)                 | 1 day        | ⏳     |
| 3 — Layout       | [phase-3-layout.md](./plan-steps/phase-3-layout.md)             | 0.5 day      | ⏳     |
| 4 — Dashboard    | [phase-4-dashboard.md](./plan-steps/phase-4-dashboard.md)       | 1 day        | ⏳     |
| 5 — Patients     | [phase-5-patients.md](./plan-steps/phase-5-patients.md)         | 2 days       | ⏳     |
| 6 — Appointments | [phase-6-appointments.md](./plan-steps/phase-6-appointments.md) | 2 days       | ⏳     |
| 7 — Reminders    | [phase-7-reminders.md](./plan-steps/phase-7-reminders.md)       | 1 day        | ⏳     |
| 8 — User Mgmt    | [phase-8-users.md](./plan-steps/phase-8-users.md)               | 1 day        | ⏳     |
| 9 — Polish       | [phase-9-polish.md](./plan-steps/phase-9-polish.md)             | 1 day        | ⏳     |
| **Total**        |                                                                 | **~11 days** |

## Tech Stack

| Layer         | Technology                                           |
| ------------- | ---------------------------------------------------- |
| Framework     | Next.js 14 (App Router)                              |
| Backend / DB  | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| UI Components | shadcn/ui                                            |
| Styling       | Tailwind CSS                                         |
| Language      | TypeScript                                           |
| Email         | Resend                                               |
| Forms         | React Hook Form + Zod                                |
| State         | Zustand (lightweight, POC-friendly)                  |
| i18n          | next-intl (Spanish default)                          |

---

## 🚀 Deployment Checklist

- [ ] Push to GitHub
- [ ] Connect repo to Vercel, set all env variables
- [ ] Run Supabase migrations in production project
- [ ] Deploy Edge Function: `supabase functions deploy send-reminders`
- [ ] Set Edge Function cron schedule in Supabase Dashboard
- [ ] Verify Resend domain (or use sandbox for POC)
- [ ] Smoke test: login as each role and verify correct access

---

## 📦 Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.1",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zod": "^3",
    "zustand": "^4",
    "resend": "^2",
    "date-fns": "^3",
    "next-intl": "^3",
    "lucide-react": "^0.400",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2"
  }
}
```

---

## 🗓️ Estimated POC Timeline

| Phase            | Work                          | Est. Time    |
| ---------------- | ----------------------------- | ------------ |
| 0 — Setup        | Project scaffold, shadcn, env | 0.5 day      |
| 1 — Database     | Migrations, RLS, triggers     | 1 day        |
| 2 — Auth         | Login, middleware, role hook  | 1 day        |
| 3 — Layout       | Sidebar, nav shell            | 0.5 day      |
| 4 — Dashboard    | Stats cards, upcoming table   | 1 day        |
| 5 — Patients     | List, profile, records        | 2 days       |
| 6 — Appointments | List, booking, conflict check | 2 days       |
| 7 — Reminders    | Edge function, email          | 1 day        |
| 8 — User Mgmt    | Admin user CRUD               | 1 day        |
| 9 — Polish       | Skeletons, toasts, seed data  | 1 day        |
| **Total**        |                               | **~11 days** |
