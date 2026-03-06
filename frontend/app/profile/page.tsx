import Navbar from '@/components/layout/Navbar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Mail, Building2, User2, ShieldCheck } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as {
    name?: string
    email?: string
    company?: string
    role?: string
  } | undefined

  const name = user?.name ?? 'User'
  const email = user?.email ?? 'Not available'
  const company = user?.company ?? 'Not specified'
  const role = user?.role ?? 'User'

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div className="min-h-screen">
      <Navbar role={role === 'recruiter' ? 'recruiter' : role === 'candidate' ? 'candidate' : 'public'} />

      <main className="max-w-screen-lg mx-auto px-6 lg:px-10 py-12">
        <div className="card p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-ink text-white flex items-center justify-center font-syne font-extrabold text-2xl">
              {initials}
            </div>

            <div>
              <h1 className="font-syne font-extrabold text-3xl tracking-tight">{name}</h1>
              <p className="text-sm font-dm text-muted mt-1">{role === 'recruiter' ? 'Recruiter Account' : 'Candidate Account'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <User2 size={16} className="text-muted" />
                <p className="text-xs font-syne font-bold tracking-wide text-muted uppercase">Name</p>
              </div>
              <p className="font-dm text-sm text-ink">{name}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-muted" />
                <p className="text-xs font-syne font-bold tracking-wide text-muted uppercase">Email</p>
              </div>
              <p className="font-dm text-sm text-ink">{email}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-muted" />
                <p className="text-xs font-syne font-bold tracking-wide text-muted uppercase">Company</p>
              </div>
              <p className="font-dm text-sm text-ink">{company}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-muted" />
                <p className="text-xs font-syne font-bold tracking-wide text-muted uppercase">Role</p>
              </div>
              <p className="font-dm text-sm text-ink capitalize">{role}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs font-syne font-bold tracking-wide text-muted uppercase mb-3">
              Account Status
            </p>

            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-syne font-bold px-3 py-1 rounded">
                Active
              </span>
              <span className="text-xs font-dm text-muted">
                Your account is verified and ready to use.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}