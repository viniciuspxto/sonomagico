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
    id: 'lua-cheia',
    name: 'Lua Cheia',
    emoji: '🌙',
    inhale: 4, hold: 4, exhale: 4, cycles: 4,
    description: 'Acalma antes de dormir',
    free: true,
  },
  {
    id: 'soneca-estrela',
    name: 'Soneca da Estrela',
    emoji: '⭐',
    inhale: 4, hold: 7, exhale: 8, cycles: 3,
    description: 'Relaxamento profundo',
    free: true,
  },
  {
    id: 'pijama-quentinho',
    name: 'Pijama Quentinho',
    emoji: '🧸',
    inhale: 4, hold: 0, exhale: 4, cycles: 5,
    description: 'Perfeita para crianças',
    free: false,
  },
  {
    id: 'dragao-sonolento',
    name: 'Dragão Sonolento',
    emoji: '🐉',
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

function BreathingIllustration({ id }: { id: string }) {
  if (id === 'lua-cheia') {
    return (
      <svg viewBox="0 0 180 160" fill="none" className="w-full h-full">
        <rect width="180" height="160" fill="#c8d8f0" rx="0" />
        <rect width="180" height="160" fill="url(#luaBg)" rx="0" />
        <defs>
          <linearGradient id="luaBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a9ac8" />
            <stop offset="100%" stopColor="#c8d8f0" />
          </linearGradient>
        </defs>
        {/* Moon */}
        <circle cx="90" cy="65" r="38" fill="#f5eaa8" />
        <circle cx="90" cy="65" r="38" fill="#fdf5c0" opacity="0.6" />
        <circle cx="82" cy="58" r="8" fill="#e8d890" opacity="0.4" />
        <circle cx="100" cy="72" r="5" fill="#e8d890" opacity="0.3" />
        <circle cx="88" cy="78" r="4" fill="#e8d890" opacity="0.25" />
        {/* Glow */}
        <circle cx="90" cy="65" r="50" fill="#fdf5c0" opacity="0.12" />
        {/* Stars */}
        <circle cx="30" cy="30" r="2.5" fill="#fff" opacity="0.9" />
        <circle cx="155" cy="25" r="2" fill="#fff" opacity="0.8" />
        <circle cx="22" cy="70" r="1.5" fill="#fff" opacity="0.6" />
        <circle cx="160" cy="55" r="1.8" fill="#fff" opacity="0.7" />
        <circle cx="50" cy="15" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="140" cy="100" r="1.2" fill="#fff" opacity="0.4" />
        {/* Clouds */}
        <ellipse cx="40" cy="120" rx="35" ry="18" fill="#d8e4f4" opacity="0.7" />
        <ellipse cx="60" cy="115" rx="28" ry="14" fill="#e0eaf8" opacity="0.6" />
        <ellipse cx="140" cy="125" rx="30" ry="16" fill="#d8e4f4" opacity="0.7" />
        <ellipse cx="120" cy="118" rx="24" ry="12" fill="#e0eaf8" opacity="0.5" />
      </svg>
    )
  }

  if (id === 'soneca-estrela') {
    return (
      <svg viewBox="0 0 180 160" fill="none" className="w-full h-full">
        <rect width="180" height="160" fill="#2a1a4a" rx="0" />
        <rect width="180" height="160" fill="url(#estrelaBg)" rx="0" />
        <defs>
          <linearGradient id="estrelaBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0e3a" />
            <stop offset="100%" stopColor="#3a2a5a" />
          </linearGradient>
        </defs>
        {/* Big star */}
        <polygon points="90,18 98,48 130,48 104,66 114,96 90,78 66,96 76,66 50,48 82,48" fill="#f5d860" opacity="0.9" />
        <polygon points="90,28 95,48 115,48 100,60 106,80 90,68 74,80 80,60 65,48 85,48" fill="#fde888" opacity="0.8" />
        {/* Sleeping face on star */}
        <path d="M82 55 Q85 53 88 55" stroke="#c8a030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M92 55 Q95 53 98 55" stroke="#c8a030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M86 60 Q90 62 94 60" stroke="#c8a030" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Zzz */}
        <text x="118" y="42" fill="#c8b8f0" fontSize="14" fontWeight="bold" opacity="0.8">z</text>
        <text x="128" y="32" fill="#c8b8f0" fontSize="11" fontWeight="bold" opacity="0.6">z</text>
        <text x="135" y="24" fill="#c8b8f0" fontSize="9" fontWeight="bold" opacity="0.4">z</text>
        {/* Small stars */}
        <circle cx="25" cy="35" r="2" fill="#fff" opacity="0.7" />
        <circle cx="160" cy="28" r="2.5" fill="#fff" opacity="0.8" />
        <circle cx="18" cy="90" r="1.5" fill="#c8b8f0" opacity="0.5" />
        <circle cx="165" cy="80" r="1.8" fill="#c8b8f0" opacity="0.6" />
        <circle cx="40" cy="120" r="1.2" fill="#fff" opacity="0.4" />
        <circle cx="145" cy="115" r="1.5" fill="#fff" opacity="0.5" />
        {/* Cloud bed */}
        <ellipse cx="90" cy="130" rx="55" ry="20" fill="#d4c8f0" opacity="0.2" />
        <ellipse cx="90" cy="135" rx="45" ry="16" fill="#d4c8f0" opacity="0.15" />
      </svg>
    )
  }

  if (id === 'pijama-quentinho') {
    return (
      <svg viewBox="0 0 180 160" fill="none" className="w-full h-full">
        <rect width="180" height="160" fill="#f0e0d0" rx="0" />
        <rect width="180" height="160" fill="url(#pijamaBg)" rx="0" />
        <defs>
          <linearGradient id="pijamaBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e8d8" />
            <stop offset="100%" stopColor="#e8d0c0" />
          </linearGradient>
        </defs>
        {/* Bed/pillow */}
        <rect x="30" y="95" width="120" height="50" rx="12" fill="#d8c0a0" opacity="0.5" />
        <ellipse cx="90" cy="95" rx="50" ry="15" fill="#f0e0d0" />
        {/* Blanket */}
        <path d="M35 100 Q90 85 145 100 L145 135 Q90 145 35 135 Z" fill="#e8a0a0" opacity="0.4" />
        <path d="M40 102 Q90 90 140 102 L140 130 Q90 140 40 130 Z" fill="#f0b0b0" opacity="0.35" />
        {/* Teddy bear */}
        <circle cx="90" cy="72" r="22" fill="#c8a070" />
        <circle cx="74" cy="58" r="8" fill="#c8a070" />
        <circle cx="106" cy="58" r="8" fill="#c8a070" />
        <circle cx="74" cy="58" r="5" fill="#d8b888" />
        <circle cx="106" cy="58" r="5" fill="#d8b888" />
        <ellipse cx="90" cy="78" rx="12" ry="8" fill="#d8b888" />
        {/* Face */}
        <path d="M82 68 Q85 66 88 68" stroke="#8a6030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M92 68 Q95 66 98 68" stroke="#8a6030" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="90" cy="76" rx="3" ry="2" fill="#8a6030" />
        <path d="M85 80 Q90 83 95 80" stroke="#8a6030" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Nightcap */}
        <path d="M72 60 Q90 30 108 60" fill="#e8a0a0" />
        <circle cx="95" cy="38" r="4" fill="#fff" opacity="0.8" />
        {/* Hearts */}
        <text x="35" y="45" fill="#e8a0a0" fontSize="12" opacity="0.5">♥</text>
        <text x="140" y="50" fill="#e8a0a0" fontSize="10" opacity="0.4">♥</text>
        <text x="25" y="80" fill="#e8a0a0" fontSize="8" opacity="0.3">♥</text>
      </svg>
    )
  }

  if (id === 'dragao-sonolento') {
    return (
      <svg viewBox="0 0 180 160" fill="none" className="w-full h-full">
        <rect width="180" height="160" fill="#1a2a1a" rx="0" />
        <rect width="180" height="160" fill="url(#dragaoBg)" rx="0" />
        <defs>
          <linearGradient id="dragaoBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a2a" />
            <stop offset="100%" stopColor="#2a4a3a" />
          </linearGradient>
        </defs>
        {/* Dragon body curled up */}
        <ellipse cx="95" cy="105" rx="42" ry="28" fill="#5ab868" opacity="0.9" />
        <ellipse cx="95" cy="105" rx="38" ry="24" fill="#6ac878" opacity="0.7" />
        {/* Belly */}
        <ellipse cx="95" cy="110" rx="25" ry="16" fill="#a8e8a0" opacity="0.4" />
        {/* Head */}
        <ellipse cx="58" cy="82" rx="22" ry="18" fill="#5ab868" />
        <ellipse cx="55" cy="88" rx="14" ry="10" fill="#a8e8a0" opacity="0.4" />
        {/* Snout */}
        <ellipse cx="42" cy="86" rx="10" ry="7" fill="#4aa858" />
        <circle cx="38" cy="83" r="2" fill="#3a8a48" />
        <circle cx="42" cy="83" r="2" fill="#3a8a48" />
        {/* Eyes closed */}
        <path d="M52 76 Q56 74 60 76" stroke="#2a5a2a" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M62 78 Q66 76 70 78" stroke="#2a5a2a" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Small horns */}
        <polygon points="55,66 58,56 62,66" fill="#4aa858" opacity="0.8" />
        <polygon points="65,68 68,58 72,68" fill="#4aa858" opacity="0.8" />
        {/* Tail curled */}
        <path d="M137 100 Q150 90 148 110 Q146 125 135 120" stroke="#5ab868" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="135" cy="120" r="5" fill="#5ab868" />
        {/* Wings folded */}
        <path d="M85 85 Q100 60 115 75 Q108 80 95 85 Z" fill="#4aa858" opacity="0.5" />
        {/* Smoke puffs from nose */}
        <circle cx="30" cy="78" r="5" fill="#a8e8a0" opacity="0.15" />
        <circle cx="22" cy="72" r="4" fill="#a8e8a0" opacity="0.1" />
        <circle cx="16" cy="68" r="3" fill="#a8e8a0" opacity="0.08" />
        {/* Zzz */}
        <text x="72" y="55" fill="#a8e8a0" fontSize="14" fontWeight="bold" opacity="0.7">z</text>
        <text x="82" y="45" fill="#a8e8a0" fontSize="11" fontWeight="bold" opacity="0.5">z</text>
        <text x="88" y="37" fill="#a8e8a0" fontSize="9" fontWeight="bold" opacity="0.3">z</text>
        {/* Stars */}
        <circle cx="145" cy="25" r="2" fill="#f5e8a0" opacity="0.7" />
        <circle cx="25" cy="30" r="1.5" fill="#f5e8a0" opacity="0.5" />
        <circle cx="160" cy="50" r="1.8" fill="#fff" opacity="0.4" />
      </svg>
    )
  }

  return null
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

        <header className="px-5 pt-12 pb-6 flex items-center gap-4 relative z-10">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary shadow-card"
          >
            ←
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-text">Selecione a Respiração</h1>
          </div>
        </header>

        <main className="flex-1 px-5 pb-10 max-w-md mx-auto w-full relative z-10">
          <div className="grid grid-cols-2 gap-4">
            {TECHNIQUES.map(t => (
              <button
                key={t.id}
                onClick={() => startSession(t)}
                className="bg-white/[0.06] rounded-xl overflow-hidden text-center hover:bg-white/[0.1] transition-all active:scale-[0.96] border border-white/[0.08]"
              >
                {/* Illustration area */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/0.9' }}>
                  <BreathingIllustration id={t.id} />
                </div>
                {/* Info */}
                <div className="px-3 pt-3 pb-2">
                  <p className="font-body font-bold text-text text-sm">{t.name}</p>
                  <p className="text-text-muted text-xs mt-0.5">(animado)</p>
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
