'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function saveRitualCompletion(data: {
  childId: string
  durationSeconds: number
  stepsCompleted: number
  totalSteps: number
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('ritual_completions').insert({
    user_id: user.id,
    child_id: data.childId,
    duration_seconds: data.durationSeconds,
    steps_completed: data.stepsCompleted,
    total_steps: data.totalSteps,
  })

  if (error) return { error: 'Erro ao salvar ritual.' }
  return { error: null }
}
