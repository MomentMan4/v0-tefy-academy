export const metadata = {
  title: "Terms and Conditions | TEFY Academy",
  description: "Terms and conditions for TEFY Academy's services and programs.",
  openGraph: {
    title: "Terms and Conditions | TEFY Academy",
    description: "Terms and conditions for TEFY Academy's services and programs.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-bold">Terms and Conditions</h1>
      <p>
        By enrolling in the Cybersecurity GRC program, you agree to abide by all policies and instructions shared during
        the course. All payments are final and non-refundable, except in rare circumstances. However, participants may
        defer their enrollment to the next session.
      </p>
      <p>All course content is owned by TEFY Digital Academy and may not be redistributed without permission.</p>
    </div>
  )
}
