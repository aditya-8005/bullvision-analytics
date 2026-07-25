

type HistoricalPageHeaderProps = {
  eventName: string
  subtitle: string
  dateRange: string
  impactLabel: string
  onBack: () => void
  backLabel: string
  description?: string
}

function HistoricalPageHeader({
  eventName,
  subtitle,
  dateRange,
  impactLabel,
  onBack,
  backLabel,
  description = 'Deep-dive into a single historical market event using static market context, event-led analysis, and recovery framing.',
}: HistoricalPageHeaderProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-surface/40 p-6 shadow-border lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-text-tertiary">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
            >
              {backLabel}
            </button>
            <span>{subtitle}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              {eventName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
              <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
                {dateRange}
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 font-medium text-text-primary">
                {impactLabel}
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {description}
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-[28rem] xl:grid-cols-3">
          {[
            { label: 'Event', value: eventName },
            { label: 'Window', value: dateRange },
            { label: 'Status', value: impactLabel },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-surface p-4 shadow-border">
              <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export type { HistoricalPageHeaderProps }
export { HistoricalPageHeader }
