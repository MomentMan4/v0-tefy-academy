"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { calculateAssessmentResult } from "@/lib/assessment/logic"
import { Button } from "@/components/ui/button"
import ResultChart from "@/components/ResultChart"
import PDFDownloadButton from "@/components/PDFDownloadButton"
import SendEmailButton from "@/components/SendEmailButton"
import Rating from "@/components/Rating"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function logAssessmentToSupabase({
  name,
  email,
  industry,
  score,
  roles,
  isBridge,
}: {
  name: string
  email: string
  industry: string
  score: number
  roles: string[]
  isBridge: boolean
}) {
  const { error } = await supabase.from("submissions").insert({
    name,
    email,
    industry,
    score,
    roles,
    is_bridge: isBridge,
  })

  if (error) {
    console.error("Supabase logging failed:", error.message)
  }
}

export default function AssessmentResultsPage() {
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [matchedRoles, setMatchedRoles] = useState<any[]>([])
  const [isBridge, setIsBridge] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; industry: string } | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [loggedToSupabase, setLoggedToSupabase] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const userInfo = localStorage.getItem("assessment-user")
    const answerData = localStorage.getItem("assessment-answers")

    if (!userInfo || !answerData) {
      router.push("/assessment")
      return
    }

    const parsedAnswers = JSON.parse(answerData)
    setAnswers(parsedAnswers)
    const parsedUser = JSON.parse(userInfo)
    setUser(parsedUser)

    const result = calculateAssessmentResult(parsedAnswers)
    setFinalScore(result.finalScore)
    setMatchedRoles(result.matchedRoles)
    setIsBridge(result.isBridge)

    // Log to Supabase only once
    if (!loggedToSupabase && parsedUser && result.finalScore) {
      logAssessmentToSupabase({
        name: parsedUser.name,
        email: parsedUser.email,
        industry: parsedUser.industry,
        score: result.finalScore,
        roles: result.matchedRoles.map((r) => r.title),
        isBridge: result.isBridge,
      })
      setLoggedToSupabase(true)
    }
  }, [router, loggedToSupabase])

  if (finalScore === null || !user) return <p className="text-center mt-10">Loading your results...</p>

  const getResultHtml = () => {
    const element = document.getElementById("assessment-result-pdf")
    return element?.innerHTML || ""
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <div id="assessment-result-pdf">
        <h1 className="text-3xl font-bold text-center">Hi {user.name}, here are your GRC results</h1>

        <div className="text-center">
          <p className="text-xl font-semibold">
            🎯 Final Score: <span className="text-primary">{finalScore}%</span>
          </p>
          {finalScore >= 80 && (
            <p className="text-green-600 font-semibold mt-2">🎉 You earned a GRC Readiness Badge!</p>
          )}
        </div>

        {/* Chart */}
        <ResultChart answers={answers} />

        {/* Role Matches */}
        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold">
            {isBridge ? "Suggested Bridge Roles to Enter GRC" : "Your Top GRC Role Matches"}
          </h2>
          {matchedRoles.map((role, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-2">
              <p className="text-lg font-semibold">
                {role.title}
                {!isBridge && role.matchPercent && (
                  <span className="ml-2 text-sm text-muted-foreground">({role.matchPercent}% match)</span>
                )}
              </p>
              <p className="text-muted-foreground">{role.description}</p>
              {!isBridge && (
                <>
                  <p>
                    <strong>Skills Needed:</strong> {role.skillsNeeded?.join(", ")}
                  </p>
                  <p>
                    <strong>Salary Range:</strong> {role.salaryRange}
                  </p>
                  <p>
                    <strong>Career Path:</strong> {role.careerPathExamples?.join(" → ")}
                  </p>
                  <p>
                    <strong>Certifications:</strong> {role.recommendedCerts?.join(", ")}
                  </p>
                  <p>
                    <strong>Tools:</strong> {role.typicalTools?.join(", ")}
                  </p>
                  <p>
                    <strong>Industries:</strong> {role.industryFocus?.join(", ")}
                  </p>
                </>
              )}
              {isBridge && (
                <>
                  <p>
                    <strong>Path:</strong> {role.entryPath}
                  </p>
                  <p>
                    <strong>Skills to Acquire:</strong> {role.skillsToAcquire?.join(", ")}
                  </p>
                  <p>
                    <strong>Typical Titles:</strong> {role.typicalTitles?.join(", ")}
                  </p>
                </>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* Export Options */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <PDFDownloadButton />
        <SendEmailButton email={user.email} html={getResultHtml()} />
      </div>

      {/* Rating Component */}
      <Rating email={user.email} />

      {/* Calls to Action */}
      <section className="text-center space-y-4">
        <p className="text-lg font-medium">Next Steps:</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button asChild>
            <a href="/apply">🎓 Enroll in the GRC Class</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat" target="_blank" rel="noopener noreferrer">
              💬 Book Free GRC Advisor Chat
            </a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/resources">📚 Explore Free Resources</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
