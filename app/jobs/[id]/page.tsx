import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FeedbackPanel from '@/components/ui/FeedbackPanel'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { connectDB } from '@/lib/mongodb'
import JobModel from '@/models/Job'
import ApplyForm from '@/components/jobs/ApplyForm'
import type { Job } from '@/types'

export default async function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const session = await getServerSession(authOptions)
  const user = (session as any)?.user as { role?: string } | undefined
  const role: 'recruiter' | 'candidate' | 'public' =
    user?.role === 'recruiter' ? 'recruiter' : user?.role === 'candidate' ? 'candidate' : 'public'

  await connectDB()
  const jobDoc = await JobModel.findById(id).lean().catch(() => null)

  if (!jobDoc) {
    return notFound()
  }

  const job: Job = {
    id: jobDoc._id.toString(),
    title: jobDoc.title as string,
    company: jobDoc.company as string,
    location: jobDoc.location as string,
    type: jobDoc.type as Job['type'],
    description: jobDoc.description as string,
    requirements: jobDoc.requirements as string[],
    salary: jobDoc.salary as string | undefined,
    postedAt: jobDoc.postedAt as string,
    status: jobDoc.status as Job['status'],
    applicants: jobDoc.applicants as number,
    recruiterName: jobDoc.recruiterName as string,
  }

  return (
    <div className="min-h-screen">
      <Navbar role={role} />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="page-label mb-2">Job Details</div>
            <h1 className="font-syne font-extrabold text-3xl tracking-tight mb-2">{job.title}</h1>
            <p className="text-sm font-dm text-muted mb-4">
              {job.company} · {job.location}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant={job.type === 'remote' ? 'blue' : 'green'}>{job.type}</Badge>
              <Badge variant="green">Open</Badge>
              {job.salary && <Badge variant="default">{job.salary}</Badge>}
            </div>

            <section className="mb-6">
              <h2 className="font-syne font-bold text-lg mb-2">About the role</h2>
              <p className="text-sm font-dm text-muted leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-lg mb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((r) => (
                  <li key={r} className="text-sm font-dm text-muted">
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            <p className="text-xs font-dm text-muted mt-6">
              Posted {formatDate(job.postedAt)} · Posted by {job.recruiterName}
            </p>
          </div>

          <div className="lg:col-span-1">
            <ApplyForm job={job} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

