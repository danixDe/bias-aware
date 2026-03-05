import spacy

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python","java","machine learning","deep learning",
    "react","node","sql","docker","kubernetes","aws"
]

def extract_skills(text):
    doc = nlp(text.lower())
    found_skills = []

    for skill in SKILLS:
        if skill in text.lower():
            found_skills.append(skill)

    return found_skills


def build_feature_vector(skills, experience, education):
    skill_score = len(skills)

    feature_vector = [
        skill_score,
        experience,
        education
    ]

    return feature_vector