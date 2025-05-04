export const metadata = {
  title: "Privacy Policy | TEFY Academy",
  description: "Learn how TEFY Academy protects and manages your personal data.",
  openGraph: {
    title: "Privacy Policy | TEFY Academy",
    description: "Learn how TEFY Academy protects and manages your personal data.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        We collect user data such as name, email, and industry to personalize your experience and improve our service.
        We do not sell your data. All information is stored securely and only used for internal analysis, communication,
        and support.
      </p>
      <p>By using this website, you agree to our collection and use of information in accordance with this policy.</p>
    </div>
  )
}
