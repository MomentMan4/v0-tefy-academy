import AssessmentStartPageClient from "./AssessmentStartPageClient"

export const metadata = {
  title: "Cybersecurity GRC Career Assessment | TEFY Academy",
  description:
    "Find your perfect role in Cybersecurity GRC. Take the free self-assessment and explore career paths in risk, compliance, and governance.",
  keywords: [
    "Cybersecurity GRC",
    "Risk and Compliance Careers",
    "GRC self-assessment",
    "Cybersecurity jobs for non-tech professionals",
    "Cybersecurity quiz",
  ],
  openGraph: {
    title: "Cybersecurity GRC Career Assessment",
    description: "Find your cybersecurity career path. Discover if GRC is the right fit for you.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function AssessmentStartPage() {
  return <AssessmentStartPageClient />
}
