import { NextResponse } from "next/server"
import Stripe from "stripe"
import { sendPaymentConfirmation, sendOnboardingEmail } from "@/lib/email"
import { createRegistration } from "@/lib/registrations"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Map Stripe product IDs to program details
const PROGRAM_MAP: Record<string, { name: string; hasInternship: boolean }> = {
  prod_abc123: { name: "GRC Program", hasInternship: false },
  prod_def456: { name: "GRC Program with Internship", hasInternship: true },
  // Add more products as needed
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error("Webhook error:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const name = session?.customer_details?.name || "New User"
    const email = session?.customer_details?.email || ""
    const phone = session?.customer_details?.phone || ""

    try {
      // Get line items to determine program details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Get the product ID from the first line item
      const productId = lineItems.data[0]?.price?.product as string

      // Get program details from the product ID
      const programDetails = PROGRAM_MAP[productId] || {
        name: "GRC Program",
        hasInternship: session.amount_total! >= 100000, // Fallback logic: $1000+ includes internship
      }

      // Create registration record
      await createRegistration({
        name,
        email,
        phone,
        program: programDetails.name,
        has_internship: programDetails.hasInternship,
        payment_id: session.id,
        payment_status: "completed",
        payment_amount: session.amount_total! / 100, // Convert from cents to dollars
        payment_date: new Date().toISOString(),
        source: session.metadata?.source || "website",
        notes: session.metadata?.notes || "",
      })

      // Send email confirmations
      await sendPaymentConfirmation(email, name)
      await sendOnboardingEmail(email, name)
    } catch (error) {
      console.error("Error processing successful checkout:", error)
      // Continue processing - don't fail the webhook if processing fails
    }
  }

  return NextResponse.json({ received: true })
}
