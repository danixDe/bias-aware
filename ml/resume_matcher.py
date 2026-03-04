import re

# skill database
SKILLS_DB = [
    "python","java","react","node","typescript",
    "machine learning","deep learning","sql",
    "docker","kubernetes","aws","system design"
]

def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in SKILLS_DB:
        if re.search(r"\b" + skill + r"\b", text):
            found_skills.append(skill)

    return found_skills


def match_skills(candidate_skills, job_requirements):

    matched = []
    missing = []

    for req in job_requirements:

        if req.lower() in candidate_skills:
            matched.append(req)
        else:
            missing.append(req)

    match_score = int((len(matched)/len(job_requirements))*100)

    return matched, missing, match_score