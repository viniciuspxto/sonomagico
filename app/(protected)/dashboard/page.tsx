import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/features/logout-button'
import { TrailProgress } from '@/components/features/trail-progress'
import { calculateStreak, completedToday } from '@/lib/streak'
import type { RitualNightStatus } from '@/types'

const DAYS = ['D','S','T','Q','Q','S','S']

const EMOTION_EMOJIS: Record<string, string> = {
  'muito-feliz': '😄', 'feliz': '🙂', 'tranquilo': '😌',
  'neutro': '😐', 'cansado': '😴', 'triste': '😢',
  'ansioso': '😰', 'com-raiva': '😠', 'com-medo': '😨',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('user_id', user!.id).single(),
    supabase.from('children').select('id, name, age').eq('user_id', user!.id).limit(1),
  ])

  if (!profile || !children?.length) redirect('/onboarding')

  const child = children[0]

  // Fetch ritual nights + emotions in parallel
  const [{ data: ritualNights }, { data: emotionCheckins }] = await Promise.all([
    supabase
      .from('ritual_nights')
      .select('night_number, status, completed_at')
      .eq('user_id', user!.id)
      .eq('child_id', child.id)
      .order('night_number', { ascending: true }),
    supabase
      .from('emotion_checkins')
      .select('emotion, checked_at')
      .eq('user_id', user!.id)
      .order('checked_at', { ascending: false })
      .limit(7),
  ])

  const nights = (ritualNights ?? []) as Array<{
    night_number: number
    status: RitualNightStatus
    completed_at: string | null
  }>

  // Streak from ritual_nights completed dates
  const completedDates = nights
    .filter(n => n.status === 'completed' && n.completed_at)
    .map(n => n.completed_at!)

  const streak = calculateStreak(completedDates)
  const doneToday = completedToday(completedDates)
  const firstName = profile.full_name.split(' ')[0]

  // Trail state
  const completedOrSkipped = nights.filter(n => n.status === 'completed' || n.status === 'skipped')
  const trailComplete = completedOrSkipped.length >= 7
  const hasStarted = nights.length > 0

  let currentNight = 1
  if (hasStarted) {
    const existing = new Set(nights.map(n => n.night_number))
    for (let i = 1; i <= 7; i++) {
      if (!existing.has(i)) { currentNight = i; break }
    }
    if (existing.size >= 7) currentNight = 7
  }

  // Last 7 days for week dots
  const today = new Date()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const done = completedDates.some(dt => {
      const dd = new Date(dt)
      return `${dd.getFullYear()}-${dd.getMonth()}-${dd.getDate()}` === key
    })
    return { day: DAYS[d.getDay()], done, isToday: i === 6 }
  })

  const recentEmotions = emotionCheckins?.slice(0, 7).reverse() ?? []

  // CTA state
  function getCTA() {
    if (trailComplete) {
      return {
        label: 'Trilha concluida!',
        sublabel: 'Parabens! Voce completou as 7 noites',
        emoji: '🏆',
        href: '#',
        style: 'gold' as const,
      }
    }
    if (doneToday) {
      return {
        label: `Noite ${currentNight - 1} concluida!`,
        sublabel: 'Volte amanha para continuar',
        emoji: '🌙',
        href: '#',
        style: 'teal' as const,
      }
    }
    if (!hasStarted) {
      return {
        label: 'Comecar Ritual das 7 Noites',
        sublabel: `Uma trilha magica para ${child.name}`,
        emoji: '🌙',
        href: '/ritual',
        style: 'gold' as const,
      }
    }
    return {
      label: `Iniciar Noite ${currentNight}`,
      sublabel: `Personalizado para ${child.name}`,
      emoji: '🌙',
      href: '/ritual',
      style: 'primary' as const,
    }
  }

  const cta = getCTA()

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.3), transparent 70%)' }}
      />

      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between relative z-10">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-widest font-extrabold">{getGreeting()}</p>
          <h1 className="font-heading text-2xl font-bold text-text">{firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-5 pb-12 space-y-4 max-w-md mx-auto w-full relative z-10">

        {/* Painel do Pai — Streak */}
        <div className="glass-card rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-muted text-xs font-extrabold uppercase tracking-widest">Painel do Pai</p>
              <p className="font-body font-bold text-text text-sm mt-0.5">{child.name} · {child.age} anos</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Avaliacao</p>
              <p className="font-heading font-bold text-text">4.8 ⭐</p>
            </div>
          </div>

          {/* Streak ring + week */}
          <div className="flex items-center gap-5">
            {/* Big streak circle */}
            <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="#F5B942" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - Math.min(streak / 30, 1))}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-bold text-accent-gold text-xl leading-none">{streak}</span>
                <span className="text-text-muted text-xs leading-none">noites</span>
              </div>
            </div>

            {/* Week dots */}
            <div className="flex-1">
              <div className="flex justify-between">
                {last7.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      d.done
                        ? 'bg-accent-teal/20 border-2 border-accent-teal text-accent-teal'
                        : d.isToday
                        ? 'border-2 border-lavender/25 text-text-muted'
                        : 'bg-violet/[0.15] border-2 border-lavender/25 text-text-muted'
                    }`}>
                      {d.done ? '✓' : ''}
                    </div>
                    <span className="text-text-muted text-xs">{d.day}</span>
                  </div>
                ))}
              </div>
              {streak >= 3 && (
                <p className="text-xs text-accent-gold font-bold mt-2">
                  {streak >= 7 ? '🦉 Semana perfeita!' : '🌟 Otima sequencia!'}
                </p>
              )}
            </div>
          </div>

          {/* Emotional history */}
          {recentEmotions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-text-muted text-xs font-extrabold uppercase tracking-widest mb-2">Estado emocional recente</p>
              <div className="flex gap-2 items-center">
                {recentEmotions.map((e, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm bg-violet/20"
                    title={e.emotion}
                  >
                    {EMOTION_EMOJIS[e.emotion] ?? '😐'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Atividades */}
        <div>
          <p className="font-body font-extrabold text-lavender text-xs uppercase tracking-widest mb-3">Atividades</p>
          <div className="space-y-3">
            {/* CTA Ritual das 7 Noites */}
            <Link href={cta.href} className="block">
              <div
                className={`rounded-lg p-5 transition-all ${
                  cta.style === 'teal'
                    ? 'bg-accent-teal/10 border border-accent-teal/20'
                    : 'shadow-glow'
                }`}
                style={
                  cta.style === 'gold'
                    ? { background: 'linear-gradient(135deg, #F5B942, #FF8C42)' }
                    : cta.style === 'primary'
                    ? { background: 'linear-gradient(135deg, #3D1A78, #6B3FA0)' }
                    : {}
                }
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <p className={`text-xs uppercase tracking-widest font-extrabold ${
                      cta.style === 'teal' ? 'text-accent-teal' :
                      cta.style === 'gold' ? 'text-white/80' : 'text-white/70'
                    }`}>
                      {cta.style === 'teal' ? '✓ Concluido hoje' :
                       cta.style === 'gold' && trailComplete ? '🏆 Trilha completa' :
                       'Para esta noite'}
                    </p>
                    <p className={`font-heading font-bold text-xl ${
                      cta.style === 'teal' ? 'text-accent-teal' : 'text-white'
                    }`}>
                      {cta.label}
                    </p>
                    <p className={`text-sm ${
                      cta.style === 'teal' ? 'text-accent-teal/70' : 'text-white/60'
                    }`}>
                      {cta.sublabel}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3 relative" style={{ width: 52, height: 52 }}>
                    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      {/* Moon */}
                      <circle cx="26" cy="26" r="16" fill="#F5E8A8" opacity="0.9" />
                      <circle cx="32" cy="20" r="16" fill={cta.style === 'teal' ? '#0d2a26' : cta.style === 'gold' ? '#F5B942' : '#3D1A78'} />
                      <circle cx="26" cy="26" r="16" fill="#F5E8A8" opacity="0.85" />
                      {/* Stars */}
                      <circle cx="8" cy="10" r="1.8" fill="#F5E8A8" opacity="0.9" />
                      <circle cx="44" cy="8" r="1.2" fill="#F5E8A8" opacity="0.7" />
                      <circle cx="46" cy="38" r="1.5" fill="#F5E8A8" opacity="0.8" />
                      <circle cx="6" cy="40" r="1" fill="#F5E8A8" opacity="0.6" />
                      <circle cx="14" cy="4" r="1" fill="#fff" opacity="0.5" />
                      <circle cx="40" cy="48" r="1.3" fill="#fff" opacity="0.6" />
                      <circle cx="48" cy="22" r="0.8" fill="#fff" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* Trail progress indicator */}
                {hasStarted && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <TrailProgress
                      nights={nights.map(n => ({ night_number: n.night_number, status: n.status }))}
                      currentNight={currentNight}
                      compact
                    />
                  </div>
                )}
              </div>
            </Link>

            {/* Respiracao e Historias — side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card Respiracao */}
              <Link href="/respiracao" className="block">
                <div className="relative rounded-card overflow-hidden hover:scale-[1.02] transition-all active:scale-[0.97]" style={{ aspectRatio: '1/1.15' }}>
                  {/* Background illustration */}
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at 50% 30%, #2D1A78 0%, #1A0A3C 80%)',
                  }}>
                    {/* Moon */}
                    <div className="absolute top-3 right-4 w-8 h-8 rounded-full" style={{
                      background: 'radial-gradient(circle at 35% 35%, #F5E8A8, #E8D898)',
                      boxShadow: '0 0 20px rgba(245,232,168,0.3)',
                    }} />
                    {/* Stars */}
                    <div className="absolute top-5 left-4 w-1.5 h-1.5 rounded-full bg-white/60" />
                    <div className="absolute top-8 left-10 w-1 h-1 rounded-full bg-white/40" />
                    <div className="absolute top-4 left-[45%] w-1 h-1 rounded-full bg-white/50" />
                    <div className="absolute top-10 right-10 w-1 h-1 rounded-full bg-lavender/40" />
                    {/* Soft clouds/mist at bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-1/3" style={{
                      background: 'linear-gradient(to top, rgba(107,63,160,0.25), transparent)',
                    }} />
                  </div>
                  {/* Magicaco image */}
                  <div className="absolute inset-x-0 bottom-10 flex justify-center">
                    <Image
                      src="/images/magicaco-breathing.png"
                      alt="Respiracao"
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
                    />
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3 text-center" style={{
                    background: 'linear-gradient(to top, rgba(26,10,60,0.95), rgba(26,10,60,0.6), transparent)',
                  }}>
                    <p className="font-body font-extrabold text-text text-sm">Respiracao</p>
                  </div>
                </div>
              </Link>

              {/* Card Historias */}
              <Link href="/historias" className="block">
                <div className="relative rounded-card overflow-hidden hover:scale-[1.02] transition-all active:scale-[0.97]" style={{ aspectRatio: '1/1.15' }}>
                  {/* Background image — fills entire card */}
                  <Image
                    src="/images/magicaco-reading.png"
                    alt="Historias"
                    fill
                    className="object-cover object-top"
                  />
                  {/* Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3 text-center" style={{
                    background: 'linear-gradient(to top, rgba(13,27,42,0.95), rgba(13,27,42,0.6), transparent)',
                  }}>
                    <p className="font-body font-extrabold text-text text-sm">Historias</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
