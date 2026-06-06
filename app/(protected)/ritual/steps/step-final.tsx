'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
  childName: string
  nightNumber: number
  onComplete: () => void
}

type FinalPhase = 'hug' | 'breathing' | 'phrase' | 'done'

const BREATHING_CYCLES = 3
const INHALE_DURATION = 4
const EXHALE_DURATION = 4
const SCALE_MIN = 0.6
const SCALE_MAX = 1.0

export function StepFinal({ childName, nightNumber, onComplete }: Props) {
  const [phase, setPhase] = useState<FinalPhase>('hug')
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [breathScale, setBreathScale] = useState(SCALE_MIN)
  const [cyclesDone, setCyclesDone] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startRef = useRef(0)
  const router = useRouter()

  function startBreathing() {
    setPhase('breathing')
    setBreathPhase('inhale')
    setBreathScale(SCALE_MAX)
    startRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const sec = (Date.now() - startRef.current) / 1000
      const cycleDuration = INHALE_DURATION + EXHALE_DURATION
      const totalDuration = BREATHING_CYCLES * cycleDuration
      const currentCycle = Math.floor(sec / cycleDuration)

      if (sec >= totalDuration) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setCyclesDone(BREATHING_CYCLES)
        setBreathScale(SCALE_MIN + (SCALE_MAX - SCALE_MIN) / 2)
        setPhase('phrase')
        return
      }

      setCyclesDone(currentCycle)
      const posInCycle = sec % cycleDuration
      if (posInCycle < INHALE_DURATION) {
        setBreathPhase('inhale')
        setBreathScale(SCALE_MAX)
      } else {
        setBreathPhase('exhale')
        setBreathScale(SCALE_MIN)
      }
    }, 200)
  }

  function handlePhraseComplete() {
    setPhase('done')
    onComplete()
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Phase: Hug
  if (phase === 'hug') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <div className="relative mx-auto animate-float" style={{ width: 180, height: 180 }}>
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(245,185,66,0.2), rgba(107,63,160,0.15), transparent 70%)' }}
          />
          <Image
            src="/images/animadabra-sleeping.png"
            alt="Magicaco abraco"
            width={180}
            height={180}
            className="relative drop-shadow-2xl"
            priority
          />
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-bold text-text">Autoabraco!</h2>
          <p className="text-text-secondary text-[15px] leading-relaxed">
            {childName}, abraca voce mesmo com forca! Bem apertadinho! Sinta o quentinho do seu proprio abraco...
          </p>
        </div>

        <button
          onClick={startBreathing}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
        >
          Pronto! Vamos respirar
        </button>
      </div>
    )
  }

  // Phase: Breathing (3 cycles) — same animation as step 3
  if (phase === 'breathing') {
    const transitionDuration = breathPhase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION

    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h2 className="font-heading text-xl font-bold text-text">3 Respiracoes Finais</h2>

        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            {/* Glow aura */}
            <div
              className="absolute rounded-full blur-3xl pointer-events-none"
              style={{
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(155,114,207,0.25), transparent 70%)',
                transform: `scale(${breathScale})`,
                transition: `transform ${transitionDuration}s ease-in-out`,
              }}
            />
            {/* Magicaco image */}
            <Image
              src="/images/magicaco-breathing.png"
              alt="Magicaco respirando"
              width={200}
              height={200}
              className="drop-shadow-2xl"
              style={{
                transform: `scale(${breathScale})`,
                transition: `transform ${transitionDuration}s ease-in-out`,
                transformOrigin: 'center center',
              }}
            />
          </div>

          <p className="font-heading font-bold text-text mt-4" style={{ fontSize: 24 }}>
            {breathPhase === 'inhale' ? 'Inspira...' : 'Expira...'}
          </p>

          {/* Cycle dots */}
          <div className="flex gap-3 mt-4">
            {Array.from({ length: BREATHING_CYCLES }).map((_, i) => (
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

          <p className="text-text-muted text-sm mt-2">
            Ciclo {Math.min(cyclesDone + 1, BREATHING_CYCLES)} de {BREATHING_CYCLES}
          </p>
        </div>
      </div>
    )
  }

  // Phase: Phrase
  if (phase === 'phrase') {
    return (
      <div className="space-y-8 animate-fade-in text-center">
        <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(245,185,66,0.3), transparent 70%)' }}
          />
          <Image
            src="/images/animadabra-sleeping.png"
            alt="Magicaco"
            width={160}
            height={160}
            className="relative drop-shadow-2xl"
          />
        </div>

        <div className="space-y-4">
          <p
            className="font-heading font-bold text-accent-gold"
            style={{ fontSize: 28, lineHeight: 1.3, textShadow: '0 0 24px rgba(245,185,66,0.3)' }}
          >
            &ldquo;Magicaco me de bons sonhos&rdquo;
          </p>
          <p className="text-text-secondary text-sm">
            Repita junto com o {childName}, bem baixinho...
          </p>
        </div>

        <button
          onClick={handlePhraseComplete}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #F5B942, #FF8C42)' }}
        >
          Boa noite!
        </button>
      </div>
    )
  }

  // Phase: Done
  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="w-24 h-24 rounded-full bg-accent-teal/20 flex items-center justify-center mx-auto"
        style={{ boxShadow: '0 0 40px rgba(78,205,196,0.3)' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 24L20 32L36 16" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-text">
          Noite {nightNumber} de 7 concluida!
        </h2>
        <p className="text-text-secondary text-sm">
          {nightNumber < 7
            ? `Incrivel, ${childName}! Volte amanha para a noite ${nightNumber + 1}.`
            : `Parabens, ${childName}! Voce completou toda a trilha!`
          }
        </p>
      </div>

      <button
        onClick={() => { router.push('/dashboard'); router.refresh() }}
        className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
        style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
      >
        Voltar ao inicio
      </button>
    </div>
  )
}
