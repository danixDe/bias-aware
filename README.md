# FairHire — Bias-Aware Resume Screening

Final year project website built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — public hero, how it works, job preview |
| `/jobs` | Browse all open positions |
| `/apply` | Candidate application form with CV upload |
| `/portal` | Candidate portal — applications & AI feedback |
| `/dashboard` | Recruiter dashboard — KPIs & recent activity |
| `/jobs/applicants` | Recruiter applicant review with feedback panel |
| `/analytics` | Bias analytics — charts, audit log, reports |
| `/api-integration` | **Model integration hub** — test, configure, docs |
| `/auth/login` | Sign in |
| `/auth/signup` | Register as recruiter or candidate |

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Connecting Your AI Model

### 1. Create `.env.local`

```bash
MODEL_API_URL=http://localhost:8000
```

### 2. Wrap your model in FastAPI

```python
# model_server.py
from fastapi import FastAPI
from pydantic import BaseModel
from your_model import predict

app = FastAPI()

class ScreenRequest(BaseModel):
    resume: str
    job_description: str

@app.post("/screen")
async def screen(req: ScreenRequest):
    result = predict(req.resume, req.job_description)
    return {
        "score": result["score"],             # float 0–1
        "skills_match": result["skills"],     # float 0–1
        "experience_match": result["exp"],    # float 0–1
        "decision": result["decision"],       # "shortlisted" | "rejected"
        "feedback": result["feedback"],       # string sent to candidate
        "bias_flags": result["bias_flags"],   # list of {type, description, severity}
        "skill_gaps": result["skill_gaps"],   # list of strings
        "strengths": result["strengths"],     # list of strings
    }

# Run: uvicorn model_server:app --port 8000
```

### 3. Edit `app/api/screen/route.ts`

Uncomment the real model call block and remove the mock response block.

### 4. Test at `/api-integration`

Use the Test Model tab to paste a resume + job description and see live model output.

## Project Structure

```
fairhire/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # Recruiter dashboard
│   ├── jobs/page.tsx               # Job listings
│   ├── jobs/applicants/page.tsx    # Applicant review
│   ├── portal/page.tsx             # Candidate portal
│   ├── apply/page.tsx              # Application form
│   ├── analytics/page.tsx          # Bias analytics
│   ├── api-integration/page.tsx    # ← Model integration hub
│   ├── auth/login/page.tsx
│   ├── auth/signup/page.tsx
│   └── api/
│       ├── screen/route.ts         # ← The model bridge
│       ├── jobs/route.ts
│       └── applications/route.ts
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── ScoreBar.tsx
│   │   └── FeedbackPanel.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── shared/
│       └── JobCard.tsx
├── lib/
│   ├── mock-data.ts
│   └── utils.ts
└── types/index.ts
```

## Adding a Real Database (Optional)

```bash
npm install prisma @prisma/client
npx prisma init
```

Add to `schema.prisma` — see the architecture doc for the full schema.

## Adding Auth (Optional)

```bash
npm install next-auth
```

See [NextAuth.js docs](https://next-auth.js.org) for setup.
