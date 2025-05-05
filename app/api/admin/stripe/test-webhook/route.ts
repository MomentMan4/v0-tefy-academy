import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { eventType, customerEmail, customerName, amount } = await req.json()

    // Simulate webhook processing
    console.log(`Processing ${eventType} webhook for ${customerName} (${customerEmail})`)

    // In a real app, you would call your webhook handler with a simulated event
    // For now, we'll just return a success response

    return NextResponse.json({
      status: "success",
      message: `Webhook ${eventType} processed successfully`,
      details: {
        event: eventType,
        customer: {
          email: customerEmail,
          name: customerName,
        },
        payment: {
          amount: Number.parseInt(amount),
          currency: "usd",
        },
        processed_at: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Error processing test webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
