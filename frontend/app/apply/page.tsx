'use client'
import { useEffect, useState } from 'react'
import { Upload, CheckCircle, ArrowLeft, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import type { Job } from '@/types'

export default function ApplyPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [step, setStep] = useState<'form' | 'uploading' | 'success'>('form')
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/jobs')
      if (!res.ok) return
      const data = await res.json()
      const jobs = data.jobs as Job[]
      if (jobs.length > 0) {
        setJob(jobs[0])
      }
    })()
  }, [])

  const handleSubmit = () => {
    if (!file) return
    setStep('uploading')
    setTimeout(() => setStep('success'), 2500)
  }

  return (
    <div className="min-h-screen">
      <Navbar role="public" />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/jobs" className="flex items-center gap-1.5 text-sm font-dm text-muted hover:text-ink mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to jobs
        </Link>

        {step === 'success' ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-forest" />
            </div>
            <h1 className="font-syne font-extrabold text-2xl text-ink mb-2">Application Submitted</h1>
            <p className="text-sm font-dm text-muted leading-relaxed max-w-sm mx-auto mb-6">
              Your CV is being screened by our AI model. You'll receive detailed feedback shortly — whether you're shortlisted or not.
            </p>
            <div className="bg-[#fff9f0] border border-[#f0d9b5] rounded-xl p-4 text-sm font-dm text-amber-800 mb-6">
              <strong className="font-syne">FairHire Promise:</strong> Every applicant receives transparent, honest feedback explaining the AI's decision.
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/portal" className="btn-primary text-sm px-5 py-2.5">View My Applications</Link>
              <Link href="/jobs" className="btn-ghost text-sm px-5 py-2.5">Browse More Jobs</Link>
            </div>
          </div>
        ) : step === 'uploading' ? (
          <div className="card p-10 text-center">
            <Loader2 size={32} className="animate-spin text-muted mx-auto mb-4" />
            <h2 className="font-syne font-bold text-lg mb-1">Submitting application...</h2>
            <p className="text-sm font-dm text-muted">Uploading your CV and queuing AI screening</p>
          </div>
        ) : !job ? (
          <div className="card p-10 text-center">
            <Loader2 size={32} className="animate-spin text-muted mx-auto mb-4" />
            <h2 className="font-syne font-bold text-lg mb-1">Loading job...</h2>
            <p className="text-sm font-dm text-muted">Please wait while we fetch the latest posting.</p>
          </div>
        ) : (
          <>
            {/* Job Info */}
            <div className="mb-6">
              <div className="page-label mb-2">Applying for</div>
              <h1 className="font-syne font-extrabold text-3xl tracking-tight">{job.title}</h1>
              <p className="text-sm font-dm text-muted mt-1">{job.company} · {job.location} · {job.salary}</p>
            </div>

            {/* Requirements */}
            <div className="card p-5 mb-6">
              <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">Role Requirements</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((r) => (
                  <span key={r} className="text-xs font-dm bg-cream border border-border rounded px-2.5 py-1 text-muted">{r}</span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="card p-6 flex flex-col gap-5">
              <p className="font-syne font-bold text-base">Your Details</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">First Name</label>
                  <input type="text" placeholder="Jordan" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Mitchell" className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Email Address</label>
                <input type="email" placeholder="you@email.com" className="input-field" />
              </div>

              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">LinkedIn URL (optional)</label>
                <input type="url" placeholder="https://linkedin.com/in/yourname" className="input-field" />
              </div>

              {/* CV Upload */}
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Upload CV / Resume *</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const f = e.dataTransfer.files[0]
                    if (f) setFile(f.name)
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-ink bg-cream' : file ? 'border-forest bg-emerald-50' : 'border-border hover:border-muted'
                  }`}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf,.doc,.docx'
                    input.onchange = (e) => {
                      const f = (e.target as HTMLInputElement).files?.[0]
                      if (f) setFile(f.name)
                    }
                    input.click()
                  }}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={24} className="text-forest" />
                      <p className="text-sm font-dm font-medium text-forest">{file}</p>
                      <p className="text-xs font-dm text-muted">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-muted" />
                      <p className="text-sm font-dm text-muted">Drag & drop or click to upload</p>
                      <p className="text-xs font-dm text-muted">PDF, DOC, DOCX · Max 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover note */}
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Cover Note (optional)</label>
                <textarea
                  rows={3}
                  placeholder="A short note to the recruiter..."
                  className="input-field resize-none"
                />
              </div>

              {/* Fairness notice */}
              <div className="bg-[#fff9f0] border border-[#f0d9b5] rounded-xl p-4">
                <p className="text-xs font-syne font-bold text-accent mb-1">⚑ Bias-Aware Screening</p>
                <p className="text-xs font-dm text-amber-800 leading-relaxed">
                  Your application will be screened by our AI model for skills and experience fit. The model actively detects and flags bias patterns. You will receive detailed feedback regardless of the outcome.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!file}
                className="btn-primary py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Submit Application
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
