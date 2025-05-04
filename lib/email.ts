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

export async function sendResultsEmail(
  to: string,
  name: string,
  topRoles: string[],
  radarScores?: { skill: string; value: number }[],
) {
  try {
    // Create HTML email content directly instead of using React components
    // This avoids the "getOwner is not a function" error
    const rolesList = topRoles.map((role, i) => `<li><strong>${role}</strong></li>`).join("")

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        
        <p>🎉 Thanks for taking the Cybersecurity GRC Career Assessment!</p>
        
        <p><strong>Your Top Matched Roles:</strong></p>
        <ul>
          ${rolesList}
        </ul>
        
        <p><strong>Here's what you can do next:</strong></p>
        <ol>
          <li><a href="https://academy.tefydigital.com/program">Explore the Full Program Curriculum</a></li>
          <li><a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat">Book a Free 1:1 Info Session</a></li>
          <li><a href="https://academy.tefydigital.com/resources">Browse GRC Resources</a></li>
        </ol>
        
        <p style="margin-top: 30px;">– The TEFY Academy Team</p>
      </div>
    `

    return await resend.emails.send({
      from: "noreply@tefydigital.com",
      to,
      subject: "Your GRC Assessment Results",
      html: html,
    })
  } catch (error) {
    console.error("Failed to send results email:", error)
    return null
  }
}

export async function sendPaymentConfirmation(to: string, name: string) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
        <p>Hi ${name},</p>
        <p>Thank you for securing your spot in the Cybersecurity GRC Program!</p>
        <p>Your payment has been received. You'll receive further instructions closer to the class start date.</p>
        <p>Need help before then? Reply to this email or contact admissions@tefydigital.com</p>
        <p>We're excited to help you launch your GRC career.</p>
        <p>— The TEFY Academy Team</p>
      </div>
    `

    return await resend.emails.send({
      from: "admissions@tefydigital.com",
      to,
      subject: "Payment Confirmation – GRC Program",
      html: html,
    })
  } catch (error) {
    console.error("Failed to send payment confirmation:", error)
    return null
  }
}

export async function sendOnboardingEmail(to: string, name: string) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
        <p>Welcome, ${name}!</p>
        <p>You've successfully enrolled in the Cybersecurity GRC Program. We're thrilled to have you onboard.</p>
        <p>Here's what to expect next:</p>
        <ul>
          <li>Your class access details will be sent soon</li>
          <li>You'll be added to our private learning community</li>
          <li>Expect weekly updates and check-ins from our team</li>
        </ul>
        <p>We recommend bookmarking <a href="https://academy.tefydigital.com/program">this program page</a> for reference.</p>
        <p>— TEFY Digital Academy Team</p>
      </div>
    `

    return await resend.emails.send({
      from: "admissions@tefydigital.com",
      to,
      subject: "Welcome to the Cybersecurity GRC Program!",
      html: html,
    })
  } catch (error) {
    console.error("Failed to send onboarding email:", error)
    return null
  }
}
