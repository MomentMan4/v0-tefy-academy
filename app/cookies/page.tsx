export const metadata = {
  title: "Cookie Policy | TEFY Academy",
  description: "Learn how TEFY Academy uses cookies on our website.",
  openGraph: {
    title: "Cookie Policy | TEFY Academy",
    description: "Learn how TEFY Academy uses cookies on our website.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>
      <p>
        This site uses cookies to enhance your experience, improve performance, and personalize content. You may disable
        cookies in your browser settings, but certain functionality may be limited.
      </p>
    </div>
  )
}
