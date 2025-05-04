import { Resend } from "resend"
import ResultsEmail from "@/emails/ResultsEmail"
import PaymentEmail from "@/emails/PaymentEmail"
import OnboardingEmail from "@/emails/OnboardingEmail"

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

export async function sendResultsEmail(to: string, name: string, topRoles: string[]) {
  try {
    return await resend.emails.send({
      from: "noreply@tefydigital.com",
      to,
      subject: "Your GRC Assessment Results",
      react: ResultsEmail({ name, topRoles }),
    })
  } catch (error) {
    console.error("Failed to send results email:", error)
    return null
  }
}

export async function sendPaymentConfirmation(to: string, name: string) {
  try {
    return await resend.emails.send({
      from: "admissions@tefydigital.com",
      to,
      subject: "Payment Confirmation – GRC Program",
      react: PaymentEmail({ name }),
    })
  } catch (error) {
    console.error("Failed to send payment confirmation:", error)
    return null
  }
}

export async function sendOnboardingEmail(to: string, name: string) {
  try {
    return await resend.emails.send({
      from: "admissions@tefydigital.com",
      to,
      subject: "Welcome to the Cybersecurity GRC Program!",
      react: OnboardingEmail({ name }),
    })
  } catch (error) {
    console.error("Failed to send onboarding email:", error)
    return null
  }
}
