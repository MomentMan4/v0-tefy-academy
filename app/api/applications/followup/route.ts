import { NextResponse } from "next/server"
import { scheduleFollowupEmails } from "@/app/actions/applications"

export async function GET() {
  try {
    const result = await scheduleFollowupEmails()

    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: `Scheduled follow-up emails for ${result.count} incomplete applications`,
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: result.error || "Failed to schedule follow-up emails",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in follow-up API route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
