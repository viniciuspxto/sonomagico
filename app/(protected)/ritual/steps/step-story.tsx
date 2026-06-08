'use client'

import { useState } from 'react'
import { STORIES } from '../data/stories'

interface Props {
  nightNumber: number
  onComplete: (data: { storyMode: 'read' | 'listen' }) => void
}

export function StepStory({ nightNumber, onComplete }: Props) {
  const [mode, setMode] = useState<'read' | 'listen'>('read')
  const story = STORIES.find(s => s.nightNumber === nightNumber) ?? STORIES[0]

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto"
          style={{ boxShadow: '0 0 32px rgba(107,63,160,0.3)' }}
        >
          <span className="text-4xl">📖</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-text">Historia da Noite</h2>
        <p className="text-accent-gold text-sm font-bold">
          Noite {nightNumber} — {story.destination}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('read')}
          className={`flex-1 py-2.5 rounded-pill text-sm font-bold transition-all border ${
            mode === 'read'
              ? 'bg-lavender text-deep border-lavender'
              : 'glass-card text-text-secondary border-border'
          }`}
        >
          📖 Ler
        </button>
        <button
          disabled
          className="flex-1 py-2.5 rounded-pill text-sm font-bold glass-card text-text-muted border border-border opacity-[0.38] cursor-not-allowed"
        >
          🎧 Ouvir
          <span className="ml-1 text-xs text-accent-orange">(Em breve)</span>
        </button>
      </div>

      {/* Story content — read mode */}
      {mode === 'read' && (
        <div className="glass-card rounded-card p-5 max-h-[50vh] overflow-y-auto">
          <h3 className="font-heading text-lg font-bold text-text mb-4">
            {story.title}
          </h3>
          <div className="space-y-4">
            {story.content.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                className="text-text-secondary leading-relaxed"
                style={{ fontSize: 18, lineHeight: 1.7 }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Ending / guided relaxation */}
          {story.ending && (
            <div className="mt-6 pt-5 border-t border-border/30 text-center">
              {story.ending.split('\n').map((line, idx) => (
                <p
                  key={idx}
                  className="text-lavender italic"
                  style={{ fontSize: 16, lineHeight: 1.7 }}
                >
                  {line}
                </p>
              ))}
              <p className="mt-4 text-text-muted text-sm tracking-widest">Boa noite</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => onComplete({ storyMode: mode })}
        className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all active:scale-[0.96] shadow-glow"
        style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
      >
        Continuar
      </button>
    </div>
  )
}
