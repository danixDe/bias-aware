import Link from 'next/link'
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import { Job } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function JobCard({ job, recruiterView = false }: { job: Job; recruiterView?: boolean }) {
  const typeColor = job.type === 'remote' ? 'blue' : job.type === 'contract' ? 'amber' : 'green'

  return (
    <div className="card p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={typeColor as 'green' | 'blue' | 'amber'}>{job.type}</Badge>
            {job.status === 'closed' && <Badge variant="red">Closed</Badge>}
            {job.status === 'draft' && <Badge variant="default">Draft</Badge>}
          </div>
          <h3 className="font-syne font-bold text-base text-ink mt-1.5 truncate">{job.title}</h3>
          <p className="text-sm font-dm text-muted mt-0.5">{job.company}</p>
        </div>
        <Link
          href={recruiterView ? `/jobs/${job.id}/applicants` : `/jobs/${job.id}`}
          className="flex-shrink-0 p-2 rounded-lg border border-border hover:bg-cream transition-colors"
        >
          <ChevronRight size={16} className="text-muted group-hover:text-ink transition-colors" />
        </Link>
      </div>

      <p className="text-sm font-dm text-muted mt-3 line-clamp-2 leading-relaxed">{job.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.requirements.slice(0, 3).map((r) => (
          <span key={r} className="text-[11px] font-dm bg-cream border border-border rounded px-2 py-0.5 text-muted">{r}</span>
        ))}
        {job.requirements.length > 3 && (
          <span className="text-[11px] font-dm text-muted">+{job.requirements.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs font-dm text-muted">
            <MapPin size={12} />{job.location}
          </span>
          {job.salary && (
            <span className="text-xs font-dm text-muted">{job.salary}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-dm text-muted">
            <span className="flex items-center gap-1.5">
              <Users size={12} />{job.applicants} applicants
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />{formatDate(job.postedAt)}
            </span>
          </div>
          {!recruiterView && (
            <Link
              href={`/jobs/${job.id}`}
              className="btn-primary text-[11px] px-3 py-1.5 ml-1"
            >
              Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
