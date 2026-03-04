'use client'
import { useState } from 'react'
import { Play, CheckCircle, AlertCircle, Loader2, Code, Settings, Zap, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import FeedbackPanel from '@/components/ui/FeedbackPanel'
import { ScreeningResult } from '@/types'

const TABS = ['Test Model', 'Integration Guide', 'API Reference', 'Configuration']

const SAMPLE_RESUME = `John Smith
john.smith@email.com | +44 7700 123456

EXPERIENCE
Senior Frontend Developer — Acme Corp (2020–Present)
• Led development of React-based dashboard used by 50,000+ users
• Mentored team of 3 junior developers
• TypeScript, React, Node.js, PostgreSQL

Junior Developer — StartupXYZ (2018–2020)
• Built REST APIs with Node.js and Express
• Contributed to CI/CD pipeline setup

EDUCATION
BSc Computer Science — University of Manchester (2015–2018)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, Docker, PostgreSQL, Git`

const SAMPLE_JOB = `Senior Software Engineer

Requirements:
- 5+ years experience with React/Node.js
- Team leadership experience (2+ years managing developers)
- TypeScript proficiency
- Experience with distributed systems
- Strong communication skills

Salary: £80,000–£100,000
Location: London, UK (Hybrid)`

type ModelStatus = 'idle' | 'loading' | 'success' | 'error'

const MOCK_RESULT: ScreeningResult = {
  id: 'test-result-1',
  applicationId: 'test-app',
  score: 74,
  skillsMatch: 82,
  experienceMatch: 66,
  decision: 'rejected',
  feedback: 'John demonstrates strong technical proficiency in React and TypeScript — core requirements for this role. The primary gap is leadership experience. While he has mentored junior developers, the role requires 2+ years formally managing a development team. His experience with distributed systems is also limited. We recommend strengthening leadership credentials before reapplying.',
  biasFlags: [
    { type: 'Age Proxy', description: 'Graduation year (2018) used as indirect age proxy in initial scoring', severity: 'low' },
  ],
  skillGaps: ['Team management (2+ years)', 'Distributed systems (production scale)', 'System design'],
  strengths: ['React & TypeScript depth', 'Mentorship experience', 'API development', 'CI/CD familiarity'],
  processedAt: new Date().toISOString(),
}

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-2.5">
        <span className="text-xs font-syne font-bold text-[#666] tracking-wide uppercase">{lang}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="flex items-center gap-1.5 text-[#666] hover:text-white text-xs transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0d0d0d] text-[#c9d1d9] text-xs leading-relaxed p-5 overflow-x-auto font-mono">
        {code}
      </pre>
    </div>
  )
}

