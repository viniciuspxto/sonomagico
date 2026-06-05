interface ProgressBarProps {
  value: number      // 0–100
  label?: string
  showPercent?: boolean
  color?: 'primary' | 'gold' | 'teal'
  className?: string
}

const colorClasses = {
  primary: 'bg-violet',
  gold: 'bg-accent-gold',
  teal: 'bg-accent-teal',
}

function ProgressBar({ value, label, showPercent = false, color = 'primary', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showPercent && <span className="text-sm font-bold text-text">{clamped}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export { ProgressBar }
