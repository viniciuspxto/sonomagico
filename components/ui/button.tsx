import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'premium'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'text-white shadow-glow btn-press',
  secondary: 'border-2 border-lavender/50 text-light-lavender hover:border-lavender/80 btn-press',
  ghost: 'text-text-secondary underline underline-offset-[3px] decoration-text-muted',
  premium: 'text-white shadow-gold btn-press',
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' },
  secondary: { background: 'transparent' },
  ghost: { background: 'transparent' },
  premium: { background: 'linear-gradient(135deg, #7B4FC0, #FF8C42)' },
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-8 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, disabled, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          'rounded-pill font-body font-extrabold transition-all',
          'disabled:opacity-[0.38] disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 focus:ring-offset-deep',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
