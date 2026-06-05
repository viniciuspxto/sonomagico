'use client'

import { useState } from 'react'
import { createProfile, createChild } from './actions'

const CHALLENGES = [
  { id: 'medo-pesadelos', label: 'Medo e Pesadelos', emoji: '😨', desc: 'Tem medo do escuro ou acorda com pesadelos frequentes.' },
  { id: 'agitacao-ansiedade', label: 'Agitação e Ansiedade', emoji: '😰', desc: 'Fica agitada, não consegue relaxar na hora de dormir.' },
  { id: 'falta-rotina', label: 'Falta de Rotina', emoji: '🌀', desc: 'Não tem horário fixo e demora muito para adormecer.' },
  { id: 'acorda-noite', label: 'Acorda à Noite', emoji: '🌃', desc: 'Acorda várias vezes durante a noite e chama os pais.' },
  { id: 'resistencia', label: 'Resistência para Dormir', emoji: '🙅', desc: 'Sempre quer mais um copo dágua, uma história, etc.' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [fullName, setFullName] = useState('')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState<number>(5)
  const [challenges, setChallenges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleChallenge(id: string) {
    setChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await createProfile(fullName.trim())
    setLoading(false)
    if (result?.error) return setError(result.error)
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    if (challenges.length === 0) return setError('Selecione pelo menos um desafio.')
    setLoading(true)
    setError(null)
    await createChild({ name: childName.trim(), age: childAge, challenges })
  }

  return (
    <main className="min-h-screen bg-background flex flex-col px-5 py-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4), transparent 70%)' }}
      />

      <div className="w-full max-w-sm mx-auto space-y-6 relative z-10 flex-1 flex flex-col justify-center">

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-500 ${n <= step ? 'bg-lavender' : 'bg-white/[0.08]'}`} />
          ))}
        </div>

        {/* STEP 1 — Perfil */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-5">
            <div className="space-y-1">
              <p className="text-text-muted text-xs uppercase tracking-widest font-extrabold">Passo 1 de 2</p>
              <h1 className="font-heading text-2xl font-bold text-text">Olá! Bem-vindo 👋</h1>
              <p className="text-text-secondary text-sm">Como podemos te chamar?</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">Seu nome</label>
              <input
                id="fullName" type="text" required value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Ana Silva"
                className="w-full px-4 py-3 rounded-md bg-white/[0.04] border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition"
              />
            </div>

            {error && <p className="text-sm text-error bg-error/[0.12] px-4 py-3 rounded-md">{error}</p>}

            <button type="submit" disabled={loading || !fullName.trim()}
              className="w-full py-4 rounded-pill text-white font-body font-extrabold disabled:opacity-[0.38] transition-all active:scale-[0.96] shadow-glow"
              style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}>
              {loading ? 'Salvando...' : 'Continuar →'}
            </button>
          </form>
        )}

        {/* STEP 2 — Criança + desafios */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-5">
            <div className="space-y-1">
              <p className="text-text-muted text-xs uppercase tracking-widest font-extrabold">Passo 2 de 2</p>
              <h1 className="font-heading text-2xl font-bold text-text">Sua Criança 🌙</h1>
              <p className="text-text-secondary text-sm">Vamos personalizar a experiência</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="childName" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">Nome da criança</label>
              <input
                id="childName" type="text" required value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ex: Lucas"
                className="w-full px-4 py-3 rounded-md bg-white/[0.04] border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-lavender uppercase tracking-wider">Idade</label>
                <span className="font-heading font-bold text-accent-gold">{childAge} anos</span>
              </div>
              <input type="range" min={2} max={13} value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full accent-violet" />
              <div className="flex justify-between text-xs text-text-muted"><span>2</span><span>13</span></div>
            </div>

            {/* Challenge cards */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold text-lavender uppercase tracking-wider">Selecione os Desafios</p>
              <div className="space-y-2">
                {CHALLENGES.map(({ id, label, emoji, desc }) => {
                  const selected = challenges.includes(id)
                  return (
                    <button key={id} type="button" onClick={() => toggleChallenge(id)}
                      className={[
                        'w-full flex items-start gap-3 p-4 rounded-md border text-left transition-all',
                        selected ? 'border-lavender bg-violet/25' : 'border-border glass-card hover:border-lavender/40',
                      ].join(' ')}>
                      <span className="text-2xl flex-shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body font-bold text-sm ${selected ? 'text-light-lavender' : 'text-text'}`}>{label}</p>
                        <p className="text-text-muted text-xs mt-0.5 leading-snug">{desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${selected ? 'border-violet bg-violet' : 'border-lavender/50'}`}>
                        {selected && <span className="text-white text-xs">✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && <p className="text-sm text-error bg-error/[0.12] px-4 py-3 rounded-md">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep(1); setError(null) }}
                className="flex-1 py-4 rounded-pill text-light-lavender font-body font-bold border-2 border-lavender/50">
                ← Voltar
              </button>
              <button type="submit" disabled={loading || !childName.trim()}
                className="flex-[2] py-4 rounded-pill text-white font-body font-extrabold disabled:opacity-[0.38] shadow-glow active:scale-[0.96] transition-all"
                style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}>
                {loading ? 'Salvando...' : 'Começar! 🚀'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
