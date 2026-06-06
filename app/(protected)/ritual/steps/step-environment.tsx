'use client'

import { useState } from 'react'

interface Props {
  childName: string
  onComplete: () => void
}

const CHECKLIST = [
  {
    id: 'lights',
    emoji: '💡',
    label: 'Luzes baixas ou luz noturna acesa',
    tip: 'Luz baixa estimula a producao de melatonina',
  },
  {
    id: 'temperature',
    emoji: '🌡️',
    label: 'Temperatura do quarto agradavel',
    tip: 'Um quarto fresco ajuda o corpo a relaxar',
  },
  {
    id: 'silence',
    emoji: '🤫',
    label: 'Ambiente silencioso',
    tip: 'Silencio ajuda o cerebro a desacelerar',
  },
]

export function StepEnvironment({ childName, onComplete }: Props) {
  const [checked, setChecked] = useState([false, false, false])
  const allChecked = checked.every(Boolean)

  function toggle(index: number) {
    setChecked(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto"
          style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
        >
          <span className="text-4xl">🏠</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-text">Preparacao do Ambiente</h2>
        <p className="text-text-secondary text-sm">
          Vamos preparar o espacinho magico do {childName}
        </p>
      </div>

      <div className="space-y-3">
        {CHECKLIST.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => toggle(idx)}
            className={`w-full flex items-start gap-4 p-4 rounded-card transition-all text-left ${
              checked[idx]
                ? 'bg-accent-teal/10 border-2 border-accent-teal/40'
                : 'glass-card border-2 border-transparent'
            }`}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
              checked[idx]
                ? 'bg-accent-teal text-deep scale-110'
                : 'bg-violet/20'
            }`}
              style={{ transitionDuration: '300ms' }}
            >
              {checked[idx] ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9L7.5 12.5L14 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-lg">{item.emoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-body font-bold text-sm ${
                checked[idx] ? 'text-accent-teal' : 'text-text'
              }`}>
                {item.label}
              </p>
              <p className="text-text-muted text-xs mt-0.5">{item.tip}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allChecked}
        className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
        style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
      >
        Continuar
      </button>
    </div>
  )
}
