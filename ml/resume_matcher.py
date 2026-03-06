import re

def match_skills(resume_text, job_requirements):

    resume_text = resume_text.lower()

    matched = []
    missing = []

    for req in job_requirements:

        req = req.lower().strip()

        if re.search(r"\b" + re.escape(req) + r"\b", resume_text):
            matched.append(req)
        else:
            missing.append(req)

    if len(job_requirements) == 0:
        match_score = 0
    else:
        match_score = int((len(matched) / len(job_requirements)) * 100)

    print("Matched:", matched)
    print("Missing:", missing)
    print("Score:", match_score)
    print(matched, missing, match_score);
    return matched, missing, match_score