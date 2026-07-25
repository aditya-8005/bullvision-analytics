import type { HTMLAttributes } from 'react'

type CardVariant = 'default' | 'elevated' | 'glass'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface border-border shadow-border',
  elevated: 'bg-surface-elevated border-border-strong shadow-elevated',
  glass:
    'bg-surface-overlay border-border backdrop-blur-xl shadow-glow supports-[backdrop-filter]:bg-surface-overlay',
}

function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        'rounded-2xl border p-6 text-text-primary',
        'transition-[box-shadow,transform,border-color] duration-fast ease-standard',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export type { CardProps, CardVariant }
export { Card }