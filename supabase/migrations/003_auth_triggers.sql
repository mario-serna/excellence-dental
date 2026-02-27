-- 003_auth_triggers.sql
-- Set up authentication triggers for automatic profile creation

-- Function to handle new user registration
create or replace function handle_new_user()
returns trigger as $$
begin
  -- Insert into profiles table with metadata from auth
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      'Unknown User'
    ),
    coalesce(
      new.raw_user_meta_data->>'role',
      'assistant'  -- Default role
    )
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to fire on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
