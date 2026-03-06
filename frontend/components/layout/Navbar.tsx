'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useSession,signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const RECRUITER_NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Applicants', href: '/jobs/applicants' },
  { label: 'Analytics', href: '/analytics' },
]

const CANDIDATE_NAV = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: 'My Applications', href: '/portal' },
]

export default function Navbar({ role = 'public' }: { role?: 'recruiter' | 'candidate' | 'public' }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const navLinks = role === 'recruiter' ? RECRUITER_NAV : role === 'candidate' ? CANDIDATE_NAV : []

  const user = session?.user as (typeof session)['user'] & { role?: string; company?: string } | undefined
  const displayName =
    user?.name ?? (role === 'recruiter' ? 'Recruiter' : role === 'candidate' ? 'Candidate' : undefined)
  const initials = displayName
    ? displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : role === 'recruiter'
      ? 'R'
      : role === 'candidate'
        ? 'C'
        : 'F'

  return (
    <nav className="sticky top-0 z-50 bg-paper border-b border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Brand */}
        <Link href="/" className="font-syne font-extrabold text-xl tracking-tight">
          Fair<span className="text-accent">Hire</span>
        </Link>

        {/* Desktop Nav */}
        {navLinks.length > 0 && (
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium font-dm transition-colors',
                    pathname === item.href ? 'text-ink' : 'text-muted hover:text-ink'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Public Nav */}
        {role === 'public' && (
          <ul className="hidden md:flex items-center gap-6">
            <li><Link href="/jobs" className="text-sm font-dm text-muted hover:text-ink transition-colors">Browse Jobs</Link></li>
            <li><Link href="/#how-it-works" className="text-sm font-dm text-muted hover:text-ink transition-colors">How it works</Link></li>
          </ul>
        )}

        {/* CTA Area */}
        <div className="hidden md:flex items-center gap-2">
          {role === 'public' ? (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2">
                Log In
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">

  <button
    onClick={() => signOut({ callbackUrl: '/' })}
    className="btn-ghost text-sm px-3 py-1.5"
  >
    Log out
  </button>

  <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
      <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-syne font-bold text-xs">
        {initials}
      </div>
      {displayName && (
        <span className="text-sm font-dm text-muted group-hover:text-ink transition-colors">
          {displayName}
        </span>
      )}
      <ChevronDown size={14} className="text-muted" />
    </Link>

  </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-paper px-6 py-4 flex flex-col gap-3">
          {(navLinks.length > 0 ? navLinks : [{ label: 'Browse Jobs', href: '/jobs' }, { label: 'How it works', href: '/#how-it-works' }]).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-dm text-muted hover:text-ink py-1"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="text-sm font-dm text-muted hover:text-ink py-1"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <div className="flex gap-2 pt-2 border-t border-border">
            <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2 flex-1 text-center">Log In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2 flex-1 text-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
