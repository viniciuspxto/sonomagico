-- Add mood_change column to emotion_checkins
alter table public.emotion_checkins
  add column if not exists mood_change text;
