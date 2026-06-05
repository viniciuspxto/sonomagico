-- Emotion check-ins table
create table if not exists public.emotion_checkins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  emotion     text not null,
  checked_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.emotion_checkins enable row level security;

create policy "Users can insert their own checkins"
  on public.emotion_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own checkins"
  on public.emotion_checkins for select
  using (auth.uid() = user_id);

-- Index for querying recent checkins
create index emotion_checkins_user_checked on public.emotion_checkins(user_id, checked_at desc);
