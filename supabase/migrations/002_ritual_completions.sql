-- ============================================================
-- RITUAL COMPLETIONS
-- ============================================================
create table if not exists public.ritual_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  completed_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  steps_completed integer not null default 0,
  total_steps integer not null default 0
);

alter table public.ritual_completions enable row level security;

create policy "Users can view own ritual completions"
  on public.ritual_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own ritual completions"
  on public.ritual_completions for insert
  with check (auth.uid() = user_id);

-- Index para queries de streak (frequentes)
create index ritual_completions_user_child_date
  on public.ritual_completions (user_id, child_id, completed_at desc);
