import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center p-8 space-y-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Launch a Future-Proof Cybersecurity Career — in Just 5 Weeks
        </h1>
        <p className="text-lg text-muted-foreground">
          Gain real-world GRC skills, unlock remote job opportunities, and pivot into one of the fastest-growing
          cybersecurity fields — no tech background required.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/apply">Apply for the Program</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/assessment">Discover Your Cybersecurity Fit</Link>
          </Button>
        </div>
      </section>

      {/* Why GRC Now */}
      <section className="max-w-5xl text-center space-y-8">
        <h2 className="text-3xl font-bold">Why GRC, Why Now?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>🌍 GRC Roles Are Booming in Every Industry</div>
          <div>🔒 The Backbone of Cybersecurity and Trust</div>
          <div>🧭 Remote-Ready, Resilient, and High-Demand</div>
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section className="max-w-6xl space-y-8">
        <h2 className="text-3xl font-bold text-center">What You&apos;ll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div>✅ Conduct Risk Assessments</div>
          <div>✅ Apply Frameworks (NIST, ISO, GDPR)</div>
          <div>✅ Write Policies & Manage Vendor Risk</div>
          <div>✅ Hands-on Labs, Simulated Audits</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl text-center space-y-6">
        <h2 className="text-3xl font-bold">Success Stories</h2>
        <blockquote className="italic">
          &quot;Coming from physical security, I pivoted into GRC with confidence thanks to this course!&quot; — Femi A.
        </blockquote>
        <blockquote className="italic">
          &quot;I transitioned from admin support into tech compliance — life changing!&quot; — Ahmad H.
        </blockquote>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Future-Proof Your Career. Apply Today.</h2>
        <Button asChild>
          <Link href="/apply">Start Your Application</Link>
        </Button>
      </section>
    </main>
  )
}
