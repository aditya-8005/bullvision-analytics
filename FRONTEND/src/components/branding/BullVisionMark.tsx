import type { HTMLAttributes } from 'react'

type BullVisionIconProps = HTMLAttributes<HTMLSpanElement> & {
  animated?: boolean
  surface?: boolean
}

type BullVisionLogoProps = HTMLAttributes<HTMLSpanElement> & {
  compact?: boolean
}

type BullVisionWordmarkProps = HTMLAttributes<HTMLDivElement> & {
  compact?: boolean
  showTagline?: boolean
}

type BullVisionLoaderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string
  description?: string
}

function BullVisionIcon({ animated = false, surface = true, className = '', ...props }: BullVisionIconProps) {
  return (
    <span
      {...props}
      className={[
        surface
          ? 'inline-flex items-center justify-center rounded-2xl border border-border bg-surface text-analytics shadow-border'
          : 'inline-flex items-center justify-center text-current',
        animated ? 'animate-bull-spin' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className={surface ? 'h-full w-full p-2' : 'h-full w-full'}>
        <defs>
          <linearGradient id="bullvision-mark-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {surface ? <rect x="4" y="4" width="40" height="40" rx="13" fill="rgba(8, 13, 24, 0.2)" /> : null}
        <path
          d="M11 32.5V28.4L17.2 23.9V32.5M19.2 32.5V18.1L25.4 13.6V32.5M27.4 32.5V20.5L33.6 16.2V32.5"
          fill="none"
          stroke="url(#bullvision-mark-gradient)"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 29.8L19 22.2L26.2 24.8L37 14"
          fill="none"
          stroke="url(#bullvision-mark-gradient)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.9 14.2c1.8-2.5 4.9-3.2 7.8-2.1-1.3 1.5-2.8 3.1-4.3 4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <path
          d="M17.4 14.8c1.6-1.9 4.4-2.5 6.8-1.6-1 1.1-2.2 2.4-3.5 3.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx="34.8" cy="14.4" r="1.1" fill="currentColor" />
        <circle cx="18" cy="14.7" r="1.1" fill="currentColor" />
      </svg>
    </span>
  )
}

function BullVisionLogo({ compact = false, className = '', children, ...props }: BullVisionLogoProps) {
  return (
    <span {...props} className={['inline-flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <BullVisionIcon className="h-11 w-11 shrink-0" />
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-wide text-text-primary sm:text-base">BullVision</span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-text-secondary sm:text-xs">Analytics</span>
        </span>
      ) : null}
      {children}
    </span>
  )
}

function BullVisionWordmark({ compact = false, showTagline = true, className = '', ...props }: BullVisionWordmarkProps) {
  return (
    <div
      {...props}
      className={[
        'inline-flex w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-border/80 bg-background/85 p-3 text-center shadow-border backdrop-blur-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src="/bullvision-logo.PNG"
        alt="BullVision Analytics"
        className={['block h-auto w-full select-none', compact ? 'max-w-[22rem]' : 'max-w-[28rem] sm:max-w-[32rem]'].join(' ')}
      />

      {showTagline ? <span className="sr-only">Historical insights. Smarter decisions.</span> : null}
      {!showTagline ? <span className="sr-only">BullVision Analytics</span> : null}
    </div>
  )
}

function BullVisionLoader({
  label = 'BullVision loading',
  description = 'Preparing market intelligence',
  className = '',
  ...props
}: BullVisionLoaderProps) {
  return (
    <div {...props} className={['flex items-center gap-4', className].filter(Boolean).join(' ')}>
      <BullVisionIcon animated className="h-12 w-12 shrink-0" />
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}

export type { BullVisionIconProps, BullVisionLogoProps, BullVisionLoaderProps }
export type { BullVisionWordmarkProps }
export { BullVisionIcon, BullVisionLogo, BullVisionLoader, BullVisionWordmark }