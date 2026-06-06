'use client'

import { useState } from 'react'

interface Props {
  childName: string
  onComplete: (data: { alertLevel: number }) => void
}

const LEVELS = [
  { value: 1, label: 'Muito calmo', emoji: '😴' },
  { value: 2, label: 'Calmo', emoji: '😌' },
  { value: 3, label: 'Mais ou menos', emoji: '😐' },
  { value: 4, label: 'Agitado', emoji: '😬' },
  { value: 5, label: 'Muito agitado', emoji: '🤪' },
]

export function StepAlertLevel({ childName, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto"
          style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
        >
          <span className="text-4xl">🌡️</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-text">Nivel de Alerta</h2>
        <p className="text-text-secondary text-sm">
          Como o {childName} esta agora?
        </p>
      </div>

      <div className="space-y-2">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => setSelected(level.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-card transition-all ${
              selected === level.value
                ? 'bg-primary/30 border-2 border-lavender shadow-glow'
                : 'glass-card border-2 border-transparent'
            }`}
          >
            <span className="text-3xl" style={{
              transform: selected === level.value ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 300ms ease',
              display: 'inline-block',
            }}>
              {level.emoji}
            </span>
            <span className={`font-body font-bold text-sm ${
              selected === level.value ? 'text-text' : 'text-text-secondary'
            }`}>
              {level.label}
            </span>
            {selected === level.value && (
              <div className="ml-auto w-6 h-6 rounded-full bg-lavender flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9L7.5 12.5L14 5.5" stroke="#1A0A3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => selected !== null && onComplete({ alertLevel: selected })}
        disabled={selected === null}
        className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
        style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
      >
        Continuar
      </button>
    </div>
  )
}
