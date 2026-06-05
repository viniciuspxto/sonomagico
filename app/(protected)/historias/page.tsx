'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['Todas', 'Sono', 'Medos', 'Coragem', 'Amizade']

const STORIES = [
  {
    id: 'floresta-magica',
    title: 'A Floresta dos Sonhos',
    emoji: '🌲',
    bg: ['#2D6A4F', '#52B788'],
    desc: 'Uma aventura pela floresta encantada onde cada árvore guarda um sonho diferente para levar você ao sono...',
    duration: '5 min',
    free: true,
    category: 'Sono',
  },
  {
    id: 'dragao-amigo',
    title: 'O Dragão que Tinha Medo',
    emoji: '🐉',
    bg: ['#C8553D', '#F28482'],
    desc: 'Um pequeno dragão descobre que até os mais fortes sentem medo, e que respirar fundo é o maior poder...',
    duration: '7 min',
    free: true,
    category: 'Medos',
  },
  {
    id: 'viagem-nuvens',
    title: 'Viagem nas Nuvens',
    emoji: '☁️',
    bg: ['#4A90D9', '#74B9FF'],
    desc: 'Flutue pelas nuvens com seu animal favorito até o Reino dos Sonhos mágicos...',
    duration: '6 min',
    free: true,
    category: 'Sono',
  },
  {
    id: 'leao-corajoso',
    title: 'O Leão Corajoso',
    emoji: '🦁',
    bg: ['#D4A017', '#F9CA24'],
    desc: 'Um pequeno leão aprende que a coragem vem de dentro do coração. Uma história...',
    duration: '8 min',
    free: false,
    category: 'Coragem',
  },
  {
    id: 'jardim-lua',
    title: 'O Jardim da Lua',
    emoji: '🌙',
    bg: ['#6C3483', '#A855F7'],
    desc: 'Flores que brilham na noite e fadas que dançam à luz da lua cheia e estrelada...',
    duration: '6 min',
    free: false,
    category: 'Sono',
  },
  {
    id: 'trem-sonhos',
    title: 'O Trem dos Sonhos',
    emoji: '🚂',
    bg: ['#C0392B', '#E74C3C'],
    desc: 'Embarque numa viagem mágica pelo país dos sonhos mais felizes e coloridos...',
    duration: '9 min',
    free: false,
    category: 'Coragem',
  },
  {
    id: 'coelho-amigos',
    title: 'O Coelho e os Amigos',
    emoji: '🐰',
    bg: ['#27AE60', '#2ECC71'],
    desc: 'Um coelho tímido aprende sobre amizade, partilha e o valor do pertencimento...',
    duration: '5 min',
    free: false,
    category: 'Amizade',
  },
]

export default function HistoriasPage() {
  const [category, setCategory] = useState('Todas')
  const [playing, setPlaying] = useState<string | null>(null)

  const filtered = category === 'Todas' ? STORIES : STORIES.filter(s => s.category === category)

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="px-5 pt-12 pb-3 flex items-center justify-between relative z-10">
        <h1 className="font-heading text-2xl font-bold text-text">Biblioteca</h1>
        <button className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary shadow-card">
          🔍
        </button>
      </header>

      {/* Category chips */}
      <div className="px-5 mb-4 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={[
                'flex-shrink-0 px-4 py-2 rounded-pill text-sm font-bold transition-all border',
                category === cat
                  ? 'bg-lavender text-deep border-lavender'
                  : 'glass-card text-text-secondary border-border',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-5 mb-3 relative z-10">
        <p className="font-heading font-bold text-text text-base">Ler em voz alta</p>
      </div>

      {/* Stories list */}
      <main className="flex-1 px-5 pb-10 space-y-4 max-w-md mx-auto w-full relative z-10">
        {filtered.map((story) => (
          <div
            key={story.id}
            className="glass-card rounded-lg overflow-hidden shadow-card"
          >
            <div className="flex" style={{ minHeight: 140 }}>
              {/* Cover art */}
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center relative"
                style={{
                  width: 120,
                  background: `linear-gradient(160deg, ${story.bg[0]}, ${story.bg[1]})`,
                }}
              >
                <span style={{ fontSize: 52 }}>{story.emoji}</span>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <span className={`inline-block text-xs font-extrabold px-2 py-0.5 rounded-pill mb-2 ${
                    story.free
                      ? 'bg-accent-teal/[0.18] text-accent-teal'
                      : 'bg-accent-gold/[0.15] text-accent-gold'
                  }`}>
                    {story.free ? 'GRÁTIS' : 'PREMIUM'}
                  </span>

                  <p className="font-body font-bold text-text text-sm leading-snug mb-1">
                    {story.title}
                  </p>

                  <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
                    {story.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-text-secondary text-xs font-bold">Ler em voz alta</p>
                    <p className="text-text-muted text-xs">📖 {story.duration}</p>
                  </div>

                  <button
                    onClick={() => setPlaying(playing === story.id ? null : story.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-glow"
                    style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
                  >
                    {playing === story.id ? (
                      <span className="text-white text-sm font-bold">⏸</span>
                    ) : (
                      <span className="text-white text-sm" style={{ marginLeft: 2 }}>▶</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Playing bar */}
            {playing === story.id && (
              <div
                className="px-4 py-2.5 flex items-center gap-3"
                style={{ background: `linear-gradient(135deg, ${story.bg[0]}25, ${story.bg[1]}25)` }}
              >
                <div className="flex gap-0.5 items-end h-4">
                  {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full animate-pulse"
                      style={{
                        height: h * 3,
                        backgroundColor: story.bg[0],
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold" style={{ color: story.bg[1] }}>
                  Reproduzindo...
                </p>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 glass-card border-t border-border px-8 py-3 flex items-center justify-around z-20">
        <Link href="/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span>
          <span className="text-text-muted text-xs">Início</span>
        </Link>
        <button className="flex flex-col items-center gap-1">
          <span className="text-xl">📖</span>
          <span className="text-lavender text-xs font-bold">Biblioteca</span>
        </button>
        <Link href="/emocoes" className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-text-muted text-xs">Perfil</span>
        </Link>
      </nav>
    </div>
  )
}
