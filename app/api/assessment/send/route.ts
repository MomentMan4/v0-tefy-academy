import { NextResponse } from "next/server"
import { sendAssessmentEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email, html } = await req.json()

    if (!email || !html) {
      return NextResponse.json({ status: "fail", message: "Missing required fields" }, { status: 400 })
    }

    const result = await sendAssessmentEmail({ to: email, html })
    return NextResponse.json({ status: result ? "ok" : "fail" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ status: "fail", message: "Server error" }, { status: 500 })
  }
}
