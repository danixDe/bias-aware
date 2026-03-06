import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import { ScreeningResult } from '@/types'
import { getBiasSeverityStyle, getScoreColor, cn } from '@/lib/utils'
import ScoreBar from './ScoreBar'
import Badge from './Badge'

interface FeedbackPanelProps {
  result: ScreeningResult
  candidateName?: string
}

export default function FeedbackPanel({ result, candidateName }: FeedbackPanelProps) {
  const isShortlisted = result.decision === 'shortlisted'

  return (
    <div className="flex flex-col gap-4">
      {/* Decision Header */}
      <div className={cn(
        'rounded-xl border p-4 flex items-start gap-3',
        isShortlisted ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
      )}>
        {isShortlisted
          ? <CheckCircle size={20} className="text-forest flex-shrink-0 mt-0.5" />
          : <XCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
        }
        <div>
          <p className="text-sm font-syne font-bold text-ink">
            {isShortlisted ? 'Shortlisted for Interview' : 'Application Not Progressed'}
          </p>
          <p className="text-xs font-dm text-muted mt-0.5">
            AI Confidence Score: <span className={cn('font-bold', getScoreColor(result.score))}>{result.score}%</span>
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="card p-4 flex flex-col gap-3">
        <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted">Match Breakdown</p>
        <ScoreBar label="Overall Score" value={result.score} />
        <ScoreBar label="Skills Match" value={result.skillsMatch} />
        <ScoreBar label="Experience Fit" value={result.experienceMatch} />
      </div>

      {/* AI Feedback */}
      <div className="bg-[#fff9f0] border border-[#f0d9b5] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-accent" />
          <p className="text-[10px] font-syne font-bold tracking-[1.5px] uppercase text-accent">
            AI Feedback {candidateName ? `for ${candidateName}` : ''}
          </p>
        </div>
        <p className="text-sm font-dm text-ink leading-relaxed">{result.feedback}</p>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="card p-4">
          <p className="text-[10px] font-syne font-bold tracking-[1.5px] uppercase text-muted mb-3">Strengths Identified</p>
          <div className="flex flex-wrap gap-2">
            {result.strengths.map((s) => (
              <Badge key={s} variant="green">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gaps */}
      {result.skillGaps.length > 0 && (
        <div className="card p-4">
          <p className="text-[10px] font-syne font-bold tracking-[1.5px] uppercase text-muted mb-3">Skill Gaps</p>
          <div className="flex flex-wrap gap-2">
            {result.skillGaps.map((g) => (
              <Badge key={g} variant="amber">{g}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Bias Flags */}
      {result.biasFlags.length > 0 && (
        <div className="card p-4 border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-amber-600" />
            <p className="text-[10px] font-syne font-bold tracking-[1.5px] uppercase text-amber-700">
              Bias Flags Detected & Logged
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {result.biasFlags.map((flag, i) => (
              <div
                key={i}
                className={cn('rounded-lg border px-3 py-2 text-xs', getBiasSeverityStyle(flag.severity))}
              >
                <span className="font-bold">{flag.type}</span>
                <span className="mx-1.5">·</span>
                <span className="opacity-80">{flag.description}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-dm text-muted mt-2">
            Bias flags are logged for audit purposes and do not affect candidate feedback.
          </p>
        </div>
      )}
    </div>
  )
}
