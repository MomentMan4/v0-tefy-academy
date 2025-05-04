import { NextResponse } from "next/server"
import { sendResultsEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email, name, topRoles, score, radarScores } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ status: "fail", message: "Email and name are required" }, { status: 400 })
    }

    // Ensure topRoles is an array
    const validTopRoles =
      Array.isArray(topRoles) && topRoles.length > 0
        ? topRoles
        : ["GRC Analyst", "Compliance Specialist", "Risk Coordinator"]

    // Ensure score is a number
    const validScore = typeof score === "number" ? score : 0

    const result = await sendResultsEmail(email, name, validTopRoles, validScore, radarScores)

    if (!result) {
      return NextResponse.json({ status: "fail", message: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ status: "fail", message: "Server error" }, { status: 500 })
  }
}
