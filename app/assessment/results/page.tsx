import ResultsClient from "./ResultsClient"

export const metadata = {
  title: "Your GRC Assessment Results | TEFY Academy",
  description: "View your personalized Cybersecurity GRC career assessment results and recommended roles.",
  openGraph: {
    title: "Your GRC Assessment Results | TEFY Academy",
    description: "View your personalized Cybersecurity GRC career assessment results and recommended roles.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function ResultsPage() {
  return <ResultsClient />
}
