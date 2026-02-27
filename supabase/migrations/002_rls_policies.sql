-- 002_rls_policies.sql
-- Implement Row Level Security policies for all tables

-- Helper function to get current user's role
create or replace function get_my_role()
returns text as $$
begin
  return coalesce(
    auth.jwt() ->> 'role',
    (select role from profiles where id = auth.uid()),
    'anonymous'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table patients enable row level security;
alter table patient_records enable row level security;
alter table appointments enable row level security;
alter table reminder_logs enable row level security;

-- Profiles policies
-- All authenticated users can view profiles
create policy "Profiles: View all"
  on profiles for select
  using (auth.role() = 'authenticated');

-- Admin can manage all profiles
create policy "Profiles: Admin full access"
  on profiles for all
  using (get_my_role() = 'admin')
  with check (get_my_role() = 'admin');

-- Users can view their own profile
create policy "Profiles: View own"
  on profiles for select
  using (id = auth.uid());

-- Users can update their own profile (except role)
create policy "Profiles: Update own"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- Patients policies
-- All authenticated users can view patients
create policy "Patients: View all"
  on patients for select
  using (auth.role() = 'authenticated');

-- Doctors and Admins can create patients
create policy "Patients: Create by doctor or admin"
  on patients for insert
  with check (get_my_role() in ('doctor', 'admin'));

-- Doctors and Admins can update patients
create policy "Patients: Update by doctor or admin"
  on patients for update
  using (get_my_role() in ('doctor', 'admin'))
  with check (get_my_role() in ('doctor', 'admin'));

-- Admin can delete patients
create policy "Patients: Delete by admin"
  on patients for delete
  using (get_my_role() = 'admin');

-- Patient Records policies
-- All authenticated users can view patient records
create policy "Patient Records: View all"
  on patient_records for select
  using (auth.role() = 'authenticated');

-- Doctors and Assistants can create patient records
create policy "Patient Records: Create by doctor or assistant"
  on patient_records for insert
  with check (get_my_role() in ('doctor', 'assistant'));

-- Doctors and Assistants can update patient records
create policy "Patient Records: Update by doctor or assistant"
  on patient_records for update
  using (get_my_role() in ('doctor', 'assistant'))
  with check (get_my_role() in ('doctor', 'assistant'));

-- Admin can delete patient records
create policy "Patient Records: Delete by admin"
  on patient_records for delete
  using (get_my_role() = 'admin');

-- Appointments policies
-- All authenticated users can view appointments
create policy "Appointments: View all"
  on appointments for select
  using (auth.role() = 'authenticated');

-- All authenticated users can create appointments
create policy "Appointments: Create by authenticated"
  on appointments for insert
  with check (auth.role() = 'authenticated');

-- Doctors and Admins can update appointments
create policy "Appointments: Update by doctor or admin"
  on appointments for update
  using (get_my_role() in ('doctor', 'admin'))
  with check (get_my_role() in ('doctor', 'admin'));

-- Reminder Logs policies
-- All authenticated users can view reminder logs
create policy "Reminder Logs: View all"
  on reminder_logs for select
  using (auth.role() = 'authenticated');

-- Admin can manage reminder logs
create policy "Reminder Logs: Admin full access"
  on reminder_logs for all
  using (get_my_role() = 'admin')
  with check (get_my_role() = 'admin');
