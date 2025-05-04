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
    const rolesList = topRoles.map((role) => `<li><strong>${role}</strong></li>`).join("")

    // Create skills section if radar scores are available
    let skillsSection = ""
    if (radarScores && radarScores.length > 0) {
      const skillItems = radarScores
        .map(
          (skill) => `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>${skill.skill}</strong></span>
            <span>${skill.value}%</span>
          </div>
          <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #3b82f6; height: 100%; width: ${skill.value}%;"></div>
          </div>
        </div>
      `,
        )
        .join("")

      skillsSection = `
        <div style="margin: 20px 0;">
          <h3 style="margin-bottom: 15px;">Your GRC Strength Profile:</h3>
          ${skillItems}
        </div>
      `
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px;">Your GRC Assessment Results</h1>
          <p style="color: #6b7280;">Thank you for completing the TEFY Digital Academy assessment!</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
          <p>We're excited to share your personalized Cybersecurity GRC career assessment results.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1f2937;">Your Top Matched Roles:</h3>
          <ul style="padding-left: 20px;">
            ${rolesList}
          </ul>
        </div>
        
        ${skillsSection}
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Next Steps:</h3>
          <ol style="padding-left: 20px; margin-bottom: 0;">
            <li><a href="https://academy.tefydigital.com/program" style="color: #2563eb;">Explore our comprehensive GRC Program</a></li>
            <li><a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat" style="color: #2563eb;">Book a free consultation with a GRC advisor</a></li>
            <li><a href="https://academy.tefydigital.com/apply" style="color: #2563eb;">Apply for the upcoming cohort</a></li>
          </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">© ${new Date().getFullYear()} TEFY Digital Academy</p>
          <p style="color: #6b7280; font-size: 14px;">Your path to a career in Cybersecurity GRC</p>
        </div>
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