const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream transition-colors"
      >
        <span className="font-syne font-bold text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function APIIntegrationPage() {
  const [activeTab, setActiveTab] = useState('Test Model')
  const [resume, setResume] = useState(SAMPLE_RESUME)
  const [job, setJob] = useState(SAMPLE_JOB)
  const [status, setStatus] = useState<ModelStatus>('idle')
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const [error, setError] = useState('')
  const [modelUrl, setModelUrl] = useState('http://localhost:8000')

  const handleRun = async () => {
    if (!resume.trim() || !job.trim()) return
    setStatus('loading')
    setResult(null)
    setError('')

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resume, jobDescription: job }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `API returned ${response.status}`)
      }
      const data = await response.json()

      if (data.result) {
        setResult(data.result)
        setStatus('success')
      } else {
        throw new Error(data.error || 'Invalid response from model')
      }
    } catch (err: unknown) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong calling /api/screen')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar role="recruiter" />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="page-label mb-2">Model Integration Hub</div>
          <h1 className="font-syne font-extrabold text-4xl tracking-tight">AI Model Integration</h1>
          <p className="text-sm font-dm text-muted mt-1">
            Connect, test, and configure your bias-aware screening model
          </p>
        </div>

        {/* Status bar */}
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-syne font-bold text-muted uppercase tracking-wide">Model Status</span>
            </div>
            <span className="text-xs font-dm text-muted">Demo mode — using mock responses</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              className="input-field text-xs py-1.5 px-3 w-52"
              placeholder="http://localhost:8000"
            />
            <button className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Zap size={12} /> Test Connection
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream border border-border rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-dm font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? 'bg-white border border-border text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {tab === 'Test Model' && <Play size={13} />}
              {tab === 'Integration Guide' && <Code size={13} />}
              {tab === 'API Reference' && <FileText size={13} />}
              {tab === 'Configuration' && <Settings size={13} />}
              {tab}
            </button>
          ))}
        </div>

        {/* ─── TAB: TEST MODEL ─── */}
        {activeTab === 'Test Model' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="flex flex-col gap-4">
              <div className="card p-5">
                <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">Resume / CV Text</p>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={14}
                  className="input-field resize-none font-mono text-xs leading-relaxed"
                  placeholder="Paste resume text here..."
                />
              </div>

              <div className="card p-5">
                <p className="text-xs font-syne font-bold tracking-widest uppercase text-muted mb-3">Job Description</p>
                <textarea
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  rows={8}
                  className="input-field resize-none font-mono text-xs leading-relaxed"
                  placeholder="Paste job description here..."
                />
              </div>

              <button
                onClick={handleRun}
                disabled={status === 'loading' || !resume || !job}
                className="btn-accent py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <><Loader2 size={15} className="animate-spin" /> Running screening...</>
                ) : (
                  <><Play size={15} /> Run AI Screening</>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle size={15} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-dm text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Output */}
            <div>
              {status === 'loading' && (
                <div className="card p-12 flex flex-col items-center justify-center text-center h-full min-h-64">
                  <Loader2 size={28} className="animate-spin text-muted mb-3" />
                  <p className="font-syne font-bold text-sm">Calling model API...</p>
                  <p className="text-xs font-dm text-muted mt-1">Parsing resume · Scoring match · Detecting bias</p>
                </div>
              )}

              {status === 'success' && result && (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <CheckCircle size={16} className="text-forest" />
                    <p className="font-syne font-bold text-sm">Model response received</p>
                    <span className="ml-auto text-xs font-dm text-muted font-mono">200 OK</span>
                  </div>
                  <FeedbackPanel result={result} />
                </div>
              )}

              {status === 'idle' && (
                <div className="card p-12 flex flex-col items-center justify-center text-center h-full min-h-64 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-cream border border-border flex items-center justify-center mb-3">
                    <Play size={20} className="text-muted" />
                  </div>
                  <p className="font-syne font-bold text-sm text-muted">Hit "Run AI Screening" to test your model</p>
                  <p className="text-xs font-dm text-muted mt-1 max-w-xs">
                    In demo mode, mock results are returned. Connect your real model via the Integration Guide.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: INTEGRATION GUIDE ─── */}
        {activeTab === 'Integration Guide' && (
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="bg-[#fff9f0] border border-[#f0d9b5] rounded-xl p-5">
              <p className="font-syne font-bold text-sm text-amber-800 mb-1">⚑ Your Integration Path</p>
              <p className="text-sm font-dm text-amber-700 leading-relaxed">
                Wrap your Python model in a FastAPI server. Next.js calls it via <code>/api/screen</code>. The bridge is already wired — you just need to replace the mock response with your real model call.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <AccordionItem title="Step 1 — Wrap your model in FastAPI (Python)">
                <p className="text-sm font-dm text-muted mb-3 leading-relaxed">
                  Create a FastAPI server that exposes a <code>/screen</code> endpoint. It receives resume text and job description, calls your model, and returns the structured result.
                </p>
                <CodeBlock lang="python" code={`from fastapi import FastAPI
from pydantic import BaseModel
from your_model import load_model, predict  # ← your model

app = FastAPI()
model = load_model("path/to/your/model")

class ScreenRequest(BaseModel):
    resume: str
    job_description: str

class ScreenResponse(BaseModel):
    score: float
    skills_match: float
    experience_match: float
    decision: str  # "shortlisted" | "rejected" | "review"
    feedback: str
    bias_flags: list[dict]
    skill_gaps: list[str]
    strengths: list[str]

@app.post("/screen", response_model=ScreenResponse)
async def screen_resume(req: ScreenRequest):
    result = predict(model, req.resume, req.job_description)
    return ScreenResponse(
        score=result["score"],
        skills_match=result["skills_match"],
        experience_match=result["experience_match"],
        decision=result["decision"],
        feedback=result["feedback"],
        bias_flags=result.get("bias_flags", []),
        skill_gaps=result.get("skill_gaps", []),
        strengths=result.get("strengths", [])
    )

# Run: uvicorn main:app --host 0.0.0.0 --port 8000`} />
              </AccordionItem>

              <AccordionItem title="Step 2 — Connect Next.js API route to your model">
                <p className="text-sm font-dm text-muted mb-3 leading-relaxed">
                  Edit <code>app/api/screen/route.ts</code>. Replace the mock section with a real HTTP call to your FastAPI server.
                </p>
                <CodeBlock lang="typescript" code={`// app/api/screen/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()

  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // ← REPLACE THIS with your model API URL from .env.local
  const MODEL_URL = process.env.MODEL_API_URL || "http://localhost:8000"

  try {
    const res = await fetch(\`\${MODEL_URL}/screen\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: resumeText,
        job_description: jobDescription,
      }),
    })

    if (!res.ok) {
      throw new Error(\`Model API returned \${res.status}\`)
    }

    const modelResult = await res.json()

    // Map to FairHire's ScreeningResult type
    const result = {
      id: crypto.randomUUID(),
      applicationId: "test",
      score: Math.round(modelResult.score * 100),
      skillsMatch: Math.round(modelResult.skills_match * 100),
      experienceMatch: Math.round(modelResult.experience_match * 100),
      decision: modelResult.decision,
      feedback: modelResult.feedback,
      biasFlags: modelResult.bias_flags ?? [],
      skillGaps: modelResult.skill_gaps ?? [],
      strengths: modelResult.strengths ?? [],
      processedAt: new Date().toISOString(),
    }

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json(
      { error: "Model API unreachable. Is FastAPI running?" },
      { status: 502 }
    )
  }
}`} />
              </AccordionItem>

              <AccordionItem title="Step 3 — Environment variables">
                <p className="text-sm font-dm text-muted mb-3">Create a <code>.env.local</code> file in your project root:</p>
                <CodeBlock lang="bash" code={`# .env.local

# Your AI model FastAPI server URL
MODEL_API_URL=http://localhost:8000

# If deploying to production (e.g. on Render or Railway):
# MODEL_API_URL=https://your-model.onrender.com

# Database (when you add Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/fairhire"

# NextAuth (when you add auth)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"`} />
              </AccordionItem>

              <AccordionItem title="Step 4 — Expected model output schema">
                <p className="text-sm font-dm text-muted mb-3">Your model must return this JSON structure. Fields marked * are required.</p>
                <CodeBlock lang="json" code={`{
  "score": 0.74,              // * float 0–1: overall match score
  "skills_match": 0.82,       // * float 0–1: technical skills match
  "experience_match": 0.66,   // * float 0–1: experience level match
  "decision": "rejected",     // * "shortlisted" | "rejected" | "review"
  "feedback": "Your skills are strong...",  // * string: sent to candidate
  "bias_flags": [             // list of detected bias patterns
    {
      "type": "Age Proxy",
      "description": "Graduation year used as age indicator",
      "severity": "low"       // "low" | "medium" | "high"
    }
  ],
  "skill_gaps": [             // list of missing skills/experience
    "Team management 2+ years",
    "Distributed systems"
  ],
  "strengths": [              // list of positive matches
    "React & TypeScript expertise",
    "API development experience"
  ]
}`} />
              </AccordionItem>

              <AccordionItem title="Step 5 — Run both servers">
                <CodeBlock lang="bash" code={`# Terminal 1 — Start your FastAPI model server
cd path/to/your/model
pip install fastapi uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Start the Next.js frontend
cd path/to/fairhire
npm install
npm run dev

# Then open:
# http://localhost:3000           ← FairHire website
# http://localhost:8000/docs      ← FastAPI auto docs (great for testing!)
# http://localhost:3000/api-integration  ← This page`} />
              </AccordionItem>
            </div>
          </div>
        )}

        {/* ─── TAB: API REFERENCE ─── */}
        {activeTab === 'API Reference' && (
          <div className="flex flex-col gap-5 max-w-3xl">
            {[
              {
                method: 'POST',
                path: '/api/screen',
                desc: 'Screen a resume against a job description. Calls your AI model and returns structured feedback.',
                body: `{
  "resumeText": "string — full extracted text from CV",
  "jobDescription": "string — job title, requirements, description",
  "applicationId": "string (optional) — link to application record"
}`,
                response: `{
  "result": {
    "id": "uuid",
    "score": 74,          // 0–100
    "skillsMatch": 82,
    "experienceMatch": 66,
    "decision": "rejected",
    "feedback": "...",
    "biasFlags": [...],
    "skillGaps": [...],
    "strengths": [...]
  }
}`,
              },
              {
                method: 'GET',
                path: '/api/jobs',
                desc: 'List all open job postings.',
                body: null,
                response: `{ "jobs": [{ "id": "...", "title": "...", "company": "..." }] }`,
              },
              {
                method: 'POST',
                path: '/api/jobs',
                desc: 'Create a new job posting (recruiter only).',
                body: `{
  "title": "string",
  "description": "string",
  "requirements": ["string"],
  "location": "string",
  "salary": "string (optional)"
}`,
                response: `{ "job": { "id": "...", "title": "..." } }`,
              },
              {
                method: 'GET',
                path: '/api/applications/[id]',
                desc: 'Get a single application with full screening result.',
                body: null,
                response: `{ "application": { "id": "...", "status": "screened", "result": {...} } }`,
              },
            ].map((ep) => (
              <div key={ep.path} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-syne font-bold px-2 py-0.5 rounded border ${
                    ep.method === 'GET' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-green-50 border-green-200 text-green-700'
                  }`}>{ep.method}</span>
                  <code className="text-sm font-mono text-ink">{ep.path}</code>
                </div>
                <p className="text-sm font-dm text-muted mb-3">{ep.desc}</p>
                {ep.body && (
                  <div className="mb-3">
                    <p className="text-xs font-syne font-bold uppercase tracking-wide text-muted mb-1.5">Request Body</p>
                    <CodeBlock lang="json" code={ep.body} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-syne font-bold uppercase tracking-wide text-muted mb-1.5">Response</p>
                  <CodeBlock lang="json" code={ep.response} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB: CONFIGURATION ─── */}
        {activeTab === 'Configuration' && (
          <div className="flex flex-col gap-5 max-w-xl">
            <div className="card p-5">
              <p className="font-syne font-bold text-base mb-4">Model Connection</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Model API URL</label>
                  <input type="url" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} className="input-field" />
                  <p className="text-xs font-dm text-muted mt-1">Your FastAPI server URL. Set in .env.local as MODEL_API_URL</p>
                </div>
                <div>
                  <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">Screening Endpoint</label>
                  <input type="text" defaultValue="/screen" className="input-field" />
                </div>
                <button className="btn-ghost text-sm px-4 py-2.5 w-fit flex items-center gap-2">
                  <Zap size={14} /> Test Connection
                </button>
              </div>
            </div>

            <div className="card p-5">
              <p className="font-syne font-bold text-base mb-4">Scoring Thresholds</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Shortlist Threshold', val: '80', desc: 'Minimum score to automatically shortlist' },
                  { label: 'Rejection Threshold', val: '50', desc: 'Scores below this are automatically rejected' },
                  { label: 'Bias Alert Sensitivity', val: '0.7', desc: 'Confidence threshold for flagging bias (0–1)' },
                ].map((s) => (
                  <div key={s.label}>
                    <label className="text-xs font-syne font-bold text-muted uppercase tracking-wide block mb-1.5">{s.label}</label>
                    <input type="number" defaultValue={s.val} className="input-field w-32" />
                    <p className="text-xs font-dm text-muted mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <p className="font-syne font-bold text-base mb-4">Bias Detection Settings</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Flag Age Proxies', enabled: true },
                  { label: 'Flag Name Bias', enabled: true },
                  { label: 'Flag Gender Proxies', enabled: true },
                  { label: 'Flag University Bias', enabled: false },
                  { label: 'Log all flags to audit trail', enabled: true },
                ].map((setting) => (
                  <label key={setting.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-dm text-ink">{setting.label}</span>
                    <div className={`w-10 h-5 rounded-full border-2 flex items-center transition-colors ${
                      setting.enabled ? 'bg-forest border-forest' : 'bg-cream border-border'
                    }`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${
                        setting.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-primary py-3 text-sm">Save Configuration</button>
          </div>
        )}
      </main>
    </div>
  )
}
