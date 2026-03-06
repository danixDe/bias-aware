import { AlertTriangle, TrendingUp, FileDown, Info } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { BIAS_TREND_DATA, BIAS_TYPES_DATA } from '@/lib/mock-data'
import Badge from '@/components/ui/Badge'
import type { Application, AnalyticsSummary } from '@/types'

async function fetchApplications(): Promise<Application[]> {
  const base =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000'

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

export default async function AnalyticsPage() {
  const applications = await fetchApplications()
  const stats = computeAnalytics(applications)
  const biasRate =
    stats.screened > 0 ? ((stats.biasDetected / stats.screened) * 100).toFixed(1) : '0.0'

  return (
    <div className="min-h-screen">
      <Navbar role="recruiter" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="page-label mb-2">Bias Analytics</div>
            <h1 className="font-syne font-extrabold text-4xl tracking-tight">Screening transparency</h1>
            <p className="text-sm font-dm text-muted mt-1">
              Audit trail and bias metrics for TechFlow Ltd · Last updated today
            </p>
          </div>
          <button className="btn-ghost text-sm px-4 py-2.5 flex items-center gap-2">
            <FileDown size={15} /> Export Report
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Screened', value: stats.screened, note: 'all time', color: 'text-ink' },
            {
              label: 'Shortlisted',
              value: stats.shortlisted,
              note:
                stats.screened > 0
                  ? `${Math.round((stats.shortlisted / stats.screened) * 100)}% rate`
                  : 'No data yet',
              color: 'text-forest',
            },
            { label: 'Avg Score', value: `${stats.avgScore}%`, note: 'overall', color: 'text-amber-600' },
            {
              label: 'Bias Flags',
              value: stats.biasDetected,
              note: stats.screened > 0 ? `${biasRate}% of screened` : 'No screenings yet',
              color: 'text-accent',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-5">
              <p className="text-xs font-dm text-muted">{kpi.label}</p>
              <p className={`font-syne font-extrabold text-3xl mt-1 ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs font-dm text-muted mt-1">{kpi.note}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bias Trend Chart (visual bars) */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-syne font-bold text-base">Bias Flags Over Time</p>
                <p className="text-xs font-dm text-muted mt-0.5">Monthly detection counts vs total screened</p>
              </div>
              <Badge variant="amber">Last 6 months</Badge>
            </div>

            {/* Simple bar chart */}
            <div className="flex items-end justify-between gap-3 h-40 mb-3">
              {BIAS_TREND_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-amber-200 rounded-t-sm"
                      style={{ height: `${(d.flagged / 17) * 100}px` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {BIAS_TREND_DATA.map((d) => (
                <div key={d.month} className="flex-1 text-center">
                  <p className="text-[10px] font-syne font-bold text-muted">{d.month}</p>
                  <p className="text-xs font-syne font-bold text-accent">{d.flagged}</p>
                  <p className="text-[9px] font-dm text-muted">{d.total}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-200" />
                <span className="text-xs font-dm text-muted">Bias flags</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-dm text-muted">(number) = total screened</span>
              </div>
            </div>
          </div>

          {/* Bias Types Breakdown */}
          <div className="card p-6">
            <p className="font-syne font-bold text-base mb-1">Bias Type Breakdown</p>
            <p className="text-xs font-dm text-muted mb-5">All flagged instances this month</p>

            <div className="flex flex-col gap-4">
              {BIAS_TYPES_DATA.map((b) => {
                const pct = (b.count / stats.biasDetected) * 100
                return (
                  <div key={b.type}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-dm font-medium text-ink">{b.type}</span>
                      <span className="text-xs font-syne font-bold text-muted">{b.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-cream rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: b.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-start gap-2">
                <Info size={13} className="text-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs font-dm text-muted leading-relaxed">
                  All bias flags are logged for audit. They are surfaced to recruiters but do not affect candidate feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bias Audit Log */}
        <div className="mt-6 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-syne font-bold text-base">Bias Audit Log</p>
              <p className="text-xs font-dm text-muted mt-0.5">Every flag, logged with context</p>
            </div>
            <Badge variant="amber">
              <AlertTriangle size={10} className="mr-1" />
              {stats.biasDetected} flags
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 pr-4">Candidate</th>
                  <th className="text-left pb-3 pr-4">Job</th>
                  <th className="text-left pb-3 pr-4">Bias Type</th>
                  <th className="text-left pb-3 pr-4">Severity</th>
                  <th className="text-left pb-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Jordan Mitchell', job: 'Senior SWE', type: 'Age Proxy', sev: 'medium', desc: 'Graduation year used as indirect age indicator' },
                  { name: 'Marcus Webb', job: 'Senior SWE', type: 'Name Bias', sev: 'low', desc: 'Name-based demographic inference detected' },
                  { name: 'Alex Thompson', job: 'Product Manager', type: 'Gender Proxy', sev: 'medium', desc: 'Interest keywords used as gender proxy' },
                  { name: 'Sam Okonkwo', job: 'UX Designer', type: 'University Bias', sev: 'low', desc: 'Institution name weighted in initial pass' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-cream transition-colors">
                    <td className="py-3 pr-4 text-sm font-dm font-medium text-ink">{row.name}</td>
                    <td className="py-3 pr-4 text-sm font-dm text-muted">{row.job}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="amber">{row.type}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={row.sev === 'high' ? 'red' : row.sev === 'medium' ? 'amber' : 'default'}>
                        {row.sev}
                      </Badge>
                    </td>
                    <td className="py-3 text-xs font-dm text-muted">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
