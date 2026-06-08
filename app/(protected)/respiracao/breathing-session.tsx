'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done'
type View = 'select' | 'session'

interface Technique {
  id: string
  name: string
  emoji: string
  inhale: number
  hold: number
  exhale: number
  cycles: number
  description: string
  free: boolean
}

const TECHNIQUES: Technique[] = [
  {
    id: '4-4-4',
    name: 'Respiração Quadrada',
    emoji: '🌙',
    inhale: 4, hold: 4, exhale: 4, cycles: 4,
    description: 'Acalma antes de dormir',
    free: true,
  },
  {
    id: '4-7-8',
    name: 'Técnica 4-7-8',
    emoji: '⭐',
    inhale: 4, hold: 7, exhale: 8, cycles: 3,
    description: 'Relaxamento profundo',
    free: true,
  },
  {
    id: 'belly',
    name: 'Barriga de Balão',
    emoji: '🎈',
    inhale: 4, hold: 0, exhale: 4, cycles: 5,
    description: 'Perfeita para crianças',
    free: true,
  },
  {
    id: 'oceano',
    name: 'Emoção do Oceano',
    emoji: '🌊',
    inhale: 5, hold: 2, exhale: 6, cycles: 4,
    description: 'Fluxo suave como ondas',
    free: false,
  },
]

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Toque para começar',
  inhale: 'Inspire',
  hold: 'Segure',
  exhale: 'Expire',
  done: 'Muito bem!',
}

const PHASE_EMOJI: Record<Phase, string> = {
  idle: '',
  inhale: '🌸',
  hold: '🫧',
  exhale: '🍃',
  done: '✨',
}

function buildPhasePlan(t: Technique): Array<{ phase: Phase; duration: number }> {
  return [
    { phase: 'inhale', duration: t.inhale },
    ...(t.hold > 0 ? [{ phase: 'hold' as Phase, duration: t.hold }] : []),
    { phase: 'exhale', duration: t.exhale },
  ]
}

interface SessionState {
  phase: Phase
  countdown: number
  cyclesDone: number
  totalSeconds: number
}

// Circle scale per phase
const PHASE_SCALE: Record<Phase, number> = {
  idle: 1,
  inhale: 1.22,
  hold: 1.22,
  exhale: 0.82,
  done: 1,
}

// Transition duration matches breathing phase duration for smooth animation
function getTransitionDuration(phase: Phase, technique: Technique): string {
  if (phase === 'inhale') return `${technique.inhale}s`
  if (phase === 'exhale') return `${technique.exhale}s`
  if (phase === 'hold')   return '0.4s'
  return '0.6s'
}

