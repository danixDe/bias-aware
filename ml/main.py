from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import os

from resume_parser import parse_resume
from resume_matcher import match_skills
from email_service import send_missing_skill_email

app = FastAPI(
    title="FairHire AI Screening API",
    description="AI Resume Screening with Skill Matching and Bias Awareness",
    version="1.0"
)


# Home route (so localhost:8000 does not show 404)
@app.get("/")
def home():
    return {"message": "FairHire AI Resume Screening API running"}


@app.post("/screen")
async def screen_resume(
    resume: UploadFile = File(...),
    email: str = Form(...),
    job_requirements: str = Form(...)
):

    try:

        # Convert requirements string to list
        requirements = [r.strip().lower() for r in job_requirements.split(",")]

        # Validate resume file type
        if not resume.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

        # Save uploaded file temporarily
        file_path = f"temp_{resume.filename}"

        with open(file_path, "wb") as f:
            f.write(await resume.read())

        # Extract text from resume
        text = parse_resume(file_path)
        # for debug print(text);

        # Match skills with job requirements
        matched, missing, score = match_skills(
            text,
            requirements
        )

        # Decision logic
        decision = "shortlisted" if score >= 70 else "rejected"

        # Send email if rejected
        if decision == "rejected":
            send_missing_skill_email(email, missing)

        # Remove temporary resume
        os.remove(file_path)

        return {
            "status": "success",
            "candidate_skills": text,
            "matched_skills": matched,
            "missing_skills": missing,
            "match_score": score,
            "decision": decision
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))