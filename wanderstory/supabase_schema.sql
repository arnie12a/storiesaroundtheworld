-- ============================================================
-- WanderStory — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text,
  bio          text,
  avatar_url   text,
  is_public    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Automatically create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORIES
-- ============================================================
create table public.stories (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  country      text not null,
  country_code text not null,  -- ISO alpha-2, e.g. "FR"
  continent    text not null,  -- "Europe", "Asia", etc.
  city         text not null,
  visited_date date not null,
  title        text not null,
  description  text not null,
  photo_url    text,
  is_favorite  boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Enforce only one favorite per user per country
create unique index one_favorite_per_country
  on public.stories (user_id, country_code)
  where is_favorite = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.stories  enable row level security;

-- Profiles: anyone can read public profiles
create policy "Public profiles are visible to all"
  on public.profiles for select
  using (is_public = true);

-- Profiles: owners can read their own (even if private)
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Stories: public read of favorited stories whose author is public
create policy "Public favorite stories are visible"
  on public.stories for select
  using (
    is_favorite = true
    and exists (
      select 1 from public.profiles p
      where p.id = user_id and p.is_public = true
    )
  );

-- Stories: owners can read all their own stories
create policy "Users can read all their own stories"
  on public.stories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own stories"
  on public.stories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own stories"
  on public.stories for delete
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these in Supabase Dashboard → Storage → New Bucket

-- 1. Create bucket named: story-photos
--    Public: true

-- 2. Create bucket named: avatars
--    Public: true

-- Or via SQL:
insert into storage.buckets (id, name, public)
values ('story-photos', 'story-photos', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can view story photos"
  on storage.objects for select
  using (bucket_id = 'story-photos');

create policy "Authenticated users can upload story photos"
  on storage.objects for insert
  with check (bucket_id = 'story-photos' and auth.role() = 'authenticated');

create policy "Users can update their own story photos"
  on storage.objects for update
  using (bucket_id = 'story-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own story photos"
  on storage.objects for delete
  using (bucket_id = 'story-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- HELPFUL VIEWS
-- ============================================================

-- Public favorite stories joined with author info
create or replace view public.public_favorites as
  select
    s.id,
    s.country,
    s.country_code,
    s.continent,
    s.city,
    s.visited_date,
    s.title,
    s.description,
    s.photo_url,
    s.created_at,
    p.username,
    p.display_name,
    p.avatar_url
  from public.stories s
  join public.profiles p on p.id = s.user_id
  where s.is_favorite = true and p.is_public = true;
