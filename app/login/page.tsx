'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup'
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleResetPassword() {
    if (!email) {
      setError('Digite seu email primeiro.')
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(`Erro ao enviar email: ${error.message}`)
    } else {
      setSuccess('Email de recuperacao enviado! Verifique sua caixa de entrada.')
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(
          error.message.includes('Invalid login')
            ? 'Email ou senha incorretos.'
            : `Erro ao entrar: ${error.message}`
        )
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) {
        setError(`Erro ao criar conta: ${error.message}`)
      } else if (data.user && data.user.identities?.length === 0) {
        setError('Este email ja esta cadastrado. Tente fazer login.')
      } else {
        setSuccess('Conta criada! Verifique seu email para confirmar o cadastro.')
      }
    }

    setLoading(false)
  }

  function switchMode() {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setSuccess(null)
    setPassword('')
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A0A3C 0%, #2D1260 50%, #1A0A3C 100%)' }}
    >
      {/* Glow decorativo topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.5), transparent 70%)' }}
      />

      {/* Logo + Mascote */}
      <div className="flex-1 flex flex-col items-center justify-center pt-12 pb-4 relative z-10">
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/images/logo-sono-magico.png"
            alt="Sono Magico Animadabra"
            width={220}
            height={130}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Magicaco na rede */}
        <div className="relative" style={{ width: 280, height: 180 }}>
          <Image
            src="/images/magicaco-hammock.png"
            alt="Magicaco dormindo na rede"
            width={280}
            height={180}
            className="drop-shadow-2xl"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Form card */}
      <div className="relative z-10 px-5 pb-10">
        <div className="w-full max-w-sm mx-auto glass-card rounded-lg p-6 shadow-elevated space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">
                Email
              </label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-md bg-white/[0.04] border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">
                Senha
              </label>
              <input
                id="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="minimo 6 caracteres"
                className="w-full px-4 py-3 rounded-md bg-white/[0.04] border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition"
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={handleResetPassword} disabled={loading} className="text-xs text-lavender hover:underline">
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && <div className="text-sm text-error bg-error/[0.12] border border-error/20 px-4 py-3 rounded-md">{error}</div>}
            {success && <div className="text-sm text-accent-teal bg-accent-teal/[0.12] border border-accent-teal/20 px-4 py-3 rounded-md">{success}</div>}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-pill text-white font-body font-extrabold text-lg transition-all disabled:opacity-[0.38] active:scale-[0.96] shadow-glow"
              style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            {mode === 'login' ? 'Nao tem conta?' : 'Ja tem conta?'}{' '}
            <button type="button" onClick={switchMode} className="text-lavender font-bold hover:underline">
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
