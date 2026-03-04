'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PlusCircle } from 'lucide-react'

export default function NewJobPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const recruiterCompany = (session?.user as any)?.company as string | undefined
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState<'full-time' | 'part-time' | 'contract' | 'remote'>('full-time')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          type,
          salary,
          description,
          requirements: requirements
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Unable to create job')
      }

      router.push('/jobs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar role="recruiter" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        <div className="max-w-2xl">
          <div className="mb-6">
            <div className="page-label mb-2">New Job</div>
            <h1 className="font-syne font-extrabold text-3xl tracking-tight">Post a new role</h1>
            <p className="text-sm font-dm text-muted mt-1">
              Fill in the details below. Candidates will see this in the jobs list and can apply with AI feedback.
            </p>
          </div>

          <form className="card p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Job title
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Company
                </label>
                <div className="input-field bg-muted/10 flex items-center text-sm">
                  {recruiterCompany || 'Your company (from profile)'}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Type
                </label>
                <select
                  className="input-field"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Salary (optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="£80,000–£100,000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                Description
              </label>
              <textarea
                className="input-field min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                Requirements (comma separated)
              </label>
              <textarea
                className="input-field min-h-[80px]"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="5+ years React/Node.js, System design experience, TypeScript proficiency"
              />
            </div>

            {error && <p className="text-xs font-dm text-accent">{error}</p>}

            <button
              type="submit"
              className="btn-primary mt-2 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post job'} <PlusCircle size={14} />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

