'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const EMOTIONS = [
  { id: 'muito-triste', emoji: '😢', label: 'Muito\nTriste',   scale: 1 },
  { id: 'triste',       emoji: '😰', label: 'Triste',          scale: 2 },
  { id: 'neutro',       emoji: '😐', label: 'Neutro',          scale: 3 },
  { id: 'feliz',        emoji: '🙂', label: 'Feliz',           scale: 4 },
  { id: 'muito-feliz',  emoji: '😄', label: 'Muito\nFeliz',    scale: 5 },
]

const MOOD_CHANGED = [
  { id: 'sim',   emoji: '↗️', label: 'Sim, melhorou' },
  { id: 'nao',   emoji: '→',  label: 'Ficou igual' },
  { id: 'piorou',emoji: '↘️', label: 'Piorou um pouco' },
]

export default function EmocoesPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [moodChange, setMoodChange] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const selectedEmotion = EMOTIONS.find(e => e.id === selected)

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('emotion_checkins').insert({
        user_id: user.id,
        emotion: selected,
        mood_change: moodChange,
        checked_at: new Date().toISOString(),
      })
    }
    setSaving(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4), transparent 70%)' }}
        />
        <div className="text-center space-y-6 relative z-10 w-full max-w-sm">
          <div
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(107,63,160,0.4), rgba(155,114,207,0.2))' }}
          >
            <span className="text-6xl">{selectedEmotion?.emoji}</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-text">Obrigado! 💜</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Reconhecer suas emoções é um ato de coragem.<br />
              Estamos aqui com você.
            </p>
          </div>
          <div className="glass-card rounded-lg p-4 shadow-card">
            <p className="text-text-muted text-xs uppercase tracking-widest font-extrabold mb-1">Esta noite você se sentiu</p>
            <p className="font-heading font-bold text-text text-lg">{selectedEmotion?.label.replace('\n', ' ')}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-4 rounded-pill text-white font-body font-extrabold shadow-glow active:scale-[0.96] transition-all"
            style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.3), transparent 70%)' }}
      />

      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center gap-4 relative z-10">
        <button
          onClick={() => step === 2 ? setStep(1) : router.push('/dashboard')}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-text-secondary shadow-card"
        >
          ←
        </button>
        <div>
          <p className="text-text-muted text-xs font-extrabold uppercase tracking-widest">Passo {step} de 2</p>
          <h1 className="font-heading text-xl font-bold text-text">Termômetro Emocional</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pb-10 flex flex-col max-w-md mx-auto w-full relative z-10">

        {step === 1 && (
          <>
            <div className="text-center mt-4 mb-8 space-y-2">
              <p className="font-heading text-xl font-bold text-text">
                Como você está se sentindo<br />esta noite?
              </p>
              <p className="text-text-muted text-sm">Toque no emoji que mais combina</p>
            </div>

            {/* Horizontal emoji thermometer */}
            <div className="flex justify-between items-end px-2 mb-6">
              {EMOTIONS.map((e) => {
                const isSelected = selected === e.id
                const sizes = [36, 40, 44, 40, 36]
                const fontSize = sizes[e.scale - 1]
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e.id)}
                    className="flex flex-col items-center gap-2 transition-all active:scale-95"
                    style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                  >
                    <div
                      className={`rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'shadow-magic' : ''
                      }`}
                      style={{
                        width: fontSize + 20,
                        height: fontSize + 20,
                        background: isSelected ? 'rgba(107,63,160,0.25)' : 'rgba(255,255,255,0.06)',
                        border: isSelected ? '2px solid #9B72CF' : '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <span style={{ fontSize }}>{e.emoji}</span>
                    </div>
                    <span className={`text-xs text-center leading-tight whitespace-pre-line font-bold ${
                      isSelected ? 'text-lavender' : 'text-text-muted'
                    }`} style={{ fontSize: 10 }}>
                      {e.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Gradient bar */}
            <div className="h-2 rounded-full mx-2 mb-8" style={{
              background: 'linear-gradient(to right, #6B3FA0, #9B72CF, #C8A8E9, #4ECDC4, #2ECC71)'
            }} />

            <div className="mt-auto">
              <button
                onClick={() => setStep(2)}
                disabled={!selected}
                className="w-full py-4 rounded-pill text-white font-body font-extrabold disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
                style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
              >
                Continuar →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mt-4 mb-8 space-y-2">
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(107,63,160,0.4), rgba(155,114,207,0.2))' }}
              >
                <span className="text-4xl">{selectedEmotion?.emoji}</span>
              </div>
              <p className="font-heading text-xl font-bold text-text">
                O humor mudou<br />durante o dia?
              </p>
              <p className="text-text-muted text-sm">Compare com como você começou o dia</p>
            </div>

            <div className="space-y-3">
              {MOOD_CHANGED.map((m) => {
                const isSelected = moodChange === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMoodChange(m.id)}
                    className={[
                      'w-full flex items-center gap-4 px-5 py-4 rounded-lg border transition-all text-left',
                      isSelected
                        ? 'border-lavender bg-violet/25 shadow-magic'
                        : 'border-border glass-card hover:border-lavender/30',
                    ].join(' ')}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className={`font-body font-bold text-sm ${isSelected ? 'text-lavender' : 'text-text'}`}>
                      {m.label}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-violet flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-pill text-white font-body font-extrabold disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
                style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
              >
                {saving ? 'Salvando...' : 'Registrar emoção 💜'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
