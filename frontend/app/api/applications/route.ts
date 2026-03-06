import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { email?: string; role?: string } | undefined

  await connectDB()

  const query: any = {}
  if (user?.role === 'candidate' && user.email) {
    query.candidateEmail = user.email
  }

  const apps = await Application.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json({
    applications: apps.map((app) => ({
      id: app._id.toString(),
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      company: app.company,
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      cvUrl: app.cvUrl,
      status: app.status,
      appliedAt: app.createdAt.toISOString().split('T')[0],
      result: app.result ?? undefined,
    })),
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { email?: string; role?: string; id?: string } | undefined

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { jobId, jobTitle, company, candidateName, candidateEmail, cvUrl, status, result } = body

  if (!jobId || !jobTitle || !company) {
    return NextResponse.json({ message: 'Missing required application fields' }, { status: 400 })
  }

  await connectDB()

  const app = await Application.create({
    candidateId: (user as any).id,
    jobId,
    jobTitle,
    company,
    candidateName: candidateName || user.email,
    candidateEmail: candidateEmail || user.email,
    cvUrl: cvUrl || undefined,
    status: status || 'screened',
    result: result || undefined,
  })

  return NextResponse.json(
    {
      application: {
        id: app._id.toString(),
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        cvUrl: app.cvUrl,
        status: app.status,
        appliedAt: app.createdAt.toISOString().split('T')[0],
        result: app.result ?? undefined,
      },
    },
    { status: 201 }
  )
}
