import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  html: string
}

export async function sendAssessmentEmail({ to, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: "noreply@tefydigital.com",
      to,
      subject: "Your Cybersecurity GRC Assessment Results",
      html,
    })

    return data
  } catch (error) {
    console.error("Resend error:", error)
    return null
  }
}
