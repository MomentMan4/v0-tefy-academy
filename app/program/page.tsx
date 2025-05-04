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
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function ProgramPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
      <h1 className="text-4xl font-bold text-center">Cybersecurity GRC Program Overview</h1>
      <p className="text-lg text-muted-foreground text-center">
        A hands-on, accessible, and high-impact program to launch your career in Governance, Risk, and Compliance.
      </p>

      {/* Section 1 */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">What You&apos;ll Learn</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Cybersecurity fundamentals, even if you have no technical background</li>
          <li>Risk assessments, frameworks (NIST, ISO), policies, and controls</li>
          <li>Audit preparation, regulatory alignment, and incident response basics</li>
          <li>Real-world GRC case studies and simulations</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Why This Program Works</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Live and practical sessions designed for absolute beginners and pivots</li>
          <li>Curriculum mapped to in-demand GRC roles and certifications</li>
          <li>Final capstone project to build your GRC portfolio</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Optional 4-Week Internship</h2>
        <p>
          Work on real GRC projects under expert guidance. Ideal for applying your learning, getting mentorship, and
          earning practical experience for your resume and interviews.
        </p>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">What&apos;s Included</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Live sessions 3 times weekly</li>
          <li>Class recordings and digital materials</li>
          <li>Assessments, quizzes, and templates</li>
          <li>Private learning community</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Do I need a tech background?</p>
            <p className="text-muted-foreground">
              No. This program is designed to welcome both tech and non-tech professionals.
            </p>
          </div>
          <div>
            <p className="font-medium">Can I take the course remotely?</p>
            <p className="text-muted-foreground">Yes. The program is fully online with live interactive sessions.</p>
          </div>
          <div>
            <p className="font-medium">Will I receive a certificate?</p>
            <p className="text-muted-foreground">
              Yes. You will receive a digital certificate and portfolio materials.
            </p>
          </div>
          <div>
            <p className="font-medium">Can I join the internship later?</p>
            <p className="text-muted-foreground">Yes. Internship access can be added after the program ends.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Ready to get started?</p>
        <a href="/apply" className="inline-block bg-primary text-white px-6 py-2 rounded-md font-medium">
          Enroll Now
        </a>
      </div>
    </div>
  )
}
