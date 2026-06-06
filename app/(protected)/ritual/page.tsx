import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { RitualFlow } from './ritual-flow'
import { getTrailProgress, startNight, markSkippedNights } from './actions'

export default async function RitualPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: children } = await supabase
    .from('children')
    .select('id, name, age')
    .eq('user_id', user!.id)
    .limit(1)

  if (!children?.length) redirect('/onboarding')

  const child = children[0]

  // Detect skipped nights first
  await markSkippedNights(child.id)

  const trail = await getTrailProgress(child.id)

  // If trail is complete, go back to dashboard
  if (trail.trailComplete) {
    redirect('/dashboard')
  }

  let nightId: string
  let currentStep: number
  let initialData = {}

  if (trail.activeSession) {
    // Resume in-progress session
    nightId = trail.activeSession.id
    currentStep = trail.activeSession.current_step
    initialData = {
      alertLevel: trail.activeSession.alert_level ?? undefined,
      gratitudeItems: trail.activeSession.gratitude_items?.length
        ? trail.activeSession.gratitude_items
        : undefined,
      dreamText: trail.activeSession.dream_text ?? undefined,
      storyMode: trail.activeSession.story_mode ?? undefined,
    }
  } else {
    // Start new night
    const result = await startNight(child.id, trail.currentNight)
    if ('error' in result) {
      redirect('/dashboard')
    }
    nightId = result.id
    currentStep = 1
  }

  return (
    <RitualFlow
      child={child}
      nightNumber={trail.currentNight}
      nightId={nightId}
      initialStep={currentStep}
      initialData={initialData}
    />
  )
}
