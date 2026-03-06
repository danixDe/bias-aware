import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'amber' | 'blue' | 'purple'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const styles = {
    default: 'bg-cream border-border text-muted',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }
  return (
    <span className={cn(
      'inline-flex items-center text-[11px] font-syne font-bold tracking-wide border rounded px-2 py-0.5',
      styles[variant],
      className
    )}>
      {children}
    </span>
  )
}
