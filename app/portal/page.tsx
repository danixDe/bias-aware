'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FeedbackPanel from '@/components/ui/FeedbackPanel'
import Badge from '@/components/ui/Badge'
import type { Application, ScreeningResult } from '@/types'
import { cn, formatDate, getStatusStyle } from '@/lib/utils'

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'shortlisted') return <CheckCircle size={16} className="text-forest" />
  if (status === 'rejected') return <XCircle size={16} className="text-accent" />
  if (status === 'processing') return <Loader2 size={16} className="text-blue-500 animate-spin" />
  return <Clock size={16} className="text-muted" />
}

export default function CandidatePortalPage() {
  const { data: session } = useSession()
  const user = session?.user as (typeof session)['user'] | undefined

  const [applications, setApplications] = useState<Application[]>([])
  const [selected, setSelected] = useState<Application | null>(null)

  const [jobs, setJobs] = useState<{ id: string; title: string; company: string; description: string; requirements: string[] }[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [resumeText, setResumeText] = useState('')
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)
  const [isScreening, setIsScreening] = useState(false)
  const [screenError, setScreenError] = useState<string | null>(null)

  const myApps = applications

  // Load existing applications for this candidate
  useEffect(() => {
    ;(async () => {
      const [appsRes, jobsRes] = await Promise.all([fetch('/api/applications'), fetch('/api/jobs')])

      if (appsRes.ok) {
        const data = await appsRes.json()
        setApplications(data.applications)
        setSelected(data.applications[0] ?? null)
      }

      if (jobsRes.ok) {
        const data = await jobsRes.json()
        const fetchedJobs = data.jobs as {
          id: string
          title: string
          company: string
          description: string
          requirements: string[]
        }[]
        setJobs(fetchedJobs)
        if (fetchedJobs.length > 0) {
          setSelectedJobId(fetchedJobs[0].id)
        }
      }
    })()
  }, [])

  async function handleScreenSubmit(e: React.FormEvent) {
    e.preventDefault()
    setScreenError(null)
    setScreeningResult(null)

    const job = jobs.find((j) => j.id === selectedJobId)
    if (!job) {
      setScreenError('Please select a job to apply for.')
      return
    }
    if (!resumeText.trim()) {
      setScreenError('Please paste your resume text.')
      return
    }

    setIsScreening(true)
    try {
      const jobDescription = `${job.title} at ${job.company}\n\n${job.description}\n\nRequirements: ${job.requirements.join(
        ', '
      )}`

      const res = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Failed to screen resume')
      }

      const data: { result: ScreeningResult & { applicationId: string } } = await res.json()
      const result = data.result
      setScreeningResult(result)

      const newApp: Application = {
        id: result.applicationId,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        candidateName: user?.name || 'Candidate',
        candidateEmail: user?.email || 'unknown',
        status: 'screened',
        appliedAt: new Date().toISOString().split('T')[0],
        result,
      }

      setApplications((prev) => [newApp, ...prev])
      setSelected(newApp)

      // Mirror into mock /api/applications for consistency (non-persistent)
      void fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      })
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : 'Something went wrong while screening')
    } finally {
      setIsScreening(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar role="candidate" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="page-label mb-2">My Applications</div>
            <h1 className="font-syne font-extrabold text-4xl tracking-tight">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-sm font-dm text-muted mt-1">
              {myApps.length} applications · {myApps.filter((a) => a.status === 'shortlisted').length} shortlisted
            </p>
          </div>
          <Link href="/jobs" className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
            Browse Jobs <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Applied', value: myApps.length, color: 'text-ink' },
            { label: 'In Review', value: myApps.filter((a) => a.status === 'screened').length, color: 'text-amber-600' },
            { label: 'Shortlisted', value: myApps.filter((a) => a.status === 'shortlisted').length, color: 'text-forest' },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className={`font-syne font-extrabold text-3xl ${s.color}`}>{s.value}</div>
              <div className="text-xs font-dm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Application List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h2 className="font-syne font-bold text-base">Your Applications</h2>
            {myApps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelected(app)}
                className={cn(
                  'text-left card p-4 transition-all hover:shadow-sm',
                  selected?.id === app.id ? 'ring-2 ring-ink' : ''
                )}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon status={app.status} />
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-bold text-sm truncate">{app.jobTitle}</p>
                    <p className="text-xs font-dm text-muted">{app.company}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn('text-[10px] border rounded px-2 py-0.5 font-syne font-bold capitalize', getStatusStyle(app.status))}>
                        {app.status}
                      </span>
                      <span className="text-[10px] font-dm text-muted">{formatDate(app.appliedAt)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {myApps.length === 0 && (
              <div className="card p-8 text-center">
                <p className="font-syne font-bold text-muted text-sm">No applications yet</p>
                <Link href="/jobs" className="mt-3 btn-primary text-xs px-4 py-2 inline-block">
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Feedback Detail + New Screening */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* New Screening Area */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-syne font-bold text-base">Run a new AI screening</h2>
                <Badge variant="green">Bias-aware</Badge>
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleScreenSubmit}>
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                    Choose a job
                  </label>
                  <select
                    className="input-field"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required
                    disabled={jobs.length === 0}
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} · {job.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                    Paste your resume
                  </label>
                  <textarea
                    className="input-field min-h-[140px]"
                    placeholder="Paste your resume text here. The model will compare it against the job description and highlight strengths, gaps, and possible bias."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                  />
                </div>

                {screenError && <p className="text-xs font-dm text-accent">{screenError}</p>}

                <button
                  type="submit"
                  className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={isScreening}
                >
                  {isScreening ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Screening your resume...
                    </>
                  ) : (
                    <>
                      Run screening <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {screeningResult && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-syne font-bold text-muted mb-2 uppercase tracking-wide">
                      Latest screening feedback
                    </p>
                    <FeedbackPanel result={screeningResult} />
                  </div>
                )}
              </form>
            </div>

            {/* Existing Feedback Detail */}
            <div className="card p-6">
            {selected ? (
              <div className="card p-6 sticky top-20">
                <div className="mb-5">
                  <div className="page-label mb-2">{selected.company}</div>
                  <h2 className="font-syne font-extrabold text-2xl">{selected.jobTitle}</h2>
                  <p className="text-sm font-dm text-muted mt-1">Applied {formatDate(selected.appliedAt)}</p>
                </div>

                {selected.result ? (
                  <FeedbackPanel result={selected.result} />
                ) : (
                  <div className="flex flex-col items-center py-10 text-center gap-3">
                    <Loader2 size={24} className="animate-spin text-muted" />
                    <p className="font-syne font-bold text-sm">Your application is being screened</p>
                    <p className="text-xs font-dm text-muted">You'll receive feedback within minutes.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <p className="font-syne font-bold text-muted text-sm">
                  Select an application from the left to see AI feedback.
                </p>
                <p className="text-xs font-dm text-muted mt-1">
                  Or run a new screening above using a different resume or job.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
