'use client'

import { useState } from 'react'

interface Props {
  childName: string
  initialText?: string
  onComplete: (data: { dreamText: string | null }) => void
}

export function StepDream({ childName, initialText, onComplete }: Props) {
  const [text, setText] = useState(initialText ?? '')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto animate-float"
          style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
        >
          <span className="text-4xl">⭐</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-text">Para Onde Vamos Sonhar?</h2>
        <p className="text-text-secondary text-sm">
          Fecha os olhinhos, {childName}... imagina um lugar muito especial!
        </p>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value.slice(0, 150))}
        placeholder="Uma floresta com bichinhos falantes, uma nave espacial colorida, uma praia de estrelas..."
        rows={4}
        maxLength={150}
        className="w-full px-4 py-3 rounded-card border border-border bg-white/[0.04] text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition text-sm resize-none"
      />
      <p className="text-text-muted text-xs text-right">{text.length}/150</p>

      <button
        onClick={() => onComplete({ dreamText: text.trim() || null })}
        className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
        style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
      >
        {text.trim() ? 'Que lindo! Continuar' : 'Pular e continuar'}
      </button>
    </div>
  )
}
