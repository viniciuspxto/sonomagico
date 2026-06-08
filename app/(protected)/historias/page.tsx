'use client'

import { useState } from 'react'
import Link from 'next/link'
import { STORIES } from '../ritual/data/stories'

const STORY_META: Record<number, { emoji: string; gradient: [string, string] }> = {
  1: { emoji: '🌊', gradient: ['#0d1b2a', '#1a2a4a'] },
  2: { emoji: '☁️', gradient: ['#1a0e2e', '#2d1a4a'] },
  3: { emoji: '💎', gradient: ['#0a1a18', '#0d2a26'] },
  4: { emoji: '🌸', gradient: ['#0e1a0a', '#1a2e0e'] },
  5: { emoji: '📚', gradient: ['#1a1208', '#2a1e0a'] },
  6: { emoji: '🐚', gradient: ['#070f1a', '#0d1e30'] },
  7: { emoji: '🏔️', gradient: ['#120a00', '#2a1800'] },
}

export default function HistoriasPage() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)

  const story = selectedStory !== null ? STORIES.find(s => s.nightNumber === selectedStory) : null

  // ── Reading view ──
  if (story) {
    const meta = STORY_META[story.nightNumber]
    return (
      <div className="min-h-screen flex flex-col" style={{
        background: `radial-gradient(ellipse at 50% 30%, ${meta.gradient[1]}, ${meta.gradient[0]} 70%)`,
      }}>
        {/* Header */}
        <header className="px-5 pt-8 pb-4 flex items-center justify-between relative z-10">
          <button
            onClick={() => setSelectedStory(null)}
            className="text-text-muted hover:text-text transition-colors text-sm font-bold"
          >
            ← Voltar
          </button>
          <span className="text-xs text-accent-gold font-bold">
            Historia {story.nightNumber} de 7
          </span>
        </header>

        {/* Story content */}
        <main className="flex-1 px-5 pb-12 max-w-lg mx-auto w-full relative z-10">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{meta.emoji}</div>
            <h1 className="font-heading text-2xl font-bold text-text mb-2">{story.title}</h1>
            <p className="text-text-muted text-sm">{story.destination}</p>
          </div>

          {/* Story text */}
          <article className="space-y-5">
            {story.content.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                className="text-text-secondary leading-relaxed"
                style={{ fontSize: 18, lineHeight: 1.85 }}
              >
                {paragraph}
              </p>
            ))}
          </article>

          {/* Ending */}
          {story.ending && (
            <div className="mt-10 pt-6 border-t border-border/30 text-center space-y-1">
              {story.ending.split('\n').map((line, idx) => (
                <p key={idx} className="text-lavender italic" style={{ fontSize: 16, lineHeight: 1.7 }}>
                  {line}
                </p>
              ))}
              <p className="mt-4 text-text-muted text-sm tracking-widest">Boa noite</p>
            </div>
          )}
        </main>
      </div>
    )
  }

  // ── Library view ──
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="px-5 pt-12 pb-3 flex items-center justify-between relative z-10">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text">Biblioteca</h1>
          <p className="text-text-muted text-xs mt-0.5">Historias do Macaco Magicaco</p>
        </div>
        <Link
          href="/dashboard"
          className="text-text-muted hover:text-text transition-colors text-sm"
        >
          ← Inicio
        </Link>
      </header>

      {/* Stories grid */}
      <main className="flex-1 px-5 pb-10 max-w-md mx-auto w-full relative z-10">
        <div className="grid grid-cols-2 gap-3 mt-4">
          {STORIES.map((s) => {
            const meta = STORY_META[s.nightNumber]
            return (
              <button
                key={s.nightNumber}
                onClick={() => setSelectedStory(s.nightNumber)}
                className="text-left rounded-card overflow-hidden hover:scale-[1.02] transition-all active:scale-[0.97]"
              >
                <div className="relative" style={{ aspectRatio: '3/4' }}>
                  {/* Background */}
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(160deg, ${meta.gradient[1]}, ${meta.gradient[0]})`,
                  }}>
                    {/* Decorative stars */}
                    <div className="absolute top-3 left-3 w-1 h-1 rounded-full bg-white/40" />
                    <div className="absolute top-5 right-4 w-1.5 h-1.5 rounded-full bg-accent-gold/50" />
                    <div className="absolute top-8 left-[55%] w-1 h-1 rounded-full bg-white/30" />
                    <div className="absolute top-12 left-5 w-1 h-1 rounded-full bg-white/20" />
                    <div className="absolute top-6 left-[30%] w-0.5 h-0.5 rounded-full bg-accent-gold/40" />
                  </div>

                  {/* Emoji illustration */}
                  <div className="absolute inset-x-0 top-0 bottom-16 flex items-center justify-center">
                    <span className="text-6xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                      {meta.emoji}
                    </span>
                  </div>

                  {/* Night number badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-gold/90 flex items-center justify-center">
                    <span className="text-xs font-bold text-deep">{s.nightNumber}</span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-3" style={{
                    background: `linear-gradient(to top, ${meta.gradient[0]}ee, ${meta.gradient[0]}aa, transparent)`,
                  }}>
                    <p className="font-body font-extrabold text-text text-xs leading-snug">{s.title}</p>
                    <p className="text-text-muted text-xs mt-0.5">{s.destination}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
