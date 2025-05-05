import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json()

    // Validate inputs
    if (!to || !subject || !text) {
      return NextResponse.json({ error: "Missing required fields: to, subject, text" }, { status: 400 })
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email
    const result = await resend.emails.send({
      from: "noreply@tefydigital.com",
      to,
      subject,
      text,
    })

    return NextResponse.json({
      status: "success",
      message: "Email sent successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
