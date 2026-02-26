# 🦷 Dental Clinic Management System — POC Plan

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Backend / DB | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Email | Resend |
| Forms | React Hook Form + Zod |
| State | Zustand (lightweight, POC-friendly) |

---

## 🎨 Design System

### Color Palette

```
Primary      #0EA5E9  — Sky Blue     (trust, cleanliness, health)
Primary Dark #0284C7  — Deep Sky     (hover states, emphasis)
Neutral      #F8FAFC  — Off White    (backgrounds)
Surface      #FFFFFF  — White        (cards, panels)
Border       #E2E8F0  — Cool Gray    (dividers, inputs)
Text Primary #0F172A  — Slate 900    (headings)
Text Muted   #64748B  — Slate 500    (labels, secondary text)
Success      #10B981  — Emerald      (confirmed, completed)
Warning      #F59E0B  — Amber        (upcoming, pending)
Danger       #EF4444  — Red          (cancelled, errors)
```

### shadcn/ui Theme (add to `globals.css`)

```css
:root {
  --background:         0 0% 98.8%;
  --foreground:         215 28% 7%;
  --card:               0 0% 100%;
  --card-foreground:    215 28% 7%;
  --primary:            199 89% 48%;
  --primary-foreground: 0 0% 100%;
  --secondary:          210 40% 96%;
  --secondary-foreground: 215 28% 7%;
  --muted:              210 40% 96%;
  --muted-foreground:   215 16% 47%;
  --accent:             199 89% 48%;
  --accent-foreground:  0 0% 100%;
  --destructive:        0 84% 60%;
  --border:             214 32% 91%;
  --input:              214 32% 91%;
  --ring:               199 89% 48%;
  --radius:             0.5rem;
}
```

### Typography
- **Font**: Inter (Google Fonts) — clean, medical-grade readability
- Headings: `font-semibold`, Slate 900
- Body: `font-normal`, Slate 700
- Labels: `text-sm`, Slate 500

---

## 📁 Project Structure

```
dental-poc/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Sidebar + top nav shell
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── patients/
│   │   │   ├── page.tsx            ← Patient list
│   │   │   ├── new/page.tsx        ← Create patient
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← Patient profile
│   │   │       └── records/
│   │   │           └── new/page.tsx
│   │   ├── appointments/
│   │   │   ├── page.tsx            ← Appointments list/calendar
│   │   │   └── new/page.tsx        ← Book appointment
│   │   └── admin/
│   │       └── users/
│   │           └── page.tsx        ← User management (admin only)
│   └── api/
│       └── reminders/
│           └── route.ts
├── components/
│   ├── ui/                         ← shadcn generated components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   └── RoleGuard.tsx
│   ├── patients/
│   │   ├── PatientCard.tsx
│   │   ├── PatientForm.tsx
│   │   └── RecordForm.tsx
│   ├── appointments/
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentCard.tsx
│   │   └── StatusBadge.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       └── UpcomingAppointments.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← Browser client
│   │   ├── server.ts               ← Server client (RSC/API routes)
│   │   └── middleware.ts
│   ├── validations/
│   │   ├── patient.ts              ← Zod schemas
│   │   └── appointment.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   └── useRole.ts
├── middleware.ts                    ← Auth + role-based route protection
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       └── send-reminders/
│           └── index.ts
└── types/
    └── index.ts                    ← Shared TypeScript types
```

---

## 🗄️ Phase 0 — Project Setup

### Steps
- [ ] `npx create-next-app@latest dental-poc --typescript --tailwind --app`
- [ ] Install and init shadcn/ui: `npx shadcn@latest init`
- [ ] Install dependencies:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  npm install react-hook-form @hookform/resolvers zod
  npm install zustand
  npm install resend
  npm install date-fns
  ```
- [ ] Install shadcn components:
  ```bash
  npx shadcn@latest add button input label card badge
  npx shadcn@latest add dialog sheet select textarea
  npx shadcn@latest add table tabs avatar separator
  npx shadcn@latest add form toast dropdown-menu
  npx shadcn@latest add calendar popover
  ```
- [ ] Create Supabase project at supabase.com
- [ ] Configure `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RESEND_API_KEY=
  ```
- [ ] Apply theme variables to `globals.css`
- [ ] Set up Inter font in `layout.tsx`

---

## 🗄️ Phase 1 — Database & Auth Setup

### 1.1 Run Migrations

```sql
-- 001_initial_schema.sql

