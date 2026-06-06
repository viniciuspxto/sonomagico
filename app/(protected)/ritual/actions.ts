'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { RitualNight, TrailProgress } from '@/types'

// ── Queries ──────────────────────────────────────────

export async function getTrailProgress(childId: string): Promise<TrailProgress> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: nights } = await supabase
    .from('ritual_nights')
    .select('*')
    .eq('user_id', user.id)
    .eq('child_id', childId)
    .order('night_number', { ascending: true })

  const allNights = (nights ?? []) as RitualNight[]
  const activeSession = allNights.find(n => n.status === 'in_progress') ?? null

  let currentNight = 1
  if (activeSession) {
    currentNight = activeSession.night_number
  } else {
    const existing = new Set(allNights.map(n => n.night_number))
    for (let i = 1; i <= 7; i++) {
      if (!existing.has(i)) {
        currentNight = i
        break
      }
    }
    if (existing.size >= 7) currentNight = 7
  }

  const doneOrSkipped = allNights.filter(
    n => n.status === 'completed' || n.status === 'skipped'
  ).length

  return {
    nights: allNights,
    currentNight,
    trailComplete: doneOrSkipped >= 7,
    activeSession,
  }
}

// ── Mutations ────────────────────────────────────────

export async function startNight(
  childId: string,
  nightNumber: number
): Promise<{ id: string } | { error: string }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check for existing in_progress session
  const { data: existing } = await supabase
    .from('ritual_nights')
    .select('id')
    .eq('user_id', user.id)
    .eq('child_id', childId)
    .eq('night_number', nightNumber)
    .single()

  if (existing) return { id: existing.id }

  const { data, error } = await supabase
    .from('ritual_nights')
    .insert({
      user_id: user.id,
      child_id: childId,
      night_number: nightNumber,
      status: 'in_progress',
      current_step: 1,
    })
    .select('id')
    .single()

  if (error) return { error: 'Erro ao iniciar noite.' }
  return { id: data.id }
}

export async function updateNightStep(data: {
  nightId: string
  currentStep: number
  alertLevel?: number
  gratitudeItems?: string[]
  dreamText?: string | null
  storyMode?: 'read' | 'listen'
}): Promise<{ error: string | null }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const update: Record<string, unknown> = {
    current_step: data.currentStep,
  }

  if (data.alertLevel !== undefined) update.alert_level = data.alertLevel
  if (data.gratitudeItems !== undefined) update.gratitude_items = data.gratitudeItems
  if (data.dreamText !== undefined) update.dream_text = data.dreamText
  if (data.storyMode !== undefined) update.story_mode = data.storyMode

  const { error } = await supabase
    .from('ritual_nights')
    .update(update)
    .eq('id', data.nightId)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao salvar progresso.' }
  return { error: null }
}

export async function completeNight(nightId: string): Promise<{ error: string | null }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('ritual_nights')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', nightId)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao concluir noite.' }
  return { error: null }
}

export async function markSkippedNights(childId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: nights } = await supabase
    .from('ritual_nights')
    .select('night_number, status, started_at, completed_at')
    .eq('user_id', user.id)
    .eq('child_id', childId)
    .order('night_number', { ascending: true })

  if (!nights?.length) return

  const lastCompleted = [...nights]
    .reverse()
    .find(n => n.status === 'completed')

  if (!lastCompleted) return

  const lastDate = new Date(lastCompleted.completed_at!)
  const today = new Date()
  const daysBetween = Math.floor(
    (today.getTime() - lastDate.getTime()) / 86_400_000
  )

  if (daysBetween <= 1) return

  // Mark in_progress nights from previous days as skipped
  const { data: inProgress } = await supabase
    .from('ritual_nights')
    .select('id, started_at')
    .eq('user_id', user.id)
    .eq('child_id', childId)
    .eq('status', 'in_progress')

  for (const night of inProgress ?? []) {
    const startedDate = new Date(night.started_at)
    const startedDay = new Date(startedDate.getFullYear(), startedDate.getMonth(), startedDate.getDate())
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (startedDay.getTime() < todayDay.getTime()) {
      await supabase
        .from('ritual_nights')
        .update({ status: 'skipped' })
        .eq('id', night.id)
        .eq('user_id', user.id)
    }
  }
}

/** @deprecated Use startNight/completeNight instead */
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
