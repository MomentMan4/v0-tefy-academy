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
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Cybersecurity GRC Mastery Program</h1>
        <p className="text-xl font-semibold">5 Weeks. 15 Days. A Career-Defining Transformation.</p>
        <p className="text-lg text-muted-foreground">
          A hands-on journey designed to turn complete beginners and pivoting professionals into confident GRC
          professionals. Learn the secrets behind risk, compliance, policies, frameworks, and tools that power today's
          digital trust.
        </p>
        <p className="font-medium">Live • Interactive • Industry-Mapped</p>
      </section>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold">Week 1: Discovering the Invisible World</h2>
          <p className="text-muted-foreground mt-2">
            You'll never look at IT the same way again. We crack open the basics of cybersecurity and risk, without the
            jargon. Learn how threats are modeled, why risk matters, and step into the fascinating world of governance,
            risk, and compliance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Week 2: Into the Fire</h2>
          <p className="text-muted-foreground mt-2">
            This is where things get real. Track digital assets, sniff out vulnerabilities, and learn how cybersecurity
            teams stay alert. From SIEM dashboards to incident response playbooks: welcome to the war room.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Week 3: Frameworks, Compliance & Control</h2>
          <p className="text-muted-foreground mt-2">
            NIST. ISO. Risk registers. Control mappings. You'll decode the most powerful GRC frameworks without ever
            feeling lost. Get hands-on experience building structured documentation for real-world scenarios.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Week 4: When Everything Goes Wrong</h2>
          <p className="text-muted-foreground mt-2">
            Business resilience, disaster recovery, and vendor risk, you'll learn how organizations plan for chaos and
            compliance. Explore regulatory frameworks like HIPAA, PCI-DSS, CCPA, and more through simulated crises and
            audits.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Week 5: Becoming the Professional</h2>
          <p className="text-muted-foreground mt-2">
            We'll prepare you for real-world success. Secure software. Emerging AI risks. Critical infrastructure. GRC
            platforms. Then tie it all together with your final capstone and career readiness sprint. By the end, you
            won't just be ready, you'll be in demand.
          </p>
        </div>
      </div>

      <div className="mt-10 p-6 border rounded-lg bg-muted">
        <h3 className="text-xl font-semibold mb-2">Program Format</h3>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>
            <strong>Duration:</strong> 5 Weeks
          </li>
          <li>
            <strong>Schedule:</strong> Live classes every Wednesday, Friday & Saturday
          </li>
          <li>
            <strong>Time:</strong> 3.5 hours/day (with a 30-minute break)
          </li>
          <li>
            <strong>Learning Mode:</strong> Instructor-led • Labs • Quizzes • Case Studies • Final Exam
          </li>
          <li>
            <strong>Capstone:</strong> Project submission with portfolio feedback
          </li>
        </ul>
      </div>

      <div className="mt-10 text-center">
        <p className="text-muted-foreground mb-3">Still unsure if it's the right fit?</p>
        <a
          href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary/90"
        >
          Book a Free Consultation
        </a>
      </div>

      <div className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

        <div>
          <h3 className="font-semibold">Is this program beginner-friendly?</h3>
          <p className="text-muted-foreground">
            Absolutely. This course was created for non-tech professionals and tech individuals looking to pivot. We
            simplify complex ideas and support your learning every step of the way.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What happens if I miss a live session?</h3>
          <p className="text-muted-foreground">
            All sessions are recorded and made available on demand. You can also catch up through live review labs and
            office hours.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Will I get a certificate?</h3>
          <p className="text-muted-foreground">
            Yes, you will receive a signed certificate of completion after finishing the course and submitting your
            capstone project.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What tools will I learn?</h3>
          <p className="text-muted-foreground">
            You'll interact with tools like SIEM simulators, risk register templates, ISO frameworks, and GRC platforms
            such as ServiceNow, OneTrust, and more.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Do I need prior experience in cybersecurity?</h3>
          <p className="text-muted-foreground">
            Not at all. If you're curious, detail-oriented, and open to learning, this program is designed for you.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Is there an exam?</h3>
          <p className="text-muted-foreground">
            Yes — a short multiple-choice exam and capstone project complete your journey. These prepare you for
            real-world interviews and industry expectations.
          </p>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Ready to get started?</p>
        <a href="/apply" className="inline-block bg-primary text-white px-6 py-2 rounded-md font-medium">
          Enroll Now
        </a>
      </div>

      <div className="text-center mt-10 space-y-4">
        <p className="text-muted-foreground">Need to speak with someone first?</p>
        <a
          href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Book a Free Info Session
        </a>
      </div>
    </div>
  )
}
