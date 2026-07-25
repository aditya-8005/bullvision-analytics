import { useEffect, useState } from 'react'

type AnimatedCounterProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  durationMs?: number
}

function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  durationMs = 1200,
}: AnimatedCounterProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [displayValue, setDisplayValue] = useState(() => (prefersReducedMotion ? value : 0))

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined
    }

    let frameId = 0
    const startTime = performance.now()

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayValue(value * eased)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [durationMs, prefersReducedMotion, value])

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export type { AnimatedCounterProps }
export { AnimatedCounter }