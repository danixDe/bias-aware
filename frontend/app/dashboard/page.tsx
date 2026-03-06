import Link from 'next/link'
import { PlusCircle, Users, Briefcase, AlertTriangle, TrendingUp, ChevronRight, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Badge from '@/components/ui/Badge'
import { formatDate, getScoreColor, getStatusStyle, cn } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Job, Application, AnalyticsSummary } from '@/types'
import JobCard from '@/components/shared/JobCard'

async function fetchBase() {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000'
  )
}

async function fetchJobs(): Promise<Job[]> {
  const base = await fetchBase()
  const res = await fetch(`${base}/api/jobs`, { next: { revalidate: 0 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.jobs as Job[]
}

async function fetchApplications(): Promise<Application[]> {
  const base = await fetchBase()
  const res = await fetch(`${base}/api/applications`, { next: { revalidate: 0 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.applications as Application[]
}

function computeAnalytics(apps: Application[]): AnalyticsSummary {
  const totalApplications = apps.length
  const screened = apps.filter((a) => a.status === 'screened').length
  const shortlisted = apps.filter((a) => a.status === 'shortlisted').length
  const rejected = apps.filter((a) => a.status === 'rejected').length
  const scores = apps.map((a) => a.result?.score).filter((s): s is number => typeof s === 'number')
  const avgScore = scores.length ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0
  const biasDetected = apps.reduce(
    (count, a) => count + (a.result?.biasFlags ? a.result.biasFlags.length : 0),
    0
  )

  return {
    totalApplications,
    screened,
    shortlisted,
    rejected,
    biasDetected,
    avgScore,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { name?: string; company?: string } | undefined
  const displayName = user?.name ?? 'Recruiter'
  const company = user?.company ?? 'Your company'

  const [jobs, applications] = await Promise.all([fetchJobs(), fetchApplications()])
  const stats = computeAnalytics(applications)
  const recentApps = applications.slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar role="recruiter" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="page-label mb-2">Recruiter Dashboard</div>
            <h1 className="font-syne font-extrabold text-4xl tracking-tight">Good morning, {displayName}</h1>
            <p className="text-sm font-dm text-muted mt-1">Here's what's happening at {company} today.</p>
          </div>
          <Link href="/jobs/new" className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
            <PlusCircle size={15} /> Post New Job
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Applications',
              value: stats.totalApplications,
              icon: Users,
              delta: 'Across all jobs',
              color: 'text-ink',
            },
            {
              label: 'Shortlisted',
              value: stats.shortlisted,
              icon: TrendingUp,
              delta:
                stats.totalApplications > 0
                  ? `${Math.round((stats.shortlisted / stats.totalApplications) * 100)}% rate`
                  : 'No data yet',
              color: 'text-forest',
            },
            {
              label: 'Rejected',
              value: stats.rejected,
              icon: Briefcase,
              delta: 'With feedback sent',
              color: 'text-muted',
            },
            {
              label: 'Bias Flags',
              value: stats.biasDetected,
              icon: AlertTriangle,
              delta: 'Logged across screenings',
              color: 'text-amber-600',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-dm text-muted">{kpi.label}</p>
                  <p className={`font-syne font-extrabold text-3xl mt-1 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs font-dm text-muted mt-1">{kpi.delta}</p>
                </div>
                <kpi.icon size={18} className="text-border mt-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-lg">Active Job Postings</h2>
              <Link href="/jobs" className="text-xs font-dm text-muted hover:text-ink flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} recruiterView />
              ))}
              {jobs.length === 0 && (
                <p className="text-xs font-dm text-muted">
                  You haven&apos;t posted any jobs yet. Use &quot;Post New Job&quot; above to publish your first role.
                </p>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-lg">Recent Applications</h2>
              <Link href="/jobs/applicants" className="text-xs font-dm text-muted hover:text-ink flex items-center gap-1">
                All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentApps.map((app) => (
                <div key={app.id} className="card p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-syne font-bold text-sm truncate">{app.candidateName}</p>
                      <p className="text-xs font-dm text-muted truncate">{app.jobTitle}</p>
                    </div>
                    {app.result && (
                      <span className={`font-syne font-bold text-sm flex-shrink-0 ${getScoreColor(app.result.score)}`}>
                        {app.result.score}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn('text-[10px] border rounded px-2 py-0.5 font-syne font-bold tracking-wide', getStatusStyle(app.status))}>
                      {app.status}
                    </span>
                    {app.result?.biasFlags && app.result.biasFlags.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-dm text-amber-600">
                        <AlertTriangle size={10} />{app.result.biasFlags.length} flag
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bias summary box */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <p className="text-xs font-syne font-bold text-amber-800">Bias Activity This Month</p>
              </div>
              <p className="text-xs font-dm text-amber-700 leading-relaxed">
                {stats.biasDetected} bias flags detected across {stats.screened} screened applications.
                All flags have been logged for audit review.
              </p>
              <Link href="/analytics" className="mt-2 text-xs font-dm text-amber-700 underline hover:text-amber-900 inline-block">
                View full report →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
