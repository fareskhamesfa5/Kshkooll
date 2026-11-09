-- Koshkool database setup for Supabase
-- Run the whole script in Supabase > SQL Editor > New query > Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text unique,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
-- Every newly registered auth user gets a student profile automatically.
create or replace function public.handle_new_koshkool_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
    values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'student'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_koshkool on auth.users;
create trigger on_auth_user_created_koshkool
  after insert on auth.users
  for each row execute procedure public.handle_new_koshkool_user();

-- A user can read only their own profile. They cannot promote themselves.
drop policy if exists "Users can read own Koshkool profile" on public.profiles;
create policy "Users can read own Koshkool profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- No client-side INSERT/UPDATE/DELETE policies are created intentionally.
-- Admin role changes are made only by the project owner in SQL Editor.
