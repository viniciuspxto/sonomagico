'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ui'
import { RITUAL_STEPS } from './data/step-config'
import { StepEnvironment } from './steps/step-environment'
import { StepAlertLevel } from './steps/step-alert-level'
import { StepBreathing } from './steps/step-breathing'
import { StepGratitude } from './steps/step-gratitude'
import { StepStory } from './steps/step-story'
import { StepDream } from './steps/step-dream'
import { StepFinal } from './steps/step-final'
import { updateNightStep, completeNight } from './actions'

interface Child {
  id: string
  name: string
  age: number
}

interface NightData {
  alertLevel?: number
  gratitudeItems?: string[]
  dreamText?: string | null
  storyMode?: 'read' | 'listen'
}

interface RitualFlowProps {
  child: Child
  nightNumber: number
  nightId: string
  initialStep: number
  initialData?: Partial<NightData>
}

export function RitualFlow({
  child,
  nightNumber,
  nightId,
  initialStep,
  initialData,
}: RitualFlowProps) {
  const [stepIndex, setStepIndex] = useState(initialStep - 1)
  const [nightData, setNightData] = useState<NightData>(initialData ?? {})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const step = RITUAL_STEPS[stepIndex]
  const progress = Math.round(((stepIndex + 1) / RITUAL_STEPS.length) * 100)
  const isLast = stepIndex === RITUAL_STEPS.length - 1

  async function handleStepComplete(data?: Record<string, unknown>) {
    setSaving(true)

    const merged = { ...nightData }
    if (data?.alertLevel !== undefined) merged.alertLevel = data.alertLevel as number
    if (data?.gratitudeItems !== undefined) merged.gratitudeItems = data.gratitudeItems as string[]
    if (data?.dreamText !== undefined) merged.dreamText = data.dreamText as string | null
    if (data?.storyMode !== undefined) merged.storyMode = data.storyMode as 'read' | 'listen'
    setNightData(merged)

    if (isLast) {
      // Complete the night
      await updateNightStep({
        nightId,
        currentStep: 7,
        ...buildUpdatePayload(merged),
      })
      await completeNight(nightId)
      setSaving(false)
      return
    }

    // Save progress and advance
    const nextStep = stepIndex + 2
    await updateNightStep({
      nightId,
      currentStep: nextStep,
      ...buildUpdatePayload(merged),
    })

    setSaving(false)
    setStepIndex(prev => prev + 1)
  }

  function buildUpdatePayload(data: NightData) {
    const payload: Record<string, unknown> = {}
    if (data.alertLevel !== undefined) payload.alertLevel = data.alertLevel
    if (data.gratitudeItems !== undefined) payload.gratitudeItems = data.gratitudeItems
    if (data.dreamText !== undefined) payload.dreamText = data.dreamText
    if (data.storyMode !== undefined) payload.storyMode = data.storyMode
    return payload
  }

  function renderStep() {
    switch (step.type) {
      case 'environment':
        return (
          <StepEnvironment
            childName={child.name}
            onComplete={() => handleStepComplete()}
          />
        )
      case 'alert-level':
        return (
          <StepAlertLevel
            childName={child.name}
            onComplete={(data) => handleStepComplete(data)}
          />
        )
      case 'breathing':
        return (
          <StepBreathing
            onComplete={() => handleStepComplete()}
          />
        )
      case 'gratitude':
        return (
          <StepGratitude
            childName={child.name}
            initialItems={nightData.gratitudeItems}
            onComplete={(data) => handleStepComplete(data)}
          />
        )
      case 'story':
        return (
          <StepStory
            nightNumber={nightNumber}
            onComplete={(data) => handleStepComplete(data)}
          />
        )
      case 'dream':
        return (
          <StepDream
            childName={child.name}
            initialText={nightData.dreamText ?? undefined}
            onComplete={(data) => handleStepComplete(data)}
          />
        )
      case 'final':
        return (
          <StepFinal
            childName={child.name}
            nightNumber={nightNumber}
            onComplete={() => handleStepComplete()}
          />
        )
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #3D1A78, #1A0A3C 70%)' }}
    >
      {/* Decorative aura */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(155,114,207,0.25), transparent 70%)' }}
      />

      {/* Header */}
      <header className="px-5 pt-8 pb-3 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-text-muted hover:text-text transition-colors text-sm"
          >
            ✕ Sair
          </button>
          <div className="text-right">
            <span className="text-xs text-accent-gold font-bold block">
              Noite {nightNumber} de 7
            </span>
            <span className="text-xs text-text-muted">
              Etapa {stepIndex + 1} de {RITUAL_STEPS.length}
            </span>
          </div>
        </div>

        <ProgressBar value={progress} color="gold" />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative z-10">
        <div className="w-full max-w-sm">
          {renderStep()}
        </div>
      </main>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
          <div className="glass-card rounded-card p-6 text-center">
            <p className="text-text font-body font-bold">Salvando...</p>
          </div>
        </div>
      )}
    </div>
  )
}
