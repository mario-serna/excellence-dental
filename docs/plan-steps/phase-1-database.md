# 🗄️ Phase 1 — Database & Auth Setup

## Overview
Database schema creation, Row Level Security (RLS) policies, and authentication triggers setup.

## 1.1 Run Migrations

### Schema Definition
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

## 1.2 Row Level Security (RLS)

### Security Policies
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

## 1.3 Set Up Supabase Auth Trigger

### Automatic Profile Creation
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

## Implementation Steps

### Database Setup
- [ ] Access Supabase Dashboard → SQL Editor
- [ ] Run `001_initial_schema.sql` migration
- [ ] Run RLS policies migration
- [ ] Run auth trigger migration
- [ ] Verify table creation in Database section
- [ ] Test RLS policies with different user roles

### Verification
- [ ] Create test users for each role (admin, doctor, assistant)
- [ ] Verify profile auto-creation on user signup
- [ ] Test RLS policies:
  - Assistant cannot delete patients
  - Non-admin cannot access admin functions
  - All roles can view appointments
  - Only doctors/admin can update appointments

## Deliverables
- Complete database schema with all tables
- Row Level Security policies implemented
- Authentication triggers for profile creation
- Test data and user verification

## Estimated Time
1 day
