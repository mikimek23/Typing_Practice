import { useState } from 'react'
import type { TimelinePoint } from '../types/testResult'

type ResultChartProps = {
  timeline?: TimelinePoint[]
  durationSeconds: number
  wpm: number
  rawWpm?: number
  accuracy: number
}

export const ResultChart = ({
  timeline = [],
  durationSeconds,
  wpm,
  rawWpm = wpm,
}: ResultChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null)

  // Ensure we have at least 2 points for a line
  const points: TimelinePoint[] =
    timeline.length >= 2
      ? timeline
      : [
          { second: 0, wpm: 0, rawWpm: 0, errors: 0 },
          {
            second: durationSeconds || 1,
            wpm,
            rawWpm,
            errors: 0,
          },
        ]

  const maxWpm = Math.max(
    ...points.map((p) => Math.max(p.wpm, p.rawWpm)),
    wpm + 10,
    30,
  )
  const chartHeight = 180
  const chartWidth = 640
  const padding = { top: 24, right: 24, bottom: 32, left: 36 }

  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const getX = (second: number) => {
    const totalTime = Math.max(durationSeconds, 1)
    return padding.left + (second / totalTime) * innerWidth
  }

  const getY = (val: number) => {
    return padding.top + innerHeight - (val / maxWpm) * innerHeight
  }

  const wpmPointsString = points
    .map((p) => `${getX(p.second)},${getY(p.wpm)}`)
    .join(' ')

  const rawWpmPointsString = points
    .map((p) => `${getX(p.second)},${getY(p.rawWpm)}`)
    .join(' ')

  const areaPointsString = `${getX(0)},${padding.top + innerHeight} ${wpmPointsString} ${getX(durationSeconds)},${padding.top + innerHeight}`

  // Errors for scatter markers
  const errorPoints = points.filter((p) => p.errors > 0)

  return (
    <div className='relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-4 shadow-sm backdrop-blur-md'>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold'>
        <div className='flex items-center gap-4'>
          <span className='inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400'>
            <span className='h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' />
            Net WPM: {wpm}
          </span>
          <span className='inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400'>
            <span className='h-2.5 w-2.5 rounded-full border border-dashed border-slate-400 bg-transparent' />
            Raw WPM: {rawWpm}
          </span>
          {errorPoints.length > 0 && (
            <span className='inline-flex items-center gap-1.5 text-rose-500'>
              <span className='h-2 w-2 rounded-full bg-rose-500' />
              {errorPoints.reduce((s, p) => s + p.errors, 0)} Error(s)
            </span>
          )}
        </div>
        <span className='text-[0.7rem] uppercase tracking-wider text-[var(--muted)]'>
          Pace Timeline (0 - {durationSeconds}s)
        </span>
      </div>

      <div className='relative w-full overflow-x-auto'>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className='w-full overflow-visible'
          preserveAspectRatio='none'
        >
          <defs>
            <linearGradient id='wpmFillGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='var(--accent)' stopOpacity='0.35' />
              <stop offset='100%' stopColor='var(--accent)' stopOpacity='0.0' />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio)
            const labelValue = Math.round(maxWpm * ratio)
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke='var(--border)'
                  strokeDasharray='3 3'
                  strokeWidth='1'
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor='end'
                  fill='var(--muted)'
                  fontSize='10'
                  fontFamily='inherit'
                  fontWeight='600'
                >
                  {labelValue}
                </text>
              </g>
            )
          })}

          {/* Time axis markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const time = Math.round(durationSeconds * ratio)
            const x = padding.left + innerWidth * ratio
            return (
              <text
                key={ratio}
                x={x}
                y={chartHeight - 8}
                textAnchor={
                  ratio === 0 ? 'start' : ratio === 1 ? 'end' : 'middle'
                }
                fill='var(--muted)'
                fontSize='10'
                fontFamily='inherit'
                fontWeight='600'
              >
                {time}s
              </text>
            )
          })}

          {/* Shaded Area under Net WPM */}
          <polygon points={areaPointsString} fill='url(#wpmFillGradient)' />

          {/* Raw WPM line (dashed) */}
          <polyline
            points={rawWpmPointsString}
            fill='none'
            stroke='var(--muted)'
            strokeWidth='1.75'
            strokeDasharray='4 3'
            opacity='0.65'
          />

          {/* Net WPM primary line */}
          <polyline
            points={wpmPointsString}
            fill='none'
            stroke='var(--accent)'
            strokeWidth='2.75'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Error points */}
          {errorPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={getX(pt.second)}
              cy={getY(pt.wpm)}
              r='4'
              className='fill-rose-500 stroke-white dark:stroke-slate-950'
              strokeWidth='1.5'
            />
          ))}

          {/* Interactive touch/hover points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={getX(pt.second)}
              cy={getY(pt.wpm)}
              r='5'
              className='cursor-pointer fill-transparent hover:fill-cyan-400'
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {hoveredPoint && (
          <div className='pointer-events-none absolute top-2 right-4 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs shadow-lg'>
            <p className='font-bold text-[var(--foreground)]'>
              Second {hoveredPoint.second}s: {hoveredPoint.wpm} WPM
            </p>
            <p className='text-[var(--muted)]'>
              Raw: {hoveredPoint.rawWpm} WPM{' '}
              {hoveredPoint.errors > 0
                ? `| Errors: ${hoveredPoint.errors}`
                : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
