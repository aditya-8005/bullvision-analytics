import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { BullVisionIcon } from '../branding/BullVisionMark'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-analytics text-white shadow-glow hover:bg-analytics-strong hover:shadow-raised focus-visible:ring-analytics/40',
  secondary:
    'bg-surface text-text-primary border border-border shadow-border hover:bg-surface-elevated hover:border-border-strong focus-visible:ring-border/50',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary focus-visible:ring-border/40',
}

function Button({
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-standard',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        'active:translate-y-px',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <BullVisionIcon animated surface={false} className="h-4 w-4 shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading ? rightIcon : null}
    </button>
  )
}

export type { ButtonProps, ButtonVariant }
export { Button }