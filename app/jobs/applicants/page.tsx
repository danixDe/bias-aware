'use client'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, AlertTriangle, Download, Check, X } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import FeedbackPanel from '@/components/ui/FeedbackPanel'
import Badge from '@/components/ui/Badge'
import ScoreBar from '@/components/ui/ScoreBar'
import type { Application, Job } from '@/types'
import { cn, formatDate, getScoreColor, getStatusStyle } from '@/lib/utils'

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [selected, setSelected] = useState<Application | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    ;(async () => {
      const [appsRes, jobsRes] = await Promise.all([fetch('/api/applications'), fetch('/api/jobs')])

      if (appsRes.ok) {
        const data = await appsRes.json()
        setApplications(data.applications)
        setSelected(data.applications[0] ?? null)
        if (data.applications[0]?.jobId) {
          setSelectedJobId(data.applications[0].jobId)
        }
      }

      if (jobsRes.ok) {
        const data = await jobsRes.json()
        setJobs(data.jobs)
      }
    })()
  }, [])

  const job = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? jobs[0],
    [jobs, selectedJobId]
  )

  const jobApplications = useMemo(
    () => (job ? applications.filter((a) => a.jobId === job.id) : applications),
    [applications, job]
  )

  const filtered = filter === 'all' ? jobApplications : jobApplications.filter((a) => a.status === filter)

  return (
    <div className="min-h-screen">
      <Navbar role="recruiter" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-dm text-muted hover:text-ink transition-colors">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <span className="text-muted">/</span>
          <Link href="/jobs" className="text-sm font-dm text-muted hover:text-ink">
            Jobs
          </Link>
          <span className="text-muted">/</span>
          {jobs.length > 1 ? (
            <select
              className="text-sm font-dm text-ink border border-border rounded-lg px-2 py-1 bg-white"
              value={job?.id ?? ''}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm font-dm text-ink">{job?.title ?? 'Applicants'}</span>
          )}
        </div>

        {/* Job Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-syne font-extrabold text-3xl tracking-tight">
              {job ? job.title : 'Applicants'}
            </h1>
            {job && (
              <p className="text-sm font-dm text-muted mt-1">
                {job.company} · {job.location} · {jobApplications.length} applicants
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-sm px-4 py-2 flex items-center gap-2">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'shortlisted', 'screened', 'rejected', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'text-xs font-dm px-3 py-1.5 rounded-full border transition-colors capitalize',
                filter === f ? 'bg-ink text-white border-ink' : 'bg-white border-border text-muted hover:border-ink hover:text-ink'
              )}
            >
              {f} {f === 'all' ? `(${applications.length})` : `(${applications.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* LEFT: Applicant List */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {filtered.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelected(app)}
                className={cn(
                  'text-left card p-4 transition-all hover:shadow-sm',
                  selected?.id === app.id ? 'ring-2 ring-ink shadow-sm' : ''
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-syne font-bold text-sm truncate">{app.candidateName}</p>
                    <p className="text-xs font-dm text-muted truncate">{app.candidateEmail}</p>
                  </div>
                  {app.result && (
                    <span className={cn('font-syne font-extrabold text-lg flex-shrink-0', getScoreColor(app.result.score))}>
                      {app.result.score}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className={cn('text-[10px] border rounded px-2 py-0.5 font-syne font-bold capitalize', getStatusStyle(app.status))}>
                    {app.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {app.result?.biasFlags && app.result.biasFlags.length > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                        <AlertTriangle size={10} /> {app.result.biasFlags.length} flag
                      </span>
                    )}
                    <span className="text-[10px] font-dm text-muted">{formatDate(app.appliedAt)}</span>
                  </div>
                </div>

                {app.result && (
                  <div className="mt-2">
                    <ScoreBar label="" value={app.result.score} showNumber={false} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* RIGHT: Detail Panel */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="card p-6 sticky top-20">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-syne font-extrabold text-xl">{selected.candidateName}</h2>
                    <p className="text-sm font-dm text-muted">{selected.candidateEmail}</p>
                  </div>
                  {selected.status !== 'shortlisted' && selected.status !== 'rejected' && (
                    <div className="flex gap-2">
                      <button className="btn-accent text-xs px-4 py-2 flex items-center gap-1.5">
                        <Check size={13} /> Shortlist
                      </button>
                      <button className="btn-ghost text-xs px-4 py-2 flex items-center gap-1.5">
                        <X size={13} /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {selected.result ? (
                  <FeedbackPanel result={selected.result} candidateName={selected.candidateName} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-cream border border-border flex items-center justify-center mb-3">
                      <AlertTriangle size={20} className="text-muted" />
                    </div>
                    <p className="font-syne font-bold text-sm">Processing</p>
                    <p className="text-xs font-dm text-muted mt-1">AI screening in progress...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 flex flex-col items-center justify-center text-center">
                <p className="font-syne font-bold text-muted">Select an applicant to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
