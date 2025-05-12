import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Shield, Laptop, Calendar, Award, BookOpen } from "lucide-react"
import CountdownTimer from "@/components/CountdownTimer"

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center space-y-20">
      {/* Hero Section - Optimized for both mobile and desktop */}
      <section className="w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 animate-fade-in">
        <div className="max-w-6xl mx-auto px-8">
          {/* Mobile layout (image above text) */}
          <div className="md:hidden flex flex-col items-center gap-8">
            {/* Image container for mobile */}
            <div className="w-full max-w-md h-[300px] relative mb-4">
              <Image
                src="/cybersecurity-professional.png"
                alt="Cybersecurity professional"
                fill
                priority
                sizes="(max-width: 768px) 100vw"
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Text content for mobile */}
            <div className="space-y-6">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-2">
                Limited Spots Available
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Launch a Future-Proof Cybersecurity Career, in Just 5 Weeks
              </h1>
              <p className="text-lg text-muted-foreground">
                Gain real-world GRC skills, unlock remote job opportunities, and pivot into one of the fastest-growing
                cybersecurity fields — no tech background required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/apply">
                    Apply for the Program <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/assessment">Take The Free Assessment</Link>
                </Button>
              </div>
              <div className="pt-4">
                <a
                  href="https://cal.com/tefydigital/cyber-grc-class-chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  Book a Free Info Session <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop layout (side by side) */}
          <div className="hidden md:flex flex-row items-center gap-8">
            {/* Text content for desktop */}
            <div className="flex-1 space-y-6">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-2">
                Limited Spots Available
              </div>
              <h1 className="text-5xl font-bold leading-tight">
                Launch a Future-Proof Cybersecurity Career, in Just 5 Weeks
              </h1>
              <p className="text-lg text-muted-foreground">
                Gain real-world GRC skills, unlock remote job opportunities, and pivot into one of the fastest-growing
                cybersecurity fields — no tech background required.
              </p>
              <div className="flex flex-row gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/apply">
                    Apply for the Program <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/assessment">Take The Free Assessment</Link>
                </Button>
              </div>
              <div className="pt-4">
                <a
                  href="https://cal.com/tefydigital/cyber-grc-class-chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  Book a Free Info Session <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>

            {/* Image container for desktop */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md h-[350px]">
                <Image
                  src="/cybersecurity-professional.png"
                  alt="Cybersecurity professional"
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw"
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="max-w-5xl mx-auto px-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Next Cohort Begins May 28th</h2>
        <CountdownTimer targetDate="2025-05-28T00:00:00" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow hover-lift">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">5 Weeks</h3>
            <p className="text-muted-foreground text-sm">
              Wednesday & Friday 7:00 PM EST
              <br />
              Saturday 10:00 AM EST
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow hover-lift">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">15 Live Sessions</h3>
            <p className="text-muted-foreground text-sm">
              Interactive classes with
              <br />
              Certificate of Participation
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow hover-lift">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">Cost</h3>
            <p className="text-muted-foreground text-sm">
              700 CAD (Tax exclusive)
              <br />
              +300 CAD Internship (Optional)
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow hover-lift">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">Limited Spots</h3>
            <p className="text-muted-foreground text-sm">
              Immersive experience
              <br />
              Starts May 28th
            </p>
          </div>
        </div>
      </section>

      {/* Why GRC Now */}
      <section className="max-w-5xl mx-auto px-8 text-center space-y-8">
        <h2 className="text-3xl font-bold">Why GRC, Why Now?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">GRC Roles Are Booming</h3>
            <p className="text-muted-foreground">
              Every industry needs GRC professionals to manage risk and ensure compliance with regulations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">Backbone of Cybersecurity</h3>
            <p className="text-muted-foreground">
              GRC forms the foundation of effective security programs and builds organizational trust.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <Laptop size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">Remote-Ready Careers</h3>
            <p className="text-muted-foreground">
              GRC roles are perfectly suited for remote work, offering flexibility and work-life balance.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Learn - Refined Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-8 space-y-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">What You'll Learn</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Gain practical skills that employers are actively seeking in the cybersecurity GRC field
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Risk Management</h3>
              <p className="text-muted-foreground mb-3">
                Master the art of identifying, analyzing, and mitigating security risks that organizations face daily.
              </p>
              <div className="flex items-center text-primary font-medium text-sm">
                <Link href="/program" className="flex items-center gap-1 hover:underline">
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Compliance Frameworks</h3>
              <p className="text-muted-foreground mb-3">
                Apply industry-standard frameworks like NIST and ISO to ensure organizations meet regulatory
                requirements.
              </p>
              <div className="flex items-center text-primary font-medium text-sm">
                <Link href="/program" className="flex items-center gap-1 hover:underline">
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Career-Ready Skills</h3>
              <p className="text-muted-foreground mb-3">
                Build a professional portfolio with hands-on projects and gain the confidence to excel in GRC
                interviews.
              </p>
              <div className="flex items-center text-primary font-medium text-sm">
                <Link href="/program" className="flex items-center gap-1 hover:underline">
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/program">
                View Full Curriculum <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="italic text-lg mb-4">
              &quot;Coming from physical security, I pivoted into GRC with confidence thanks to this course!&quot;
            </p>
            <p className="font-medium">— Femi A.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="italic text-lg mb-4">
              &quot;I transitioned from admin support into tech compliance, best life changing decision!&quot;
            </p>
            <p className="font-medium">— Ahmad H.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">Future-Proof Your Career. Apply Today.</h2>
          <p className="text-lg opacity-90">Join our next cohort and transform your career path in just 5 weeks.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/apply">
                Start Your Application <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/assessment">Take The Free Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
