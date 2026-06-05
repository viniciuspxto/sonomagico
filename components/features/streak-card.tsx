import { Card } from '@/components/ui'

interface StreakCardProps {
  streak: number
  completedToday: boolean
}

export function StreakCard({ streak, completedToday }: StreakCardProps) {
  return (
    <Card className="text-center space-y-1">
      <div className="text-4xl">{streak > 0 ? '🔥' : '✨'}</div>
      <p className="font-heading text-3xl font-bold text-accent-gold">
        {streak}
      </p>
      <p className="text-text-secondary text-sm">
        {streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
      </p>
      {completedToday && (
        <span className="inline-block mt-1 text-xs text-accent-teal font-bold bg-accent-teal/[0.18] px-3 py-1 rounded-pill">
          ✓ Ritual de hoje concluído
        </span>
      )}
    </Card>
  )
}
