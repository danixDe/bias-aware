import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'

export async function GET() {
  await connectDB()
  const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({
    jobs: jobs.map((job) => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      postedAt: job.postedAt,
      status: job.status,
      applicants: job.applicants,
      recruiterName: job.recruiterName,
    })),
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { name?: string; role?: string; email?: string; id?: string } | undefined

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ message: 'Only recruiters can post jobs' }, { status: 403 })
  }

  const body = await request.json()
  const { title, company, location, type, description, requirements, salary } = body

  const effectiveCompany = (company && String(company).trim()) || (user as any).company

  if (!title || !effectiveCompany || !location || !type || !description) {
    return NextResponse.json({ message: 'Missing required job fields' }, { status: 400 })
  }

  await connectDB()

  const now = new Date().toISOString().split('T')[0]

  const job = await Job.create({
    title,
    company: effectiveCompany,
    location,
    type,
    description,
    requirements: Array.isArray(requirements) ? requirements : [],
    salary: salary || undefined,
    postedAt: now,
    status: 'open',
    applicants: 0,
    recruiterName: user.name || 'Recruiter',
    recruiterId: (user as any).id,
  })

  return NextResponse.json(
    {
      job: {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: job.requirements,
        salary: job.salary,
        postedAt: job.postedAt,
        status: job.status,
        applicants: job.applicants,
        recruiterName: job.recruiterName,
      },
    },
    { status: 201 }
  )
}
