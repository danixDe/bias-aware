import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      return NextResponse.json(
        { error: 'multipart/form-data with resume, email, and job_requirements is required' },
        { status: 400 }
      )
    }

    const form = await request.formData()
    const resume = form.get('resume')
    const email = form.get('email')
    const jobRequirements = form.get('job_requirements')

    if (!(resume instanceof File) || typeof email !== 'string' || typeof jobRequirements !== 'string') {
      return NextResponse.json(
        { error: 'resume (file), email (string), and job_requirements (string) are required' },
        { status: 400 }
      )
    }
    //added file size check
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Resume must be under 5MB' },
        { status: 400 }
      )
    }
    //addded file type check
    const allowedTypes = [
      "application/pdf"
    ]

    if (!allowedTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: "Only PDF resumes are allowed" },
        { status: 400 }
      )
    }

    const MODEL_URL = process.env.MODEL_API_URL || 'http://127.0.0.1:8000'

    const forwardForm = new FormData()
    forwardForm.append('resume', resume)
    forwardForm.append('email', email)
    forwardForm.append('job_requirements', jobRequirements)

    const modelRes = await fetch(`${MODEL_URL}/screen`, {
      method: 'POST',
      body: forwardForm,
    })

    if (!modelRes.ok) {
      const text = await modelRes.text().catch(() => '')
      throw new Error(`Model server returned ${modelRes.status}${text ? `: ${text}` : ''}`)
    }

    const modelData: {
      status: string
      candidate_skills: string[]
      matched_skills: string[]
      missing_skills: string[]
      match_score: number
      decision: string
    } = await modelRes.json()

    const feedbackParts: string[] = []
    feedbackParts.push(
      `Your resume matched ${modelData.match_score}% of the required skills for this role, leading to a decision of "${modelData.decision}".`
    )
    if (modelData.matched_skills?.length) {
      feedbackParts.push(`Matched skills: ${modelData.matched_skills.join(', ')}.`)
    }
    if (modelData.missing_skills?.length) {
      feedbackParts.push(
        `Missing or weaker skills for this role: ${modelData.missing_skills.join(', ')}. Strengthening these will increase your chances next time.`
      )
    }

    const result = {
      id: crypto.randomUUID(),
      applicationId: crypto.randomUUID(),
      score: modelData.match_score,
      skillsMatch: modelData.match_score,
      experienceMatch: modelData.match_score,
      decision: modelData.decision === 'shortlisted' ? 'shortlisted' : 'rejected',
      feedback: feedbackParts.join(' '),
      biasFlags: [] as any[],
      skillGaps: modelData.missing_skills ?? [],
      strengths: modelData.matched_skills ?? [],
      processedAt: new Date().toISOString(),
    }
    console.log(result);
    return NextResponse.json({ result })
  } catch (error: unknown) {
    console.error('[/api/screen] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
