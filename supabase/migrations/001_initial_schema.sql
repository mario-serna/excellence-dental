-- 001_initial_schema.sql
-- Initial database schema for Excellence Dental Management System

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
