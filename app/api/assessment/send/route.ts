import { NextResponse } from "next/server"
import { sendResultsEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email, name, topRoles } = await req.json()

    if (!email || !name || !topRoles) {
      return NextResponse.json({ status: "fail", message: "Missing required fields" }, { status: 400 })
    }

    const result = await sendResultsEmail(email, name, topRoles)
    return NextResponse.json({ status: result ? "ok" : "fail" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ status: "fail", message: "Server error" }, { status: 500 })
  }
}
