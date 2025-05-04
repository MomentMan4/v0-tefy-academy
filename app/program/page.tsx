import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Clock, Award, Users, BookOpen } from "lucide-react"

export const metadata = {
  title: "Cybersecurity GRC Program | TEFY Academy",
  description:
    "A hands-on, accessible, and high-impact program to launch your career in Governance, Risk, and Compliance.",
  keywords: [
    "Cybersecurity GRC",
    "Risk and Compliance Careers",
    "GRC training",
    "Cybersecurity program for non-tech professionals",
    "GRC certification",
  ],
  openGraph: {
    title: "Cybersecurity GRC Program | TEFY Academy",
    description: "Launch your career in Cybersecurity GRC with our hands-on training program.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Academy",
      },
    ],
  },
}

export default function ProgramPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-6">
            Next Cohort Starting Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Cybersecurity GRC <span className="text-primary">Mastery Program</span>
          </h1>
          <p className="text-xl max-w-3xl mb-8 text-muted-foreground">
            A hands-on journey designed to transform beginners into confident GRC professionals in just 5 weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Calendar size={18} className="text-primary" />
              <span className="text-sm font-medium">5 Weeks</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock size={18} className="text-primary" />
              <span className="text-sm font-medium">15 Live Sessions</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Award size={18} className="text-primary" />
              <span className="text-sm font-medium">Certification</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users size={18} className="text-primary" />
              <span className="text-sm font-medium">Limited Spots</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="px-8">
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Free Consultation
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Program Overview</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Our GRC Mastery Program is designed for professionals looking to pivot into cybersecurity without
                technical backgrounds. Through hands-on learning and real-world scenarios, you'll master the skills
                needed for in-demand GRC roles.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Practical Skills Focus</h3>
                    <p className="text-muted-foreground">
                      Learn by doing with hands-on labs, case studies, and real-world scenarios
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Industry-Aligned Curriculum</h3>
                    <p className="text-muted-foreground">
                      Master frameworks like NIST, ISO, and learn tools used in the industry
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Career-Ready Portfolio</h3>
                    <p className="text-muted-foreground">
                      Graduate with a capstone project and portfolio to showcase to employers
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?key=cq3cd"
                alt="GRC Professionals collaborating"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Curriculum */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Program Curriculum</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive 5-week curriculum takes you from the fundamentals to advanced GRC concepts through
              interactive sessions and practical exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Week 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  W1
                </div>
                <h3 className="text-xl font-semibold">Discovering the Invisible World</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Crack open the basics of cybersecurity and risk, without the jargon. Learn how threats are modeled and
                why risk matters.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Introduction to GRC</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Threat Modeling Basics</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Risk Assessment Fundamentals</span>
                </li>
              </ul>
            </div>

            {/* Week 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  W2
                </div>
                <h3 className="text-xl font-semibold">Into the Fire</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Track digital assets, sniff out vulnerabilities, and learn how cybersecurity teams stay alert with SIEM
                dashboards.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Asset Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Vulnerability Assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">SIEM Fundamentals</span>
                </li>
              </ul>
            </div>

            {/* Week 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  W3
                </div>
                <h3 className="text-xl font-semibold">Frameworks, Compliance & Control</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Decode powerful GRC frameworks like NIST and ISO. Build structured documentation for real-world
                scenarios.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">NIST Framework</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">ISO 27001 Overview</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Control Mapping</span>
                </li>
              </ul>
            </div>

            {/* Week 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  W4
                </div>
                <h3 className="text-xl font-semibold">When Everything Goes Wrong</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Business resilience, disaster recovery, and vendor risk management through simulated crises and audits.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Business Continuity</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Disaster Recovery</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Vendor Risk Management</span>
                </li>
              </ul>
            </div>

            {/* Week 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  W5
                </div>
                <h3 className="text-xl font-semibold">Becoming the Professional</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Prepare for real-world success with secure software, emerging AI risks, and GRC platforms. Complete your
                capstone project.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Secure Software Development</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">AI Risk Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-sm">Capstone Project</span>
                </li>
              </ul>
            </div>

            {/* Program Format */}
            <div className="bg-gradient-to-br from-primary to-indigo-700 p-6 rounded-xl shadow-md text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-semibold">Program Format</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>5 Weeks, 15 Live Sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>Wed, Fri & Sat Schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>3.5 hours/day with breaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>Hands-on Labs & Case Studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>Portfolio-building Capstone</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from our graduates who have successfully transitioned into cybersecurity GRC roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                  <Image src="/professional-woman-portrait.png" alt="Sarah J." fill className="object-cover" />
                </div>
                <h3 className="font-semibold">Sarah J.</h3>
                <p className="text-sm text-primary mb-4">Former Marketing Manager</p>
                <p className="text-muted-foreground italic">
                  "This program gave me the confidence to pivot into GRC. Within 2 months of graduating, I landed a
                  Compliance Analyst role at a fintech company."
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                  <Image src="/professional-man-portrait.png" alt="Michael T." fill className="object-cover" />
                </div>
                <h3 className="font-semibold">Michael T.</h3>
                <p className="text-sm text-primary mb-4">Former Project Coordinator</p>
                <p className="text-muted-foreground italic">
                  "The hands-on approach made complex concepts accessible. I'm now working as a GRC Analyst and earning
                  40% more than my previous role."
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                  <Image src="/diverse-professional-woman.png" alt="Aisha K." fill className="object-cover" />
                </div>
                <h3 className="font-semibold">Aisha K.</h3>
                <p className="text-sm text-primary mb-4">Former Executive Assistant</p>
                <p className="text-muted-foreground italic">
                  "Coming from an admin background, I never thought I'd work in cybersecurity. This program changed
                  everything - I'm now a Risk Coordinator."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about our GRC Mastery Program.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Is this program beginner-friendly?</h3>
              <p className="text-muted-foreground">
                Absolutely. This course was created for non-tech professionals and tech individuals looking to pivot. We
                simplify complex ideas and support your learning every step of the way.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">What happens if I miss a live session?</h3>
              <p className="text-muted-foreground">
                All sessions are recorded and made available on demand. You can also catch up through live review labs
                and office hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Will I get a certificate?</h3>
              <p className="text-muted-foreground">
                Yes, you will receive a signed certificate of completion after finishing the course and submitting your
                capstone project.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">What tools will I learn?</h3>
              <p className="text-muted-foreground">
                You'll interact with tools like SIEM simulators, risk register templates, ISO frameworks, and GRC
                platforms such as ServiceNow, OneTrust, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-primary to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our next cohort and launch your cybersecurity GRC career in just 5 weeks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="px-8">
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              <a
                href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Free Consultation
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
