'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ProgressBar } from '@/components/ui'

interface Props {
  onComplete: () => void
}

type Phase = 'idle' | 'inhale' | 'exhale' | 'done'

const INHALE_DURATION = 4
const EXHALE_DURATION = 4
const CYCLE_DURATION = INHALE_DURATION + EXHALE_DURATION
const TOTAL_DURATION = 60

const SCALE_MIN = 0.6
const SCALE_MAX = 1.0

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Toque para comecar',
  inhale: 'Inspira...',
  exhale: 'Expira...',
  done: 'Muito bem!',
}

export function StepBreathing({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [scale, setScale] = useState(SCALE_MIN)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(0)

  function start() {
    if (phase !== 'idle') return
    setPhase('inhale')
    setScale(SCALE_MAX)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const sec = (now - startTimeRef.current) / 1000
      setElapsed(sec)

      if (sec >= TOTAL_DURATION) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setPhase('done')
        setScale(SCALE_MIN + (SCALE_MAX - SCALE_MIN) / 2)
        return
      }

      const posInCycle = sec % CYCLE_DURATION
      if (posInCycle < INHALE_DURATION) {
        setPhase('inhale')
        setScale(SCALE_MAX)
      } else {
        setPhase('exhale')
        setScale(SCALE_MIN)
      }
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
  const transitionDuration = phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl font-bold text-text">Respiracao Guiada</h2>
        <p className="text-text-secondary text-sm">Respire junto com o Magicaco</p>
      </div>

      {/* Magicaco breathing animation */}
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
          {/* Glow aura */}
          <div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(155,114,207,0.25), transparent 70%)',
              transform: `scale(${scale})`,
              transition: phase === 'idle' ? 'none' : `transform ${transitionDuration}s ease-in-out`,
            }}
          />
          {/* Magicaco image */}
          <Image
            src="/images/magicaco-breathing.png"
            alt="Magicaco respirando"
            width={200}
            height={200}
            className="drop-shadow-2xl"
            priority
            style={{
              transform: `scale(${scale})`,
              transition: phase === 'idle' ? 'none' : `transform ${transitionDuration}s ease-in-out`,
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Phase label */}
        <p
          className="font-heading font-bold text-text mt-4"
          style={{ fontSize: 28, lineHeight: 1.1 }}
        >
          {PHASE_LABELS[phase]}
        </p>

        {phase !== 'idle' && phase !== 'done' && (
          <p className="text-text-muted text-sm mt-2">
            {Math.ceil(TOTAL_DURATION - elapsed)}s restantes
          </p>
        )}
      </div>

      {/* Progress bar */}
      {phase !== 'idle' && (
        <ProgressBar value={progress} color="gold" />
      )}

      {/* Action button */}
      {phase === 'idle' && (
        <button
          onClick={start}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
        >
          Comecar
        </button>
      )}

      {phase === 'done' && (
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
        >
          Concluido
        </button>
      )}
    </div>
  )
}
