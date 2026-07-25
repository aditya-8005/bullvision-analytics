import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { StockSearch } from '../components/search/StockSearch'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { BullVisionWordmark } from '../components/branding/BullVisionMark'
import { AnimatedCounter } from '../components/landing/AnimatedCounter'
import { LandingHeroBackdrop } from '../components/landing/LandingHeroBackdrop'

const featureCards = [
  {
    title: 'Historical Event Analysis',
    description:
      'Study major market events with a premium research flow designed to surface patterns, context, and impact.',
    accent: 'text-analytics',
  },
  {
    title: 'Stock Performance Analytics',
    description:
      'Compare stock behavior across crisis windows, recovery periods, and broader market phases with clarity.',
    accent: 'text-success',
  },
  {
    title: 'Recovery Timeline',
    description:
      'Track how markets recovered after shocks and understand the duration of each rebound cycle.',
    accent: 'text-warning',
  },
  {
    title: 'AI-powered Insights',
    description:
      'Coming soon: guided analysis that turns historical structure into investment-ready context.',
    accent: 'text-text-secondary',
  },
]

const trustPoints = [
  'Historical market intelligence',
  'Event-driven analytics',
  'Built for investors, students, and recruiters',
]

const chartPoints = [
  56, 59, 61, 58, 63, 67, 64, 70, 74, 68, 60, 53, 45, 38, 34, 31, 36, 43, 51, 58, 65, 71, 78,
  82, 85, 88, 90, 86, 84, 81,
]

const chartMarkers = [
  { label: '2008 Financial Crisis', tone: 'text-error', year: '2008' },
  { label: '2016 Demonetization', tone: 'text-warning', year: '2016' },
  { label: '2020 COVID Crash', tone: 'text-analytics', year: '2020' },
]

const heroStats = [
  { label: 'Drawdown', value: 41.2, prefix: '-', suffix: '%', decimals: 1 },
  { label: 'Recovery Time', value: 13, suffix: ' months', decimals: 0 },
  { label: 'CAGR', value: 18.4, suffix: '%', decimals: 1 },
]

