import { HTMLAttributes } from 'react'

type BadgeVariant = 'free' | 'premium' | 'new' | 'ritual' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  free: 'bg-accent-teal/[0.18] border border-accent-teal/40 text-accent-teal',
  premium: 'bg-accent-gold/[0.15] border border-accent-gold/40 text-accent-gold',
  new: 'bg-accent-orange/[0.15] border border-accent-orange/40 text-accent-orange',
  ritual: 'bg-accent-gold/[0.12] border border-accent-gold/40 text-accent-gold',
  default: 'bg-violet/20 border border-violet/40 text-light-lavender',
}

function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-extrabold uppercase tracking-wider',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
