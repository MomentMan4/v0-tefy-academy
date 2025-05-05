import { NextResponse } from "next/server"
import {
  sendResultsEmail,
  sendPaymentConfirmation,
  sendOnboardingEmail,
  sendApplicationFollowupEmail,
} from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { to, template, name, score, roles } = await req.json()

    // Validate inputs
    if (!to || !template || !name) {
      return NextResponse.json({ error: "Missing required fields: to, template, name" }, { status: 400 })
    }

    let result

    // Send the appropriate template email
    switch (template) {
      case "results":
        const rolesList = roles ? roles.split(",").map((role: string) => role.trim()) : []
        result = await sendResultsEmail(to, name, rolesList, Number.parseInt(score) || 85)
        break
      case "payment":
        result = await sendPaymentConfirmation(to, name)
        break
      case "onboarding":
        result = await sendOnboardingEmail(to, name)
        break
      case "followup":
        result = await sendApplicationFollowupEmail(to, name)
        break
      default:
        return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    return NextResponse.json({
      status: "success",
      message: "Template email sent successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("Error sending template email:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
