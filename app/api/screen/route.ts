import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'resumeText and jobDescription are required' }, { status: 400 })
    }

    const MODEL_URL = process.env.MODEL_API_URL || 'http://127.0.0.1:8000'

    const modelRes = await fetch(`${MODEL_URL}/screen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: resumeText, job_description: jobDescription }),
    })

    if (!modelRes.ok) {
      const text = await modelRes.text().catch(() => '')
      throw new Error(`Model server returned ${modelRes.status}${text ? `: ${text}` : ''}`)
    }

    const modelData = await modelRes.json()

    const result = {
      id: crypto.randomUUID(),
      applicationId: crypto.randomUUID(),
      score: Math.round((modelData.score ?? modelData.overall_score) * 100),
      skillsMatch: Math.round((modelData.skills_match ?? modelData.skillsMatch ?? modelData.skills_score) * 100),
      experienceMatch: Math.round(
        (modelData.experience_match ?? modelData.experienceMatch ?? modelData.experience_score) * 100
      ),
      decision: modelData.decision,
      feedback: modelData.feedback,
      biasFlags: modelData.bias_flags ?? modelData.biasFlags ?? [],
      skillGaps: modelData.skill_gaps ?? modelData.skillGaps ?? [],
      strengths: modelData.strengths ?? [],
      processedAt: new Date().toISOString(),
    }

    return NextResponse.json({ result })
  } catch (error: unknown) {
    console.error('[/api/screen] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
