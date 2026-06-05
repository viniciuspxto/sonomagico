export interface Profile {
  id: string
  user_id: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Child {
  id: string
  user_id: string
  name: string
  age: number
  challenges: string[]
  created_at: string
  updated_at: string
}

export interface RitualCompletion {
  id: string
  user_id: string
  child_id: string
  completed_at: string
  duration_seconds: number
  steps_completed: number
  total_steps: number
}

export interface EmotionalCheckin {
  id: string
  user_id: string
  child_id: string
  emotion: EmotionType
  intensity: number
  notes?: string
  created_at: string
}

export interface BreathingSession {
  id: string
  user_id: string
  child_id: string
  technique: string
  duration_seconds: number
  cycles_completed: number
  created_at: string
}

export interface Story {
  id: string
  title: string
  description: string
  duration_minutes: number
  age_range: [number, number]
  tags: string[]
  content: string
  is_premium: boolean
  created_at: string
}

export interface UpgradeIntent {
  id: string
  user_id: string
  plan: 'pro' | 'family'
  created_at: string
}

export type EmotionType =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'excited'
  | 'tired'
