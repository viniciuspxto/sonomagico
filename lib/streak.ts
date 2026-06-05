/**
 * Calcula o streak (dias consecutivos) a partir de uma lista de datas de conclusão.
 * Considera fuso horário local. Uma conclusão hoje mantém o streak ativo.
 */
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0

  const toDay = (dateStr: string) => {
    const d = new Date(dateStr)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  }

  const uniqueDays = Array.from(new Set(completedDates.map(toDay))).sort((a, b) => b - a)

  const today = new Date()
  const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const dayMs = 86_400_000

  // O streak só está ativo se completou hoje ou ontem
  if (uniqueDays[0] < todayMs - dayMs) return 0

  let streak = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1] - uniqueDays[i] === dayMs) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function completedToday(completedDates: string[]): boolean {
  if (!completedDates.length) return false
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  return completedDates.some((d) => {
    const dt = new Date(d)
    return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}` === todayStr
  })
}
