import Link from 'next/link'
import { ArrowRight, Shield, MessageSquare, BarChart3, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JobCard from '@/components/shared/JobCard'
import type { Job } from '@/types'

async function fetchJobs() {
  const base =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000'

  const res = await fetch(`${base}/api/jobs`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    return [] as Job[]
  }
  const data = await res.json()
  return data.jobs as Job[]
}

export default async function HomePage() {
  const jobs = await fetchJobs()
  return (
    <div className="min-h-screen">
      <Navbar role="public" />

      {/* HERO */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="page-label mb-4">AI-Powered · Bias-Aware · Transparent</div>
            <h1 className="font-syne font-extrabold text-5xl lg:text-6xl tracking-tight leading-[1.0] text-ink">
              Hiring that's<br />actually <span className="text-accent">fair</span>
            </h1>
            <p className="mt-5 text-base font-dm text-muted leading-relaxed max-w-md">
              FairHire screens resumes with an AI model trained to detect bias patterns — then gives every rejected candidate transparent, honest feedback on exactly why they weren't selected.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/auth/signup?role=recruiter" className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                Post a Job <ArrowRight size={15} />
              </Link>
              <Link href="/jobs" className="btn-ghost px-6 py-3 text-sm">
                Browse Roles
              </Link>
            </div>
            <div className="mt-10 flex gap-8 pt-6 border-t border-border">
              {[
                { num: '247', label: 'Resumes screened' },
                { num: '17', label: 'Bias flags logged' },
                { num: '100%', label: 'Feedback sent' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-syne font-extrabold text-2xl text-ink">{s.num}</div>
                  <div className="text-xs font-dm text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MOCK RESULT CARD */}
          <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="bg-white border border-border rounded-2xl p-5 shadow-[6px_6px_0px_#d8d2c4]">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-syne font-bold text-muted tracking-wide">Application Result — Software Engineer II</span>
              </div>

              {/* Candidate row */}
              <div className="bg-paper border border-border rounded-xl p-4 mb-3">
                <div className="font-syne font-bold text-sm">Jordan A. Mitchell</div>
                <div className="text-xs font-dm text-muted mt-0.5">4 yrs exp · Computer Science · University of Leeds</div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'].map((t) => (
                    <span key={t} className="text-[11px] bg-cream border border-border rounded px-2 py-0.5 font-dm text-muted">{t}</span>
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'Skills Match', val: '72%', color: 'text-amber-600' },
                  { label: 'Experience', val: '66%', color: 'text-amber-600' },
                  { label: 'Decision', val: 'Rejected', color: 'text-accent' },
                ].map((s) => (
                  <div key={s.label} className="bg-paper border border-border rounded-xl p-3">
                    <div className="text-[10px] font-dm text-muted">{s.label}</div>
                    <div className={`font-syne font-extrabold text-base mt-0.5 ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <div className="bg-[#fff9f0] border border-[#f0d9b5] rounded-xl p-4">
                <div className="text-[10px] font-syne font-bold tracking-[1.5px] uppercase text-accent mb-2">⚑ AI Feedback Sent to Applicant</div>
                <p className="text-xs font-dm text-ink leading-relaxed">
                  Your technical skills are a strong match. The primary gap was leadership experience — the role requires 2+ years managing teams, which wasn't evident from your CV.
                </p>
                <div className="flex gap-2 mt-2.5">
                  <span className="bias-chip bg-yellow-50 border-yellow-300 text-yellow-800">⚠ Age proxy detected</span>
                  <span className="bias-chip bg-orange-50 border-orange-300 text-orange-800">→ Logged for audit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-border bg-cream">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
          <div className="mb-12">
            <div className="page-label mb-3">How It Works</div>
            <h2 className="section-title text-4xl">Transparent from upload<br />to feedback</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-0 border border-border rounded-2xl overflow-hidden bg-white">
            {[
              { num: '01', title: 'Upload CV', desc: 'Candidate submits their resume through the application form.' },
              { num: '02', title: 'Parse & Store', desc: 'Backend extracts text, stores the file securely, creates application record.' },
              { num: '03', title: 'AI Screening', desc: 'Your model scores skills match, experience fit, and flags potential bias patterns.' },
              { num: '04', title: 'Store Result', desc: 'Scores, decision, feedback, and bias flags are persisted to the database.' },
              { num: '05', title: 'Feedback Sent', desc: 'Candidate receives full explanation — not just a rejection.' },
            ].map((step, i) => (
              <div key={step.num} className={`p-6 ${i < 4 ? 'border-r border-border' : ''}`}>
                <div className="font-syne font-extrabold text-3xl text-border mb-4">{step.num}</div>
                <h4 className="font-syne font-bold text-sm text-ink mb-2">{step.title}</h4>
                <p className="text-xs font-dm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
          <div className="mb-12">
            <div className="page-label mb-3">Features</div>
            <h2 className="section-title text-4xl">Built for fairness<br />at every step</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: 'Bias Detection',
                desc: 'The AI model scans for age proxies, name bias, gender indicators, and institutional bias. Every flag is logged and surfaced to recruiters.',
                accent: 'text-accent',
                bg: 'bg-red-50',
              },
              {
                icon: MessageSquare,
                title: 'Transparent Feedback',
                desc: 'Every rejected candidate gets a structured explanation: what matched, what didn\'t, and what they can do to improve.',
                accent: 'text-forest',
                bg: 'bg-emerald-50',
              },
              {
                icon: BarChart3,
                title: 'Bias Analytics',
                desc: 'Track bias detection trends over time, by job, recruiter, and type. Export audit-ready reports.',
                accent: 'text-blue-600',
                bg: 'bg-blue-50',
              },
            ].map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={18} className={f.accent} />
                </div>
                <h3 className="font-syne font-bold text-base text-ink mb-2">{f.title}</h3>
                <p className="text-sm font-dm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOBS PREVIEW */}
      <section className="border-t border-border bg-cream">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="page-label mb-3">Open Roles</div>
              <h2 className="section-title text-3xl">Apply with confidence</h2>
            </div>
            <Link href="/jobs" className="btn-ghost text-sm px-4 py-2 flex items-center gap-1.5">
              All jobs <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {jobs.length === 0 && (
              <p className="text-sm font-dm text-muted">
                No roles are live yet. Check back soon or ask a recruiter to post the first job.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FOR RECRUITERS VS CANDIDATES */}
      <section className="border-t border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
              <div className="page-label mb-4 ml-4">For Recruiters</div>
              <h3 className="section-title text-2xl ml-4 mb-3">Hire smarter,<br />not biased</h3>
              <p className="text-sm font-dm text-muted ml-4 leading-relaxed mb-6">
                Post jobs, review AI-ranked candidates, see bias flags before they become legal issues, and send feedback automatically.
              </p>
              <ul className="flex flex-col gap-2 ml-4 mb-8">
                {['Post & manage job listings', 'AI-ranked applicant dashboard', 'Bias flags with audit log', 'Bulk approve/reject with auto-feedback'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-dm text-ink">
                    <CheckCircle size={14} className="text-forest mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?role=recruiter" className="btn-primary ml-4 text-sm px-5 py-2.5 inline-flex items-center gap-2">
                Start as Recruiter <ArrowRight size={14} />
              </Link>
            </div>

            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-forest" />
              <div className="page-label mb-4 ml-4">For Candidates</div>
              <h3 className="section-title text-2xl ml-4 mb-3">Know exactly<br />where you stand</h3>
              <p className="text-sm font-dm text-muted ml-4 leading-relaxed mb-6">
                Apply to open roles and receive detailed, honest feedback on every application — even rejections come with actionable insight.
              </p>
              <ul className="flex flex-col gap-2 ml-4 mb-8">
                {['Apply with CV upload', 'Real-time status tracking', 'Detailed rejection feedback', 'Skill gap breakdown vs requirements'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-dm text-ink">
                    <CheckCircle size={14} className="text-forest mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?role=candidate" className="btn-primary ml-4 text-sm px-5 py-2.5 inline-flex items-center gap-2">
                Apply for Roles <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
