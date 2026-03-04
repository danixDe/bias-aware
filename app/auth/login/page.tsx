'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { signIn, getSession } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preferredRole = searchParams.get('role')
  type Role = 'recruiter' | 'candidate'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    preferredRole === 'recruiter' || preferredRole === 'candidate' ? (preferredRole as Role) : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (!result || result.error) {
        throw new Error(result?.error || 'Unable to sign in')
      }

      const session = await getSession()
      const sessionRole = (session?.user as any)?.role as Role | undefined
      const role: Role = selectedRole ?? sessionRole ?? 'recruiter'

      if (role === 'candidate') {
        router.push('/portal')
      } else {
        router.push('/dashboard')
      }
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
          <p className="text-sm font-dm text-muted mt-2">Sign in to your account</p>
        </div>

        <div className="card p-6 mb-4">
          <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">
            Sign in as
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { value: 'recruiter' as Role, label: 'Recruiter', desc: 'Manage jobs & review applicants', accent: 'border-accent' },
              { value: 'candidate' as Role, label: 'Candidate', desc: 'Apply & track applications', accent: 'border-forest' },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRole(r.value)}
                className={`text-left p-4 border-2 rounded-xl hover:bg-cream transition-colors ${
                  selectedRole === r.value ? `${r.accent} bg-cream` : 'border-transparent'
                }`}
              >
                <p className="font-syne font-bold text-sm">{r.label}</p>
                <p className="text-xs font-dm text-muted mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">
            Enter your email and password
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            {error && <p className="text-xs font-dm text-red-500">{error}</p>}

            <button
              type="submit"
              className="btn-primary py-3 text-sm text-center flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-dm text-muted">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-ink font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
