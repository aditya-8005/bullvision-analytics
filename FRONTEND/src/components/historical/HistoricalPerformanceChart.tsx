import { Card } from '../ui/Card'

type HistoricalChartPhase = {
  label: string
  description: string
  startIndex: number
  endIndex: number
}

type HistoricalChartMarker = {
  label: string
  index: number
  description: string
}

type HistoricalPerformanceChartProps = {
  title: string
  subtitle: string
  points: number[]
  phases: HistoricalChartPhase[]
  markers: HistoricalChartMarker[]
}

function buildChartPath(points: number[]) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const width = 960
  const height = 420
  const xStep = width / Math.max(points.length - 1, 1)

  return points
    .map((point, index) => {
      const x = index * xStep
      const normalized = (point - min) / Math.max(max - min, 1)
      const y = height - normalized * (height - 54) - 18
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function HistoricalPerformanceChart({ title, subtitle, points, phases, markers }: HistoricalPerformanceChartProps) {
  const chartPath = buildChartPath(points)
  const width = 960
  const height = 420
  const xStep = width / Math.max(points.length - 1, 1)
  const min = Math.min(...points)
  const max = Math.max(...points)

  const markerPosition = (index: number) => {
    const point = points[index] ?? points[0]
    const x = index * xStep
    const normalized = (point - min) / Math.max(max - min, 1)
    const y = height - normalized * (height - 54) - 18
    return { x, y }
  }

  return (
    <Card variant="glass" className="space-y-5 p-6 lg:p-8">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">{subtitle}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-text-tertiary">
          {phases.map((phase) => (
            <span key={phase.label} className="rounded-full border border-border bg-background px-3 py-1">
              {phase.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-background/60 p-4 shadow-border lg:p-6">
        <svg viewBox="0 0 960 420" aria-hidden="true" className="h-[18rem] w-full sm:h-[24rem] lg:h-[30rem]">
          <defs>
            <linearGradient id="historicalLineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(130,178,255,0.2)" />
              <stop offset="100%" stopColor="rgba(91,140,255,1)" />
            </linearGradient>
            <linearGradient id="historicalAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(91,140,255,0.24)" />
              <stop offset="100%" stopColor="rgba(91,140,255,0.03)" />
            </linearGradient>
          </defs>

          {phases.map((phase, index) => {
            const x1 = (phase.startIndex / Math.max(points.length - 1, 1)) * width
            const x2 = (phase.endIndex / Math.max(points.length - 1, 1)) * width
            const phaseWidth = Math.max(x2 - x1, 0)
            const tone = index === 1 ? 'rgba(91,140,255,0.1)' : 'rgba(255,255,255,0.02)'
            return <rect key={phase.label} x={x1} y="0" width={phaseWidth} height={height} fill={tone} />
          })}

          <g className="text-text-secondary/20">
            {[60, 130, 200, 270, 340].map((line) => (
              <line
                key={line}
                x1="0"
                x2="960"
                y1={line}
                y2={line}
                stroke="currentColor"
                strokeDasharray="5 10"
                strokeWidth="1"
              />
            ))}
          </g>

          <path d={`${chartPath} L 960 420 L 0 420 Z`} fill="url(#historicalAreaGradient)" opacity="0.95" />
          <path
            d={chartPath}
            fill="none"
            stroke="url(#historicalLineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {markers.map((marker) => {
            const { x, y } = markerPosition(marker.index)
            return (
              <g key={marker.label}>
                <line x1={x} x2={x} y1={Math.max(y - 70, 24)} y2={Math.min(y + 70, height - 20)} stroke="rgba(255,255,255,0.14)" strokeDasharray="4 8" />
                <circle cx={x} cy={y} r="10" className="fill-analytics" opacity="0.75" />
                <circle cx={x} cy={y} r="18" fill="transparent" stroke="rgba(91,140,255,0.35)" strokeWidth="2" />
                <g transform={`translate(${Math.min(x + 16, 760)}, ${Math.max(y - 58, 26)})`}>
                  <rect width="160" height="46" rx="14" fill="rgba(12,17,28,0.88)" stroke="rgba(255,255,255,0.08)" />
                  <text x="14" y="19" fill="rgba(255,255,255,0.92)" fontSize="12" fontWeight="600">{marker.label}</text>
                  <text x="14" y="34" fill="rgba(185,194,214,0.88)" fontSize="10">{marker.description}</text>
                </g>
              </g>
            )
          })}
        </svg>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {phases.map((phase) => (
            <div key={phase.label} className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{phase.label}</p>
              <p className="mt-2 text-sm font-medium text-text-primary">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export type { HistoricalChartMarker, HistoricalChartPhase, HistoricalPerformanceChartProps }
export { HistoricalPerformanceChart }