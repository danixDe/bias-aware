export type UserRole = 'recruiter' | 'candidate' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
  avatar?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  description: string
  requirements: string[]
  salary?: string
  postedAt: string
  status: 'open' | 'closed' | 'draft'
  applicants: number
  recruiterName: string
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  candidateName: string
  candidateEmail: string
  cvUrl?: string
  status: 'pending' | 'processing' | 'screened' | 'shortlisted' | 'rejected'
  appliedAt: string
  result?: ScreeningResult
}

export interface ScreeningResult {
  id: string
  applicationId: string
  score: number
  skillsMatch: number
  experienceMatch: number
  decision: 'shortlisted' | 'rejected' | 'review'
  feedback: string
  biasFlags: BiasFlag[]
  skillGaps: string[]
  strengths: string[]
  processedAt: string
}

export interface BiasFlag {
  type: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface AnalyticsSummary {
  totalApplications: number
  screened: number
  shortlisted: number
  rejected: number
  biasDetected: number
  avgScore: number
}
