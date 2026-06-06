'use client'

import { useState } from 'react'

interface Props {
  childName: string
  initialItems?: string[]
  onComplete: (data: { gratitudeItems: string[] }) => void
}

const PLACEHOLDERS = [
  'O que te fez rir hoje?',
  'Algo gostoso que aconteceu?',
  'Quem te fez feliz?',
]

const STARS = ['⭐', '🌟', '💫']

export function StepGratitude({ childName, initialItems, onComplete }: Props) {
  const [items, setItems] = useState<string[]>(initialItems ?? ['', '', ''])
  const [showWarning, setShowWarning] = useState(false)

  const filledCount = items.filter(i => i.trim().length > 0).length
  const canAdvance = filledCount >= 1

  function handleAdvance() {
    if (!canAdvance) return
    if (filledCount < 3 && !showWarning) {
      setShowWarning(true)
      return
    }
    onComplete({ gratitudeItems: items.filter(i => i.trim()) })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto"
          style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
        >
          <span className="text-4xl">💛</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-text">Coisas Boas do Dia</h2>
        <p className="text-text-secondary text-sm">
          O que fez o {childName} sorrir hoje?
        </p>
      </div>

      {/* Tip */}
      <div className="glass-card rounded-card p-3 flex items-start gap-2">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-text-secondary text-xs leading-relaxed">
          Pergunte: &ldquo;O que foi mais divertido hoje?&rdquo; ou &ldquo;Qual foi a melhor parte do dia?&rdquo;
        </p>
      </div>

      {/* Gratitude inputs */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-lg flex-shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(245,185,66,0.4))' }}>
              {STARS[idx]}
            </span>
            <input
              type="text"
              value={item}
              onChange={e => {
                const next = [...items]
                next[idx] = e.target.value.slice(0, 100)
                setItems(next)
                setShowWarning(false)
              }}
              placeholder={PLACEHOLDERS[idx]}
              maxLength={100}
              className="flex-1 px-4 py-2.5 rounded-md border border-border bg-white/[0.04] text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition text-sm"
            />
          </div>
        ))}
      </div>

      {/* Soft warning */}
      {showWarning && filledCount < 3 && (
        <div className="text-center">
          <p className="text-accent-gold text-xs font-bold">
            Quer tentar preencher mais um? Cada coisa boa conta!
          </p>
          <button
            onClick={() => onComplete({ gratitudeItems: items.filter(i => i.trim()) })}
            className="text-text-muted text-xs mt-1 underline"
          >
            Continuar assim mesmo
          </button>
        </div>
      )}

      {!showWarning && (
        <button
          onClick={handleAdvance}
          disabled={!canAdvance}
          className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
        >
          Continuar
        </button>
      )}
    </div>
  )
}
