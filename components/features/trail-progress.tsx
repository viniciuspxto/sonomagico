import type { RitualNightStatus } from '@/types'

interface NightInfo {
  night_number: number
  status: RitualNightStatus
}

interface TrailProgressProps {
  nights: NightInfo[]
  currentNight: number
  compact?: boolean
}

export function TrailProgress({ nights, currentNight, compact = false }: TrailProgressProps) {
  const size = compact ? 24 : 32
  const gap = compact ? 'gap-1.5' : 'gap-2'
  const fontSize = compact ? 'text-xs' : 'text-sm'

  function getStatus(n: number): 'completed' | 'skipped' | 'current' | 'future' {
    const night = nights.find(ni => ni.night_number === n)
    if (night?.status === 'completed') return 'completed'
    if (night?.status === 'skipped') return 'skipped'
    if (n === currentNight) return 'current'
    return 'future'
  }

  return (
    <div className={`flex items-center ${gap}`}>
      {Array.from({ length: 7 }, (_, i) => i + 1).map(n => {
        const status = getStatus(n)

        return (
          <div
            key={n}
            className={`flex items-center justify-center rounded-full flex-shrink-0 font-bold ${fontSize}`}
            style={{
              width: size,
              height: size,
              ...(status === 'completed' ? {
                backgroundColor: 'rgba(78,205,196,0.2)',
                border: '2px solid #4ECDC4',
                color: '#4ECDC4',
              } : status === 'skipped' ? {
                backgroundColor: 'rgba(239,68,68,0.15)',
                border: '2px solid #EF4444',
                color: '#EF4444',
              } : status === 'current' ? {
                backgroundColor: 'rgba(155,114,207,0.15)',
                border: '2px solid #9B72CF',
                color: '#9B72CF',
                animation: 'pulse-glow 2s ease-in-out infinite',
              } : {
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(200,168,233,0.15)',
                color: 'rgba(240,232,255,0.38)',
              }),
            }}
          >
            {status === 'completed' ? (
              <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 18 18" fill="none">
                <path d="M4 9L7.5 12.5L14 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : status === 'skipped' ? (
              <svg width={compact ? 10 : 12} height={compact ? 10 : 12} viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <span>{n}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