function buildChartGeometry(points: number[]) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const width = 640
  const height = 300
  const xStep = width / Math.max(points.length - 1, 1)
  const coordinates = points.map((point, index) => {
    const x = index * xStep
    const normalized = (point - min) / Math.max(max - min, 1)
    const y = height - normalized * (height - 24) - 12
    return { x, y }
  })

  const path = coordinates
    .map((point, index) => {
      const { x, y } = point
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')

  return {
    path,
    areaPath: `${path} L 640 360 L 0 360 Z`,
    coordinates,
  }
}

function LandingPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const chartGeometry = buildChartGeometry(chartPoints)
  const heroReveal = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-16 overflow-x-hidden py-10 lg:space-y-24 lg:py-14">
      <section id="hero" className="relative">
        <Container maxWidth="2xl" className="relative">
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface/25 p-4 shadow-border sm:p-6 lg:p-8">
            <LandingHeroBackdrop />
            <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <motion.div
                className="space-y-8"
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
                  },
                }}
              >
                <motion.div className="space-y-5" variants={heroReveal}>
                  <BullVisionWordmark className="max-w-lg bg-background/65" />
                  <motion.h1
                    className="max-w-4xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-7xl"
                    variants={heroReveal}
                  >
                    Understand market behavior through the moments that moved it.
                  </motion.h1>
                  <motion.p
                    className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:max-w-xl"
                    variants={heroReveal}
                  >
                    A premium fintech experience for exploring historical events, stock performance,
                    and the recovery patterns that shape modern market conviction.
                  </motion.p>
                </motion.div>

                <motion.div
                  className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                  variants={heroReveal}
                >
                  <StockSearch />
                  <Button
                    variant="secondary"
                    className="w-full transition-transform hover:-translate-y-0.5 sm:w-auto sm:min-w-48"
                    onClick={() => navigate('/historical/covid-19-market-crash')}
                  >
                    Explore Historical Events
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  variant="glass"
                  className="relative isolate overflow-hidden border-border-strong p-5 shadow-raised transition-transform duration-slow ease-emphasized hover:-translate-y-1 lg:p-8"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(91,140,255,0.18),transparent_42%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.1),transparent_38%)]" />
                  <div className="absolute left-5 top-5 h-24 w-24 rounded-full bg-analytics/10 blur-3xl" />

                  <div className="relative space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-text-secondary">RELIANCE</p>
                        <p className="text-2xl font-semibold tracking-tight text-text-primary">
                          Historical resilience preview
                        </p>
                      </div>

                      <div className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium tracking-wider text-text-secondary">
                        Live analytics pulse
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="relative overflow-hidden rounded-3xl border border-border bg-background/60 p-5 shadow-border sm:p-6 lg:p-7">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">
                              Performance line
                            </p>
                            <p className="mt-1 text-sm text-text-secondary">
                              Drawdown, crisis markers, and recovery trajectory
                            </p>
                          </div>
                          <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                            1998 - 2024
                          </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-5 lg:p-6">
                          <svg viewBox="0 0 640 360" className="h-[18rem] w-full sm:h-[22rem] lg:h-[26rem]">
                            <defs>
                              <linearGradient id="bullLineGradient" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="rgba(130,178,255,0.2)" />
                                <stop offset="55%" stopColor="rgba(91,140,255,0.95)" />
                                <stop offset="100%" stopColor="rgba(34,197,94,0.9)" />
                              </linearGradient>
                              <linearGradient id="bullAreaGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="rgba(91,140,255,0.24)" />
                                <stop offset="100%" stopColor="rgba(91,140,255,0.02)" />
                              </linearGradient>
                              <radialGradient id="bullGlowGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgba(91,140,255,0.55)" />
                                <stop offset="100%" stopColor="rgba(91,140,255,0)" />
                              </radialGradient>
                            </defs>

                            <g className="text-text-secondary/30">
                              {[72, 144, 216, 288].map((line) => (
                                <line
                                  key={line}
                                  x1="0"
                                  x2="640"
                                  y1={line}
                                  y2={line}
                                  stroke="currentColor"
                                  strokeDasharray="4 10"
                                  strokeWidth="1"
                                />
                              ))}
                            </g>

                            <motion.path
                              d={chartGeometry.areaPath}
                              fill="url(#bullAreaGradient)"
                              opacity="0.9"
                              initial={shouldReduceMotion ? false : { opacity: 0 }}
                              animate={{ opacity: 0.9 }}
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
                            />
                            <motion.path
                              d={chartGeometry.path}
                              fill="none"
                              stroke="url(#bullLineGradient)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.3, ease: 'easeOut' }}
                            />

                            {chartGeometry.coordinates
                              .filter((_, pointIndex) => pointIndex % 6 === 0)
                              .map((point, pointIndex) => (
                                <motion.circle
                                  key={`${point.x}-${point.y}`}
                                  cx={point.x}
                                  cy={point.y}
                                  r={pointIndex === chartGeometry.coordinates.length - 1 ? 4.5 : 3.5}
                                  fill="url(#bullGlowGradient)"
                                  initial={shouldReduceMotion ? false : { scale: 0.85, opacity: 0 }}
                                  animate={
                                    shouldReduceMotion
                                      ? { scale: 1, opacity: 0.9 }
                                      : { scale: [1, 1.08, 1], opacity: 0.9 }
                                  }
                                  transition={
                                    shouldReduceMotion
                                      ? { duration: 0 }
                                      : { duration: 4.5 + pointIndex * 0.1, repeat: Infinity, ease: 'easeInOut' }
                                  }
                                />
                              ))}
                          </svg>

                          <motion.div
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(91,140,255,0.12),transparent_30%)]"
                            initial={shouldReduceMotion ? false : { opacity: 0.2 }}
                            animate={shouldReduceMotion ? { opacity: 0.2 } : { opacity: [0.18, 0.34, 0.18] }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                          />

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
                            <span>2014</span>
                            <span>2018</span>
                            <span>2020</span>
                            <span>2024</span>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {chartMarkers.map((marker, index) => (
                              <motion.div
                                key={marker.label}
                                className="rounded-2xl border border-border bg-background/70 p-3 shadow-border"
                                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                                animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -3, 0] }}
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`h-2.5 w-2.5 rounded-full ${marker.tone}`} />
                                  <p className="text-sm font-medium text-text-primary">{marker.label}</p>
                                </div>
                                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-text-tertiary">
                                  Timeline marker {marker.year}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {heroStats.map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -6, 0] }}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 5.5 + index * 0.35, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }
                            }
                          >
                            <Card className="p-4 transition-transform duration-fast ease-standard hover:-translate-y-0.5 hover:border-border-strong">
                              <p className="text-xs uppercase tracking-wider text-text-tertiary">{stat.label}</p>
                              <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                                <AnimatedCounter
                                  value={stat.value}
                                  decimals={stat.decimals}
                                  prefix={stat.prefix}
                                  suffix={stat.suffix}
                                />
                              </p>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      <section id="features">
        <Container maxWidth="2xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
                Features
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                A focused system for event-led analysis.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => (
              <Card
                key={feature.title}
                variant={index === 1 ? 'elevated' : 'default'}
                className="h-full transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong"
              >
                <p className={`text-sm font-medium ${feature.accent}`}>{feature.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="trust">
        <Container maxWidth="2xl">
          <Card variant="glass" className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
                  Why BullVision
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                  Built to communicate trust, precision, and analytical depth.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-border bg-surface/70 p-4">
                    <p className="text-sm leading-relaxed text-text-primary">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  )
}

export { LandingPage }
