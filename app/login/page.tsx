'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
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
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
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
        console.error('[login] signInWithPassword:', error)
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
      console.log('[signup] data:', data, 'error:', error)
      if (error) {
        setError(`Erro ao criar conta: ${error.message}`)
      } else if (data.user && data.user.identities?.length === 0) {
        setError('Este email já está cadastrado. Tente fazer login.')
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
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4), transparent 70%)' }}
      />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-5xl block" style={{ filter: 'drop-shadow(0 0 20px rgba(245,185,66,0.5))' }}>🌙</span>
          <h1 className="font-heading text-3xl font-bold text-text">Sono Mágico</h1>
          <p className="text-text-secondary text-sm">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
          </p>
        </div>

        <div className="glass-card rounded-lg p-6 shadow-card space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">Email</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-md bg-white/[0.04] border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-lavender transition"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-extrabold text-lavender uppercase tracking-wider">Senha</label>
              <input
                id="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
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
              className="w-full py-4 rounded-pill text-white font-body font-extrabold transition-all disabled:opacity-[0.38] active:scale-[0.96] shadow-glow"
              style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button type="button" onClick={switchMode} className="text-lavender font-bold hover:underline">
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
