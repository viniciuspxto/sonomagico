'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(`Erro ao redefinir senha: ${error.message}`)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.4), transparent 70%)' }}
      />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-5xl">🔑</span>
          <h1 className="font-heading text-3xl font-bold text-text">Nova Senha</h1>
          <p className="text-text-secondary text-sm">Digite sua nova senha abaixo</p>
        </div>

        <div className="glass-card rounded-card p-6 shadow-card space-y-4">
          {success ? (
            <div className="text-sm text-accent-teal bg-accent-teal/10 border border-accent-teal/20 px-4 py-3 rounded-md text-center">
              Senha redefinida com sucesso! Redirecionando...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-extrabold text-text-secondary uppercase tracking-widest">Nova senha</label>
                <input
                  id="password" type="password" required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="mínimo 6 caracteres"
                  className="w-full px-4 py-3 rounded-md bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-violet transition"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-extrabold text-text-secondary uppercase tracking-widest">Confirmar senha</label>
                <input
                  id="confirmPassword" type="password" required minLength={6} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="repita a senha"
                  className="w-full px-4 py-3 rounded-md bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-violet transition"
                />
              </div>

              {error && <div className="text-sm text-accent-orange bg-accent-orange/10 border border-accent-orange/20 px-4 py-3 rounded-md">{error}</div>}

              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-pill text-white font-body font-extrabold transition-all disabled:opacity-[0.38] active:scale-[0.96] shadow-glow"
                style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
              >
                {loading ? 'Aguarde...' : 'Redefinir senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
