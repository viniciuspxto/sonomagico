'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SOUNDS = [
  { id: 'chuva',    emoji: '🌧️', label: 'Chuva Suave',     desc: 'Gotas calmas na janela' },
  { id: 'mar',      emoji: '🌊', label: 'Mar Calmante',     desc: 'Ondas suaves na praia' },
  { id: 'ruido',    emoji: '📻', label: 'Ruído Branco',     desc: 'Tom neutro relaxante' },
  { id: 'vento',    emoji: '🍃', label: 'Playlist Vento',   desc: 'Brisa entre folhas' },
  { id: 'fogueira', emoji: '🔥', label: 'Fogueira',          desc: 'Crepitar aconchegante' },
  { id: 'floresta', emoji: '🌲', label: 'Floresta Noturna', desc: 'Gritos dos grilos' },
]

const DURATIONS = [
  { label: '5 min',  seconds: 300 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
  { label: '∞',      seconds: -1 },
]

function formatTime(s: number) {
  if (s < 0) return '∞'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function RuidoBrancoPage() {
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0])
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1])
  const [playing, setPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATIONS[1].seconds)
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (playing && selectedDuration.seconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setPlaying(false)
            return selectedDuration.seconds
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, selectedDuration])

  function handleDuration(d: typeof DURATIONS[0]) {
    setSelectedDuration(d)
    setTimeLeft(d.seconds)
    setPlaying(false)
  }

  function togglePlay() {
    if (!playing && timeLeft <= 0) setTimeLeft(selectedDuration.seconds)
    setPlaying(p => !p)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.3), transparent 70%)' }}
      />

      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center gap-4 relative z-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary shadow-card"
        >
          ←
        </button>
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Ruído Branco</h1>
          <p className="text-text-muted text-xs">Sons que acalmam e induzem o sono</p>
        </div>
      </header>

      <main className="flex-1 px-5 pb-10 max-w-md mx-auto w-full relative z-10 flex flex-col gap-5">

        {/* Player card */}
        <div
          className="rounded-lg p-6 flex flex-col items-center gap-5 shadow-glow"
          style={{ background: 'linear-gradient(135deg, #3D1A78, #6B3FA0)' }}
        >
          {/* Sound icon */}
          <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center text-5xl border border-white/20">
            {selectedSound.emoji}
          </div>

          {/* Sound name */}
          <div className="text-center">
            <p className="font-heading font-bold text-white text-lg">{selectedSound.label}</p>
            <p className="text-white/60 text-sm">{selectedSound.desc}</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="font-heading font-bold text-white text-5xl tracking-tight">
              {selectedDuration.seconds < 0 ? '∞' : formatTime(timeLeft)}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {playing ? 'Reproduzindo...' : 'Pausado'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { const idx = SOUNDS.indexOf(selectedSound); setSelectedSound(SOUNDS[(idx - 1 + SOUNDS.length) % SOUNDS.length]) }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg border border-white/20"
            >
              ‹
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-gold"
              style={{ background: '#F5B942' }}
            >
              <span className="text-deep text-2xl font-bold">{playing ? '⏸' : '▶'}</span>
            </button>
            <button
              onClick={() => { const idx = SOUNDS.indexOf(selectedSound); setSelectedSound(SOUNDS[(idx + 1) % SOUNDS.length]) }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg border border-white/20"
            >
              ›
            </button>
          </div>
        </div>

        {/* Duration selector */}
        <div>
          <p className="font-body font-extrabold text-lavender text-xs uppercase tracking-widest mb-3">Duração</p>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map(d => (
              <button
                key={d.label}
                onClick={() => handleDuration(d)}
                className={[
                  'py-3 rounded-md text-sm font-body font-bold transition-all border',
                  selectedDuration.label === d.label
                    ? 'text-white border-transparent shadow-glow'
                    : 'glass-card text-text-secondary border-border',
                ].join(' ')}
                style={selectedDuration.label === d.label ? { background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' } : {}}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound list */}
        <div>
          <p className="font-body font-extrabold text-lavender text-xs uppercase tracking-widest mb-3">Sons Disponíveis</p>
          <div className="space-y-2">
            {SOUNDS.map(sound => {
              const isActive = selectedSound.id === sound.id
              return (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound)}
                  className={[
                    'w-full flex items-center gap-4 px-4 py-3 rounded-md border transition-all text-left',
                    isActive
                      ? 'border-lavender bg-violet/25 shadow-card'
                      : 'border-border glass-card hover:border-lavender/30',
                  ].join(' ')}
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center text-2xl flex-shrink-0 bg-violet/30"
                  >
                    {sound.emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`font-body font-bold text-sm ${isActive ? 'text-lavender' : 'text-text'}`}>{sound.label}</p>
                    <p className="text-text-muted text-xs">{sound.desc}</p>
                  </div>
                  {isActive && playing && (
                    <div className="flex gap-0.5 items-end h-4">
                      {[3, 5, 4, 6, 3].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-lavender rounded-full animate-pulse"
                          style={{ height: h * 3, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                  {isActive && !playing && (
                    <div className="w-5 h-5 rounded-full bg-violet flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
