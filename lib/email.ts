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
  score: number,
  radarScores?: { skill: string; value: number }[],
  skillBreakdown?: { category: string; score: number; description: string }[],
  recommendedCertifications?: string[],
  careerPathSuggestion?: string,
) {
  try {
    // Create skills section if radar scores are available
    let skillsSection = ""
    if (radarScores && radarScores.length > 0) {
      const skillItems = radarScores
        .map(
          (skill) => `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>${skill.skill}</strong></span>
            <span>${skill.value}%</span>
          </div>
          <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #4f46e5; height: 100%; width: ${skill.value}%;"></div>
          </div>
        </div>
      `,
        )
        .join("")

      skillsSection = `
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px; color: #111827; font-size: 18px;">Your GRC Strength Profile:</h3>
          ${skillItems}
        </div>
      `
    }

    // Create skill breakdown section
    let breakdownSection = ""
    if (skillBreakdown && skillBreakdown.length > 0) {
      const breakdownItems = skillBreakdown
        .map(
          (skill) => `
        <div style="margin-bottom: 15px; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>${skill.category}</strong></span>
            <span style="background-color: #e0e7ff; color: #4f46e5; padding: 2px 8px; border-radius: 9999px; font-size: 12px;">${skill.score}%</span>
          </div>
          <p style="margin: 5px 0; color: #4b5563; font-size: 14px;">${skill.description}</p>
        </div>
      `,
        )
        .join("")

      breakdownSection = `
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px; color: #111827; font-size: 18px;">Skill Breakdown:</h3>
          ${breakdownItems}
        </div>
      `
    }

    // Create career path suggestion section
    let careerSection = ""
    if (careerPathSuggestion) {
      careerSection = `
        <div style="margin: 25px 0; padding: 15px; background-color: #eef2ff; border-radius: 8px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; color: #4338ca; font-size: 18px;">Career Path Suggestion</h3>
          <p style="margin: 0; color: #4338ca;">${careerPathSuggestion}</p>
        </div>
      `
    }

    // Create certifications section
    let certificationsSection = ""
    if (recommendedCertifications && recommendedCertifications.length > 0) {
      const certItems = recommendedCertifications
        .map(
          (cert) => `
        <li style="margin-bottom: 8px; padding: 8px; background-color: #f9fafb; border-radius: 4px;">${cert}</li>
      `,
        )
        .join("")

      certificationsSection = `
        <div style="margin: 25px 0;">
          <h3 style="margin-bottom: 15px; color: #111827; font-size: 18px;">Recommended Certifications:</h3>
          <ul style="padding-left: 20px; list-style-type: none;">
            ${certItems}
          </ul>
        </div>
      `
    }

    // Create roles section
    const rolesList = topRoles
      .map(
        (role, index) =>
          `<li style="margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
        <strong style="color: #111827; font-size: 16px;">${index + 1}. ${role}</strong>
      </li>`,
      )
      .join("")

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px;">Your GRC Assessment Results</h1>
          <p style="color: #6b7280;">Thank you for completing the TEFY Digital Academy assessment!</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
          <p>We're excited to share your personalized Cybersecurity GRC career assessment results.</p>
          
          <div style="margin-top: 15px; text-align: center;">
            <div style="font-size: 36px; font-weight: bold; color: #4f46e5;">${score}%</div>
            <p style="margin: 5px 0; font-size: 18px;">
              ${score >= 80 ? "Excellent Match" : score >= 70 ? "Strong Match" : "Potential Match"}
            </p>
          </div>
        </div>
        
        ${careerSection}
        
        <div style="margin: 25px 0;">
          <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Your Top Matched Roles:</h3>
          <ul style="padding-left: 0; list-style-type: none;">
            ${rolesList}
          </ul>
        </div>
        
        ${skillsSection}
        
        ${breakdownSection}
        
        ${certificationsSection}
        
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">Next Steps:</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 10px;">
              <a href="https://academy.tefydigital.com/program" style="color: #2563eb; font-weight: bold;">
                Explore our comprehensive GRC Program
              </a>
              <p style="margin: 5px 0; color: #1e40af;">Learn about our curriculum designed to build your GRC skills in just 5 weeks</p>
            </li>
            <li style="margin-bottom: 10px;">
              <a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat" style="color: #2563eb; font-weight: bold;">
                Book a free consultation with a GRC advisor
              </a>
              <p style="margin: 5px 0; color: #1e40af;">Get personalized guidance on your GRC career path</p>
            </li>
            <li style="margin-bottom: 10px;">
              <a href="https://academy.tefydigital.com/apply" style="color: #2563eb; font-weight: bold;">
                Apply for the upcoming cohort
              </a>
              <p style="margin: 5px 0; color: #1e40af;">Secure your spot in our next GRC Mastery Program starting May 28th</p>
            </li>
          </ul>
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

export async function sendApplicationFollowupEmail(to: string, name: string) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
        <p>Hi ${name},</p>
        <p>We noticed you started an application for the TEFY Cybersecurity GRC Program but didn't complete the process.</p>
        <p>We wanted to check if you have any questions or if there's anything we can help with. Our next cohort starts on May 28th, and spots are filling up quickly.</p>
        <p>You can:</p>
        <ul>
          <li><a href="https://academy.tefydigital.com/apply">Complete your application</a></li>
          <li><a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat">Schedule a call with our admissions team</a></li>
          <li>Reply to this email with any questions</li>
        </ul>
        <p>We hope to see you in the program!</p>
        <p>— TEFY Digital Academy Team</p>
      </div>
    `

    return await resend.emails.send({
      from: "admissions@tefydigital.com",
      to,
      subject: "Complete Your TEFY GRC Program Application",
      html: html,
    })
  } catch (error) {
    console.error("Failed to send application followup email:", error)
    return null
  }
}
