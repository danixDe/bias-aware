'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowRight, Loader2, Paperclip } from 'lucide-react'
import FeedbackPanel from '@/components/ui/FeedbackPanel'
import type { Job, ScreeningResult } from '@/types'

export default function ApplyForm({ job }: { job: Job }) {
  const { data: session } = useSession()
  const user = session?.user as (typeof session)['user'] | undefined

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResumeFile(file)

    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setScreeningResult(null)

    if (!resumeFile) {
      setError('Please attach a PDF resume.')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('email', user?.email || 'unknown@example.com')
      formData.append('job_requirements', job.requirements.join(', '))

      const screenRes = await fetch('/api/screen', {
        method: 'POST',
        body: formData,
      })

      if (!screenRes.ok) {
        const data = await screenRes.json().catch(() => null)
        throw new Error(data?.error || 'Failed to screen resume')
      }

      const data: { result: ScreeningResult & { applicationId: string } } = await screenRes.json()
      const result = data.result
      setScreeningResult(result)

      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          candidateName: user?.name,
          candidateEmail: user?.email,
          status: 'screened',
          result,
        }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while applying')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card p-5">
      <h2 className="font-syne font-bold text-lg mb-2">Apply to this role</h2>
      <p className="text-xs font-dm text-muted mb-4">
        Upload your resume and our bias-aware model will screen it against this job and give you transparent feedback.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
            Attach resume
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-dm px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-cream">
            <Paperclip size={14} />
            <span>{fileName ?? 'Choose a file (PDF, DOCX, or TXT)'}</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div>
          <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
            Or paste resume text
          </label>
          <textarea
            className="input-field min-h-[140px]"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {error && <p className="text-xs font-dm text-accent">{error}</p>}

        <button
          type="submit"
          className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Apply & get feedback <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {screeningResult && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-syne font-bold text-muted mb-2 uppercase tracking-wide">Your AI feedback</p>
          <FeedbackPanel result={screeningResult} />
        </div>
      )}
    </div>
  )
}