export function BreathingSession() {
  const [view, setView] = useState<View>('select')
  const [technique, setTechnique] = useState<Technique>(TECHNIQUES[0])
  const [running, setRunning] = useState(false)
  const [session, setSession] = useState<SessionState>({ phase: 'idle', countdown: 0, cyclesDone: 0, totalSeconds: 0 })
  const router = useRouter()

  const cursor = useRef({ phaseIdx: 0, secondsLeft: 0, cycle: 0 })
  const phasePlan = useRef<Array<{ phase: Phase; duration: number }>>([])

  useEffect(() => {
    if (!running) return

    phasePlan.current = buildPhasePlan(technique)
    cursor.current = { phaseIdx: 0, secondsLeft: phasePlan.current[0].duration, cycle: 0 }

    setSession({
      phase: phasePlan.current[0].phase,
      countdown: phasePlan.current[0].duration,
      cyclesDone: 0,
      totalSeconds: 0,
    })

    const interval = setInterval(() => {
      const c = cursor.current
      const plan = phasePlan.current

      setSession(prev => ({ ...prev, totalSeconds: prev.totalSeconds + 1 }))
      c.secondsLeft -= 1

      if (c.secondsLeft <= 0) {
        c.phaseIdx += 1

        if (c.phaseIdx >= plan.length) {
          c.cycle += 1
          if (c.cycle >= technique.cycles) {
            clearInterval(interval)
            setRunning(false)
            setSession(prev => ({ ...prev, phase: 'done', countdown: 0, cyclesDone: c.cycle }))
            return
          }
          c.phaseIdx = 0
          setSession(prev => ({ ...prev, cyclesDone: c.cycle }))
        }

        c.secondsLeft = plan[c.phaseIdx].duration
        setSession(prev => ({
          ...prev,
          phase: plan[c.phaseIdx].phase,
          countdown: plan[c.phaseIdx].duration,
        }))
      } else {
        setSession(prev => ({ ...prev, countdown: c.secondsLeft }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [running, technique])

  function startSession(t: Technique) {
    setTechnique(t)
    setView('session')
    setSession({ phase: 'idle', countdown: 0, cyclesDone: 0, totalSeconds: 0 })
    setRunning(false)
  }

  function handleStop() {
    setRunning(false)
    setSession({ phase: 'idle', countdown: 0, cyclesDone: 0, totalSeconds: 0 })
  }

  const { phase, countdown, cyclesDone, totalSeconds } = session
  const scale = PHASE_SCALE[phase]
  const transitionDuration = getTransitionDuration(phase, technique)
  const progress = cyclesDone / technique.cycles

  // ── TECHNIQUE SELECTION ──────────────────────────────────
  if (view === 'select') {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.3), transparent 70%)' }}
        />

        <header className="px-5 pt-12 pb-4 flex items-center gap-4 relative z-10">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary shadow-card"
          >
            ←
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-text">Respirações Guiadas</h1>
            <p className="text-text-muted text-xs">Escolha uma técnica</p>
          </div>
        </header>

        <main className="flex-1 px-5 pb-10 max-w-md mx-auto w-full relative z-10">
          <div className="grid grid-cols-2 gap-3">
            {TECHNIQUES.map(t => (
              <button
                key={t.id}
                onClick={() => startSession(t)}
                className="glass-card rounded-card p-4 text-left space-y-3 hover:border-lavender/30 transition-all active:scale-95"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center text-2xl bg-violet/30">
                    {t.emoji}
                  </div>
                  <span />
                </div>
                <div>
                  <p className="font-body font-bold text-text text-sm">{t.name}</p>
                  <p className="text-text-muted text-xs mt-0.5">{t.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>{t.cycles} ciclos</span>
                  <span>·</span>
                  <span>~{Math.ceil(t.cycles * (t.inhale + t.hold + t.exhale) / 60)} min</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ── SESSION VIEW ─────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #3D1A78, #1A0A3C 70%)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-10 pb-2 relative z-10">
        <button
          onClick={() => { handleStop(); setView('select') }}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-body font-bold text-text text-sm">{technique.name}</p>
        </div>
        <div className="w-9" />
      </header>

      {/* Progress ring — small, top right */}
      <div className="absolute top-10 right-16 z-10">
        <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke="#9B72CF" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 14}
            strokeDashoffset={2 * Math.PI * 14 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-lavender" style={{ fontSize: 9 }}>
          {cyclesDone}/{technique.cycles}
        </span>
      </div>

      {/* Main breathing area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10" style={{ paddingBottom: 16 }}>

        {/* Breathing orb — 3 layered rings */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 320, height: 320 }}
        >
          {/* Outermost aura */}
          <div
            style={{
              position: 'absolute',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,114,207,0.18) 0%, rgba(155,114,207,0) 70%)',
              transform: `scale(${scale})`,
              transition: `transform ${transitionDuration} ease-in-out`,
            }}
          />

          {/* Middle ring */}
          <div
            style={{
              position: 'absolute',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(107,63,160,0.22) 0%, rgba(155,114,207,0.08) 100%)',
              transform: `scale(${scale})`,
              transition: `transform ${transitionDuration} ease-in-out`,
              boxShadow: phase === 'inhale'
                ? '0 0 60px rgba(107,63,160,0.3), 0 0 120px rgba(107,63,160,0.1)'
                : '0 0 20px rgba(107,63,160,0.1)',
            }}
          />

          {/* Inner core circle */}
          <div
            style={{
              position: 'relative',
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: phase === 'done'
                ? 'linear-gradient(135deg, #4ECDC4, #2ECC71)'
                : phase === 'inhale'
                ? 'linear-gradient(135deg, #3D1A78, #6B3FA0)'
                : phase === 'hold'
                ? 'linear-gradient(135deg, #3D1A78, #9B72CF)'
                : phase === 'exhale'
                ? 'linear-gradient(135deg, #6B3FA0, #C8A8E9)'
                : 'linear-gradient(135deg, #7B4FC0, #9B6DD4)',
              transform: `scale(${scale})`,
              transition: `transform ${transitionDuration} ease-in-out, background 0.8s ease`,
              boxShadow: phase === 'inhale'
                ? '0 8px 40px rgba(61,26,120,0.6), 0 0 0 12px rgba(107,63,160,0.12)'
                : '0 8px 32px rgba(107,63,160,0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: phase === 'idle' ? 52 : 42, lineHeight: 1 }}>
              {phase === 'idle' ? technique.emoji : PHASE_EMOJI[phase]}
            </span>

            {running && phase !== 'done' && (
              <span
                className="font-heading font-bold text-white"
                style={{ fontSize: 40, lineHeight: 1, marginTop: 6, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                {countdown}
              </span>
            )}

            {phase === 'done' && (
              <span className="font-heading font-bold text-white" style={{ fontSize: 18, marginTop: 4 }}>
                Feito!
              </span>
            )}
          </div>
        </div>

        {/* Phase label */}
        <div className="text-center mt-8 space-y-2">
          <p
            className="font-heading font-bold text-text"
            style={{ fontSize: 32, lineHeight: 1.1 }}
          >
            {PHASE_LABELS[phase]}
          </p>

          {running && phase !== 'done' && (
            <p className="text-text-secondary text-sm font-bold">
              Ciclo {cyclesDone + 1} de {technique.cycles}
            </p>
          )}

          {phase === 'idle' && !running && (
            <p className="text-text-muted text-sm">
              {technique.description}
            </p>
          )}

          {phase === 'done' && (
            <p className="text-text-secondary text-sm">
              {technique.cycles} ciclos · {totalSeconds}s 🌟
            </p>
          )}
        </div>

        {/* Cycle dots */}
        {(running || phase === 'done') && (
          <div className="flex gap-3 mt-6">
            {Array.from({ length: technique.cycles }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i < cyclesDone ? 24 : 10,
                  height: 10,
                  borderRadius: 99,
                  backgroundColor: i < cyclesDone ? '#9B72CF' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 pb-12 pt-2 max-w-sm mx-auto w-full relative z-10">
        {phase === 'done' ? (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg shadow-glow active:scale-[0.96] transition-all"
            style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
          >
            Voltar ao início ✨
          </button>
        ) : running ? (
          <button
            onClick={handleStop}
            className="w-full py-4 rounded-pill font-body font-bold text-light-lavender border-2 border-lavender/50"
          >
            Pausar
          </button>
        ) : (
          <button
            onClick={() => setRunning(true)}
            className="w-full py-5 rounded-pill text-white font-body font-extrabold text-xl shadow-glow active:scale-[0.96] transition-all"
            style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
          >
            Começar 🌬️
          </button>
        )}
      </footer>
    </div>
  )
}