-- Profiles (extends Supabase Auth users)
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        text not null check (role in ('admin', 'doctor', 'assistant')),
  phone       text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Patients
create table patients (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  dob           date,
  gender        text check (gender in ('male', 'female', 'other')),
  phone         text,
  email         text,
  address       text,
  notes         text,
  created_by    uuid references profiles(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Patient Records (visit history)
create table patient_records (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid not null references patients(id) on delete cascade,
  visit_date       date not null default current_date,
  diagnosis        text,
  treatment_notes  text,
  prescriptions    text,
  next_visit_date  date,
  created_by       uuid references profiles(id),
  created_at       timestamptz default now()
);

-- Appointments
create table appointments (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references patients(id) on delete cascade,
  doctor_id      uuid not null references profiles(id),
  scheduled_at   timestamptz not null,
  duration_mins  int not null default 30,
  status         text not null default 'scheduled'
                 check (status in ('scheduled','confirmed','completed','cancelled','no_show')),
  service_type   text,
  notes          text,
  created_by     uuid references profiles(id),
  created_at     timestamptz default now()
);

-- Reminder Logs
create table reminder_logs (
  id               uuid primary key default gen_random_uuid(),
  appointment_id   uuid not null references appointments(id) on delete cascade,
  channel          text check (channel in ('email', 'sms')),
  recipient_type   text check (recipient_type in ('patient', 'doctor')),
  sent_at          timestamptz default now(),
  status           text check (status in ('sent', 'failed')),
  error_message    text
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger patients_updated_at
before update on patients
for each row execute function update_updated_at();
```

### 1.2 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
alter table profiles       enable row level security;
alter table patients       enable row level security;
alter table patient_records enable row level security;
alter table appointments   enable row level security;
alter table reminder_logs  enable row level security;

-- Helper function to get current user role
create or replace function get_my_role()
returns text as $$
  select (auth.jwt() -> 'app_metadata' ->> 'role')::text;
$$ language sql stable;

-- Profiles: users can read all, only admin can write
create policy "All roles can view profiles"
  on profiles for select using (auth.role() = 'authenticated');

create policy "Admin can manage profiles"
  on profiles for all using (get_my_role() = 'admin');

-- Patients: all roles can read/create, only admin can delete
create policy "Authenticated can view patients"
  on patients for select using (auth.role() = 'authenticated');

create policy "Doctor and admin can create patients"
  on patients for insert with check (get_my_role() in ('admin','doctor','assistant'));

create policy "Doctor and admin can update patients"
  on patients for update using (get_my_role() in ('admin','doctor'));

create policy "Only admin can delete patients"
  on patients for delete using (get_my_role() = 'admin');

-- Patient Records: all roles read, doctor/admin write, admin delete
create policy "Authenticated can view records"
  on patient_records for select using (auth.role() = 'authenticated');

create policy "Doctor and assistant can create records"
  on patient_records for insert with check (get_my_role() in ('admin','doctor','assistant'));

create policy "Only admin can delete records"
  on patient_records for delete using (get_my_role() = 'admin');

-- Appointments: all roles read, assistant cannot cancel
create policy "Authenticated can view appointments"
  on appointments for select using (auth.role() = 'authenticated');

create policy "All roles can create appointments"
  on appointments for insert with check (auth.role() = 'authenticated');

create policy "Doctor and admin can update appointments"
  on appointments for update using (get_my_role() in ('admin','doctor'));
```

### 1.3 Set Up Supabase Auth Trigger

```sql
-- Auto-create profile row when a new auth user is created
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_app_meta_data ->> 'role', 'assistant')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
```

---

## 🔐 Phase 2 — Authentication

### Steps
- [ ] Create `lib/supabase/client.ts` (browser client)
- [ ] Create `lib/supabase/server.ts` (server component client using cookies)
- [ ] Create `middleware.ts` — protect all `/dashboard/*` and `/admin/*` routes, redirect unauthenticated users to `/login`
- [ ] Build `/login` page with shadcn `Card` + `Form`
  - Email/password login via `supabase.auth.signInWithPassword()`
  - Show error states with shadcn `Alert`
  - Redirect to `/dashboard` on success
- [ ] Create `useRole()` hook — reads `app_metadata.role` from session
- [ ] Create `RoleGuard` component — renders children only if role matches, otherwise shows 403 state or redirects
- [ ] Create first Admin user manually via Supabase Dashboard and assign `role: admin` in `app_metadata`

### Middleware Logic

```ts
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = session?.user?.app_metadata?.role
  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 👥 Phase 3 — Layout & Navigation

### Steps
- [ ] Build `(dashboard)/layout.tsx` — persistent shell with sidebar and top nav
- [ ] Build `Sidebar.tsx`:
  - Logo + clinic name at top
  - Nav links filtered by role (admin sees Users link, others don't)
  - Active link highlight using `usePathname()`
  - User avatar + name + logout button at bottom
- [ ] Build `TopNav.tsx`:
  - Page title (dynamic)
  - Notification bell (static for POC)
  - User role badge

### Sidebar Nav Items by Role

| Link | Admin | Doctor | Assistant |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Patients | ✅ | ✅ | ✅ |
| Appointments | ✅ | ✅ | ✅ |
| Users (Admin) | ✅ | ❌ | ❌ |

---

## 🏠 Phase 4 — Dashboards

### Steps
- [ ] Build `StatsCard.tsx` — generic card showing a metric, label, and optional trend icon
- [ ] Build `UpcomingAppointments.tsx` — table of next 5 appointments with patient name, doctor, time, and status badge
- [ ] Build `/dashboard/page.tsx` with role-scoped data:

### Dashboard Metrics by Role

**Admin Dashboard**
- Total patients
- Today's appointments
- Appointments this week
- Active doctors/staff
- Recent activity feed

**Doctor Dashboard**
- My appointments today
- My appointments this week
- Recent patients I've seen
- Upcoming appointments table (own only)

**Assistant Dashboard**
- Today's appointments (all doctors)
- Upcoming appointments table
- Quick "Book Appointment" shortcut

---

## 🧑‍⚕️ Phase 5 — Patient Management

### Steps
- [ ] Build `/patients/page.tsx`:
  - Search bar (filter by name, phone)
  - Patient list with `PatientCard` or table rows
  - "New Patient" button (hidden for assistants if policy requires)
- [ ] Build `PatientForm.tsx` with Zod validation:
  - Full name, DOB, gender, phone, email, address, notes
  - shadcn `Form`, `Input`, `Select`, `Textarea`, `Button`
- [ ] Build `/patients/new/page.tsx` — wraps `PatientForm`
- [ ] Build `/patients/[id]/page.tsx`:
  - Patient info header (name, age, contact)
  - Tabs: **Overview** | **Records** | **Appointments**
  - Overview: summary of last visit, next appointment
  - Records tab: chronological list of `patient_records`
  - Appointments tab: all appointments for this patient
- [ ] Build `RecordForm.tsx`:
  - Visit date, diagnosis, treatment notes, prescriptions, next visit suggestion
- [ ] Build `/patients/[id]/records/new/page.tsx`

### Zod Schema Example

```ts
// lib/validations/patient.ts
export const patientSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  dob:       z.string().optional(),
  gender:    z.enum(['male', 'female', 'other']).optional(),
  phone:     z.string().min(7, 'Enter a valid phone number'),
  email:     z.string().email().optional().or(z.literal('')),
  address:   z.string().optional(),
  notes:     z.string().optional(),
})
```

---

## 📅 Phase 6 — Appointments

### Steps
- [ ] Build `/appointments/page.tsx`:
  - Toggle between **List view** and **Calendar view** (use shadcn `Tabs`)
  - List: table with patient, doctor, date/time, service, status badge, actions
  - Calendar: simple month grid highlighting booked days (can use a lightweight lib like `react-big-calendar` or a custom grid for POC)
  - Filter by status, doctor
- [ ] Build `AppointmentForm.tsx`:
  - Patient selector (searchable dropdown — shadcn `Combobox`)
  - Doctor selector (filtered to role = 'doctor')
  - Date + time picker (shadcn `Calendar` + `Select` for time slots)
  - Duration, service type, notes
  - **Conflict check**: before submit, query for overlapping appointments for the selected doctor
- [ ] Build `/appointments/new/page.tsx`
- [ ] Build `StatusBadge.tsx` — colored badge per status using the color palette
- [ ] Implement status update actions (confirm, complete, cancel) via dropdown menu on each appointment row

### Conflict Check Logic

```ts
// Check for overlapping appointments before booking
const { data: conflicts } = await supabase
  .from('appointments')
  .select('id')
  .eq('doctor_id', doctorId)
  .neq('status', 'cancelled')
  .lt('scheduled_at', endTime.toISOString())
  .gt('scheduled_at', startTime.toISOString()) // adjust for duration overlap

if (conflicts && conflicts.length > 0) {
  form.setError('scheduled_at', { message: 'Doctor has a conflicting appointment at this time' })
  return
}
```

---

## 🔔 Phase 7 — Reminders

### Steps
- [ ] Create Supabase Edge Function `send-reminders`:
  - Query appointments scheduled in the next 24 hours with status `scheduled` or `confirmed`
  - For each, send email to patient and doctor using Resend
  - Log result to `reminder_logs`
- [ ] Set up cron schedule in Supabase (every day at 8:00 AM clinic timezone)
- [ ] Build a simple email template (HTML string in the Edge Function):
  - Patient email: appointment date/time, doctor name, clinic address
  - Doctor email: patient name, appointment time, service type

### Edge Function Skeleton

```ts
// supabase/functions/send-reminders/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

Deno.serve(async () => {
  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`*, patients(*), profiles!appointments_doctor_id_fkey(*)`)
    .in('status', ['scheduled', 'confirmed'])
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', in24h.toISOString())

  for (const appt of appointments ?? []) {
    // Send to patient
    if (appt.patients?.email) {
      await resend.emails.send({
        from: 'clinic@yourdomain.com',
        to: appt.patients.email,
        subject: 'Appointment Reminder',
        html: `<p>Hi ${appt.patients.full_name}, your appointment is tomorrow at ${appt.scheduled_at}.</p>`,
      })
      await supabase.from('reminder_logs').insert({
        appointment_id: appt.id, channel: 'email',
        recipient_type: 'patient', status: 'sent',
      })
    }
  }

  return new Response(JSON.stringify({ ok: true }))
})
```

---

## 👤 Phase 8 — User Management (Admin Only)

### Steps
- [ ] Build `/admin/users/page.tsx`:
  - Table of all users: name, email, role badge, status (active/inactive), actions
  - "Invite User" button → opens a `Sheet` (slide-in panel)
- [ ] Build invite flow:
  - Call `supabase.auth.admin.inviteUserByEmail()` from a Next.js API route (requires service role key — must be server-side only)
  - Set role in `app_metadata` during invite
- [ ] Build edit user `Sheet`:
  - Change role via `Select`
  - Toggle `is_active`
  - Calls API route which uses `supabase.auth.admin.updateUserById()`
- [ ] Protect entire `/admin/*` subtree via middleware and `RoleGuard`

### API Route for Invite

```ts
// app/api/admin/invite/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  // Verify requester is admin first
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { email, role, full_name } = await request.json()

  const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
    options: { data: { role } },
  })

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}
```

---

## ✅ Phase 9 — Polish & POC Wrap-up

### Steps
- [ ] Add loading skeletons (shadcn `Skeleton`) on all data-fetching pages
- [ ] Add empty states for lists with no data (e.g., "No patients yet — add your first one")
- [ ] Add toast notifications (shadcn `Toaster`) for all create/update/delete actions
- [ ] Add confirmation dialogs (shadcn `AlertDialog`) for destructive actions (cancel appointment, deactivate user)
- [ ] Ensure all forms show field-level validation errors inline
- [ ] Test all RLS policies — verify assistant cannot cancel, non-admin cannot access `/admin`
- [ ] Mobile responsiveness check — sidebar collapses to hamburger menu on small screens
- [ ] Seed database with demo data (2 doctors, 1 assistant, 10 patients, 15 appointments)

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
    "lucide-react": "^0.400",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2"
  }
}
```

---

## 🗓️ Estimated POC Timeline

| Phase | Work | Est. Time |
|---|---|---|
| 0 — Setup | Project scaffold, shadcn, env | 0.5 day |
| 1 — Database | Migrations, RLS, triggers | 1 day |
| 2 — Auth | Login, middleware, role hook | 1 day |
| 3 — Layout | Sidebar, nav shell | 0.5 day |
| 4 — Dashboard | Stats cards, upcoming table | 1 day |
| 5 — Patients | List, profile, records | 2 days |
| 6 — Appointments | List, booking, conflict check | 2 days |
| 7 — Reminders | Edge function, email | 1 day |
| 8 — User Mgmt | Admin user CRUD | 1 day |
| 9 — Polish | Skeletons, toasts, seed data | 1 day |
| **Total** | | **~11 days** |