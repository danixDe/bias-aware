import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'text-forest'
  if (score >= 60) return 'text-amber-600'
  return 'text-accent'
}

export function getScoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200'
  if (score >= 60) return 'bg-amber-50 border-amber-200'
  return 'bg-red-50 border-red-200'
}

export function getBiasSeverityStyle(severity: 'low' | 'medium' | 'high') {
  switch (severity) {
    case 'high': return 'bg-red-50 border-red-300 text-red-800'
    case 'medium': return 'bg-amber-50 border-amber-300 text-amber-800'
    case 'low': return 'bg-yellow-50 border-yellow-300 text-yellow-800'
  }
}

export function getStatusStyle(status: string) {
  switch (status) {
    case 'shortlisted': return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    case 'rejected': return 'bg-red-50 border-red-200 text-red-700'
    case 'processing': return 'bg-blue-50 border-blue-200 text-blue-700'
    case 'pending': return 'bg-gray-50 border-gray-200 text-gray-600'
    case 'screened': return 'bg-amber-50 border-amber-200 text-amber-700'
    default: return 'bg-gray-50 border-gray-200 text-gray-600'
  }
}
