import { cn, getScoreColor } from '@/lib/utils'

interface ScoreBarProps {
  label: string
  value: number
  max?: number
  showNumber?: boolean
}

export default function ScoreBar({ label, value, max = 100, showNumber = true }: ScoreBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  const color = value >= 80 ? 'bg-forest' : value >= 60 ? 'bg-amber-500' : 'bg-accent'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-dm text-muted">{label}</span>
        {showNumber && (
          <span className={cn('text-xs font-syne font-bold', getScoreColor(value))}>{value}%</span>
        )}
      </div>
      <div className="h-1.5 bg-cream rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
