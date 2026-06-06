-- ============================================================
-- RITUAL NIGHTS — Trilha das 7 Noites
-- ============================================================

-- Status enum
DO $$ BEGIN
  CREATE TYPE ritual_night_status AS ENUM ('in_progress', 'completed', 'skipped');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Story mode enum
DO $$ BEGIN
  CREATE TYPE ritual_story_mode AS ENUM ('read', 'listen');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.ritual_nights (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id        uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  night_number    integer NOT NULL CHECK (night_number >= 1 AND night_number <= 7),
  status          ritual_night_status NOT NULL DEFAULT 'in_progress',
  alert_level     integer CHECK (alert_level >= 1 AND alert_level <= 5),
  gratitude_items text[] NOT NULL DEFAULT '{}',
  dream_text      text,
  story_mode      ritual_story_mode NOT NULL DEFAULT 'read',
  current_step    integer NOT NULL DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 7),
  started_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz
);

-- Uma entrada por usuario por noite
ALTER TABLE public.ritual_nights
  ADD CONSTRAINT ritual_nights_user_night_unique UNIQUE (user_id, night_number);

-- Indices de performance
CREATE INDEX ritual_nights_user_status ON public.ritual_nights (user_id, status);
CREATE INDEX ritual_nights_user_child ON public.ritual_nights (user_id, child_id, night_number);

-- RLS
ALTER TABLE public.ritual_nights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ritual nights"
  ON public.ritual_nights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ritual nights"
  ON public.ritual_nights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ritual nights"
  ON public.ritual_nights FOR UPDATE
  USING (auth.uid() = user_id);
