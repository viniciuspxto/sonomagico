'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ProgressBar } from '@/components/ui'
import { saveRitualCompletion } from './actions'

interface Child {
  id: string
  name: string
  age: number
}

interface RitualStep {
  id: string
  emoji: string
  title: string
  instruction: string
  type: 'intro' | 'breathing' | 'gratitude' | 'intention' | 'finish'
}

const LUNAR_PHASES = ['🌑', '🌒', '🌓', '🌔', '🌕']

const STEPS: RitualStep[] = [
  {
    id: 'intro',
    emoji: '🌙',
    title: 'Hora da magia!',
    instruction: 'O Animadabra já está te esperando nas nuvens! Vamos juntos preparar uma noite cheia de sonhos mágicos?',
    type: 'intro',
  },
  {
    id: 'breathing',
    emoji: '🌬️',
    title: 'Respira com o Animadabra',
    instruction: 'Vamos respirar juntinhos! Puxa o ar pelo nariz bem devagar... segura... e solta pela boca como se fosse um sopro mágico!',
    type: 'breathing',
  },
  {
    id: 'gratitude',
    emoji: '💛',
    title: 'Coisas boas de hoje',
    instruction: 'O Animadabra quer saber: o que te fez sorrir hoje? Pode ser qualquer coisa — uma brincadeira, um abraço, uma comida gostosa!',
    type: 'gratitude',
  },
  {
    id: 'intention',
    emoji: '⭐',
    title: 'Para onde vamos sonhar?',
    instruction: 'Fecha os olhinhos e imagina um lugar muito especial... Pode ser uma floresta encantada, uma praia de estrelas, ou o lugar mais gostoso do mundo!',
    type: 'intention',
  },
  {
    id: 'finish',
    emoji: '✨',
    title: 'Boa noite!',
    instruction: 'Você foi incrível! O Animadabra vai ficar aqui pertinho cuidando dos seus sonhos. Fecha os olhinhos... boa noite!',
    type: 'finish',
  },
]

export function RitualFlow({ child }: { child: Child }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [gratitudeItems, setGratitudeItems] = useState(['', '', ''])
  const [intention, setIntention] = useState('')
  const [error, setError] = useState<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const router = useRouter()

  const step = STEPS[stepIndex]
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100)
  const isLast = stepIndex === STEPS.length - 1
  const isFirst = stepIndex === 0

  function canAdvance(): boolean {
    if (step.type === 'gratitude') return gratitudeItems.some(i => i.trim().length > 0)
    return true
  }

  async function handleNext() {
    if (isLast) {
      setSaving(true)
      setError(null)
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      const result = await saveRitualCompletion({
        childId: child.id,
        durationSeconds: duration,
        stepsCompleted: STEPS.length,
        totalSteps: STEPS.length,
      })
      setSaving(false)
      if (result?.error) return setError(result.error)
      router.push('/dashboard')
      router.refresh()
    } else {
      setStepIndex(i => i + 1)
    }
  }

  function handleBack() {
    if (!isFirst) setStepIndex(i => i - 1)
  }

  const buttonLabels: Record<string, string> = {
    intro: 'Vamos lá! ✨',
    breathing: 'Pronto! Próximo passo →',
    gratitude: 'Adorei! Continuar →',
    intention: 'Que lindo! Quase lá →',
    finish: '🌟 Boa noite!',
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #3D1A78, #1A0A3C 70%)' }}
    >
      {/* Decorative aura glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 pointer-events-none"
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
          <span className="text-xs text-text-muted font-bold">
            {stepIndex + 1} / {STEPS.length}
          </span>
        </div>

        {/* Lunar phase progress */}
        <div className="flex items-center justify-center gap-2">
          {LUNAR_PHASES.map((moon, i) => (
            <span
              key={i}
              className="transition-all duration-500"
              style={{
                fontSize: i === stepIndex ? 28 : 18,
                opacity: i <= stepIndex ? 1 : 0.25,
                filter: i <= stepIndex ? 'drop-shadow(0 0 8px rgba(245,185,66,0.5))' : 'none',
              }}
            >
              {moon}
            </span>
          ))}
        </div>

        <ProgressBar value={progress} color="gold" />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative z-10">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div key={step.id} className="space-y-4 animate-fade-in">

            {/* Mascot image for intro and finish, emoji for others */}
            {(step.type === 'intro' || step.type === 'finish') ? (
              <div className="relative mx-auto animate-float" style={{ width: 200, height: 200 }}>
                {/* Glow behind mascot */}
                <div className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(245,185,66,0.2), rgba(107,63,160,0.15), transparent 70%)' }}
                />
                <Image
                  src="/images/animadabra-sleeping.png"
                  alt="Animadabra dormindo numa nuvem"
                  width={200}
                  height={200}
                  className="relative drop-shadow-2xl"
                  priority
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-violet/20 flex items-center justify-center mx-auto"
                style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
              >
                <span className="text-5xl">{step.emoji}</span>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold text-text">{step.title}</h2>
              <p className="text-text-secondary leading-relaxed text-[15px]">{step.instruction}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-accent-gold font-bold text-sm">Para {child.name}</span>
                <span className="text-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(245,185,66,0.5))' }}>🌙</span>
              </div>
            </div>
          </div>

          {/* Gratitude inputs */}
          {step.type === 'gratitude' && (
            <div className="space-y-3 text-left">
              {gratitudeItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(245,185,66,0.4))' }}>
                    {['⭐', '🌟', '💫'][idx]}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const next = [...gratitudeItems]
                      next[idx] = e.target.value
                      setGratitudeItems(next)
                    }}
                    placeholder={['O que te fez rir?', 'Algo gostoso que aconteceu?', 'Quem te fez feliz?'][idx]}
                    className="flex-1 px-4 py-2.5 rounded-md border border-border bg-white/[0.04] text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Intention input */}
          {step.type === 'intention' && (
            <textarea
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="Uma floresta com bichinhos falantes, uma nave espacial colorida..."
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-border bg-white/[0.04] text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition text-sm resize-none"
            />
          )}

          {error && (
            <p className="text-sm text-error bg-error/[0.12] px-4 py-2 rounded-md">{error}</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-10 pt-2 space-y-3 max-w-sm mx-auto w-full relative z-10">
        <button
          onClick={handleNext}
          disabled={saving || !canAdvance()}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
          style={{ background: isLast
            ? 'linear-gradient(135deg, #F5B942, #FF8C42)'
            : 'linear-gradient(135deg, #7B4FC0, #9B6DD4)'
          }}
        >
          {saving ? 'Salvando...' : buttonLabels[step.type]}
        </button>
        {!isFirst && (
          <button
            onClick={handleBack}
            className="w-full text-sm text-text-muted hover:text-text transition-colors py-1"
          >
            ← Voltar
          </button>
        )}
      </footer>
    </div>
  )
}
