import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-paper mt-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-syne font-extrabold text-lg tracking-tight">
          Fair<span className="text-accent">Hire</span>
        </Link>
        <p className="text-xs font-dm text-muted text-center">
          Final Year Project — Bias-Aware Resume Screening System
        </p>
        <div className="flex items-center gap-4">
          <Link href="/analytics" className="text-xs font-dm text-muted hover:text-ink transition-colors">Bias Reports</Link>
          <Link href="/api-integration" className="text-xs font-dm text-muted hover:text-ink transition-colors">API Integration</Link>
          <Link href="/auth/login" className="text-xs font-dm text-muted hover:text-ink transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  )
}
