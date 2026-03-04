'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import type { UserRole } from '@/types'

const roles: { value: UserRole; label: string; desc: string; accent: string }[] = [
  { value: 'recruiter', label: 'Recruiter', desc: 'Post jobs & review applicants', accent: 'border-accent' },
  { value: 'candidate', label: 'Candidate', desc: 'Apply & track applications', accent: 'border-forest' },
]

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState<UserRole>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const qpRole = searchParams.get('role')
    if (qpRole === 'recruiter' || qpRole === 'candidate') {
      setRole(qpRole)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload: any = { name, email, password, role }
      if (role === 'recruiter') {
        payload.company = company
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Unable to sign up')
      }

      router.push(`/auth/login?role=${role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="font-syne font-extrabold text-2xl tracking-tight">
            Fair<span className="text-accent">Hire</span>
          </Link>
          <p className="text-sm font-dm text-muted mt-2">Create your account</p>
        </div>

        <div className="card p-6 mb-4">
          <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">Sign up as</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`text-left p-4 border-2 rounded-xl hover:bg-cream transition-colors ${
                  role === r.value ? `${r.accent} bg-cream` : 'border-transparent'
                }`}
              >
                <p className="font-syne font-bold text-sm">{r.label}</p>
                <p className="text-xs font-dm text-muted mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="input-field"
                required
              />
            </div>
            {role === 'recruiter' && (
              <div>
                <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company"
                  className="input-field"
                  required
                />
              </div>
            )}

            {error && <p className="text-xs font-dm text-red-500">{error}</p>}

            <button
              type="submit"
              className="btn-primary py-3 text-sm text-center flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-dm text-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-ink font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}