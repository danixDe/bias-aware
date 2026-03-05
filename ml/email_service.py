import smtplib
from email.mime.text import MIMEText


def send_missing_skill_email(email, missing_skills):

    message = f"""
    Dear Candidate,

    Thank you for applying.

    We noticed that the following skills required for this role were not found in your resume:

    {', '.join(missing_skills)}

    Please consider improving these skills and applying again.

    Regards
    FairHire AI
    """

    msg = MIMEText(message)
    msg["Subject"] = "Application Feedback"
    msg["From"] = "hirefair4@gmail.com"
    msg["To"] = email

    server = smtplib.SMTP("smtp.gmail.com",587)
    server.starttls()

    # use app password here
    server.login("hirefair4@gmail.com","ucst ihic gpro vutm")

    server.send_message(msg)
    server.quit()