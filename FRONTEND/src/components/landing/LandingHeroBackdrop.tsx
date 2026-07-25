const tickerRows = [
  ['RELIANCE +1.8%', 'NIFTY 50 +0.6%', 'BANKNIFTY +0.9%', 'INFY +1.2%'],
  ['TCS +0.8%', 'HDFCBANK +1.1%', 'FINANCE FLOW', 'SECTOR ROTATION'],
  ['VOLATILITY ↓', 'RISK SENTIMENT ↑', 'LIQUIDITY STABLE', 'RECOVERY SIGNAL'],
]

function LandingHeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,140,255,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.09),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_22%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-analytics/40 to-transparent animate-bull-drift" />
      <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-analytics/15 blur-3xl animate-bull-float" />
      <div className="absolute right-0 top-24 h-36 w-36 rounded-full bg-success/12 blur-3xl animate-bull-drift motion-reduce:animate-none" />
      <div className="absolute bottom-0 left-1/2 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-text-primary/5 blur-3xl" />

      <div className="absolute left-1/2 top-10 w-[120%] -translate-x-1/2 rotate-[-6deg] opacity-70 sm:w-[110%]">
        <div className="flex w-max gap-6 text-[10px] font-medium uppercase tracking-[0.28em] text-text-secondary sm:gap-8 sm:text-xs animate-bull-ticker motion-reduce:animate-none">
          {[...tickerRows[0], ...tickerRows[0]].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-border bg-background/70 px-3 py-2 shadow-border backdrop-blur-xl"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-28 left-0 w-[130%] rotate-[4deg] opacity-55 sm:bottom-24">
        <div className="flex w-max gap-4 text-[10px] font-medium uppercase tracking-[0.28em] text-text-secondary sm:gap-6 sm:text-xs animate-bull-ticker [animation-direction:reverse] motion-reduce:animate-none">
          {[...tickerRows[1], ...tickerRows[1]].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-border bg-surface/80 px-3 py-2 shadow-border backdrop-blur-xl"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 right-4 top-14 hidden w-40 flex-col items-end gap-3 sm:flex">
        {['NSE', 'BSE', 'FII', 'DII'].map((label, index) => (
          <div
            key={label}
            className={[
              'flex w-full items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-border backdrop-blur-xl',
              index % 2 === 0 ? 'animate-bull-float' : 'animate-bull-drift',
            ].join(' ')}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">{label}</span>
            <span className="text-xs font-semibold text-analytics">+{(index + 1) * 0.4}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { LandingHeroBackdrop }