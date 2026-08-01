from app.core.config import settings

def send_candidate_status_email(candidate_email: str, candidate_name: str, job_title: str, new_status: str) -> bool:
    """
    Sends automated candidate email notifications via Resend API.
    Provides special branded qualification email when status is 'Shortlisted'.
    """
    if not candidate_email:
        return False

    is_shortlisted = new_status.lower() == "shortlisted"

    if is_shortlisted:
        subject = f"🎉 Congratulations! You are Qualified & Shortlisted for {job_title}"
        html_content = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 16px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); color: #0f172a;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: #0071e3; color: #ffffff; line-height: 48px; font-size: 24px; font-weight: bold;">
                    TQ
                </div>
                <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-top: 12px; margin-bottom: 4px;">TalentIQ AI Recruitment</h2>
                <p style="color: #64748b; font-size: 13px; margin: 0;">Enterprise Talent Acquisition Notification</p>
            </div>

            <div style="padding: 20px; border-radius: 12px; background: #f0f9ff; border: 1px solid #bae6fd; margin-bottom: 20px;">
                <h3 style="color: #0369a1; font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">🎉 You Have Been Shortlisted!</h3>
                <p style="color: #0c4a6e; font-size: 14px; margin: 0; leading-height: 1.5;">
                    Dear <strong>{candidate_name}</strong>,<br/><br/>
                    We are thrilled to inform you that following our comprehensive AI resume assessment, your qualifications have matched our requirements and you are <strong>officially qualified & shortlisted</strong> for the position of:
                </p>
                <div style="margin-top: 12px; font-size: 16px; font-weight: 800; color: #0071e3; text-align: center; padding: 10px; background: #ffffff; border-radius: 8px; border: 1px solid #e0f2fe;">
                    {job_title}
                </div>
            </div>

            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                Our Talent Acquisition team is reviewing your profile details and will reach out to you shortly via email/phone with the next steps for your technical interview session.
            </p>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">Sent via TalentIQ AI Platform • Enterprise Candidate Notification System</p>
            </div>
        </div>
        """
    else:
        subject = f"TalentIQ Update: Application status for {job_title}"
        html_content = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0; color: #0f172a;">
            <h2 style="color: #0071e3; font-size: 20px; font-weight: bold;">TalentIQ AI Application Status Update</h2>
            <p>Dear <strong>{candidate_name}</strong>,</p>
            <p>Your application status for the role of <strong>{job_title}</strong> has been updated to:</p>
            <div style="display: inline-block; padding: 8px 18px; border-radius: 20px; background: #f1f5f9; color: #0f172a; font-weight: bold; font-size: 13px; margin: 12px 0;">
                {new_status.upper()}
            </div>
            <p style="color: #475569; font-size: 13px;">Our recruitment team will keep you posted on further updates.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
            <p style="font-size: 11px; color: #94a3b8;">TalentIQ AI Recruitment Platform</p>
        </div>
        """

    if settings.RESEND_API_KEY and not settings.RESEND_API_KEY.startswith("re_placeholder"):
        try:
            import resend
            resend.api_key = settings.RESEND_API_KEY
            resend.Emails.send({
                "from": "TalentIQ AI <onboarding@resend.dev>",
                "to": candidate_email,
                "subject": subject,
                "html": html_content
            })
            print(f"Shortlist qualification email dispatched to {candidate_email} via Resend API.")
            return True
        except Exception as e:
            print(f"Resend dispatch notice: {e}")
            return False

    print(f"[MOCK EMAIL DISPATCH] To: {candidate_email} | Subject: {subject} | Status: {new_status}")
    return True
