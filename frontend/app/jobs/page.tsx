import Link from 'next/link'
import { Search, Filter, PlusCircle } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JobCard from '@/components/shared/JobCard'
import { authOptions } from '@/lib/auth'

async function fetchJobs() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const res = await fetch(`${base}/api/jobs`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    return []
  }
  const data = await res.json()
  return data.jobs as import('@/types').Job[]
}

export default async function JobsPage() {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { role?: string } | undefined
  const role: 'recruiter' | 'candidate' | 'public' =
    user?.role === 'recruiter' ? 'recruiter' : user?.role === 'candidate' ? 'candidate' : 'public'

  const jobs = await fetchJobs()

  return (
    <div className="min-h-screen">
      <Navbar role={role} />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="page-label mb-2">Open Positions</div>
            <h1 className="font-syne font-extrabold text-4xl tracking-tight">Find your next role</h1>
            <p className="text-sm font-dm text-muted mt-1">
              {jobs.length} open positions · All applications receive detailed AI feedback
            </p>
          </div>
          {role === 'recruiter' && (
  <Link
      href="/jobs/new"
      className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2 hidden md:flex"
    >
      <PlusCircle size={15} /> Post a Job
    </Link>
  )}

  {role === 'public' && (
    <Link
      href="/auth/signup?role=recruiter"
      className="btn-ghost text-sm px-4 py-2.5 flex items-center gap-2 hidden md:flex"
    >
      <PlusCircle size={15} /> Become a Recruiter
    </Link>
  )}
        </div>

        {/* Search & Filter bar */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="input-field pl-9"
            />
          </div>
          <button className="btn-ghost text-sm px-4 py-2.5 flex items-center gap-2 flex-shrink-0">
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Full-time', 'Remote', 'Contract', 'Part-time'].map((type, i) => (
            <button
              key={type}
              className={`text-xs font-dm px-3 py-1.5 rounded-full border transition-colors ${
                i === 0
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white border-border text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {jobs.length === 0 && (
            <p className="text-sm font-dm text-muted">
              No jobs posted yet. Recruiters can post a new role from the dashboard.
            </p>
          )}
        </div>

        {/* Fairness Promise */}
        <div className="mt-12 bg-[#fff9f0] border border-[#f0d9b5] rounded-2xl p-8 text-center">
          <p className="text-xs font-syne font-bold tracking-[2px] uppercase text-accent mb-3">FairHire Promise</p>
          <p className="font-syne font-bold text-xl text-ink mb-2">Every applicant gets feedback</p>
          <p className="text-sm font-dm text-muted max-w-md mx-auto leading-relaxed">
            Whether you're shortlisted or not, our AI model sends you a detailed breakdown of your application — skills matched, gaps identified, and any bias flags that were detected.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
