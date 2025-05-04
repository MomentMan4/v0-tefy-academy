"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { calculateAssessmentResult } from "@/lib/assessment/logic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ResultsClient() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; industry: string } | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{
    finalScore: number
    matchedRoles: any[]
    isBridge: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get user info from localStorage
      const storedUserInfo = localStorage.getItem("assessment-user")
      const storedAnswers = localStorage.getItem("assessment-answers")

      if (!storedUserInfo || !storedAnswers) {
        setError("Assessment data not found. Please retake the assessment.")
        setIsLoading(false)
        return
      }

      const parsedUserInfo = JSON.parse(storedUserInfo)
      const parsedAnswers = JSON.parse(storedAnswers)

      setUserInfo(parsedUserInfo)
      setAnswers(parsedAnswers)

      // Calculate results
      const assessmentResult = calculateAssessmentResult(parsedAnswers)
      setResult(assessmentResult)

      // Log to Supabase
      if (parsedUserInfo && assessmentResult) {
        const roleNames = assessmentResult.matchedRoles.map((role) => role.title)
        logAssessmentToSupabase({
          name: parsedUserInfo.name,
          email: parsedUserInfo.email,
          industry: parsedUserInfo.industry,
          score: assessmentResult.finalScore,
          roles: roleNames,
          isBridge: assessmentResult.isBridge,
        })
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error loading assessment results:", err)
      setError("An error occurred while loading your results. Please try again.")
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-lg">Loading your results...</p>
      </div>
    )
  }

  if (error || !result || !userInfo) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <p className="text-lg text-red-500">{error || "Unable to load results"}</p>
        <Button asChild>
          <a href="/assessment">Retake Assessment</a>
        </Button>
      </div>
    )
  }

  const { finalScore, matchedRoles, isBridge } = result
  const topRoleNames = matchedRoles.map((role) => role.title)

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8" id="assessment-result-pdf">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your GRC Career Assessment Results</h1>
        <p className="text-muted-foreground">
          Based on your responses, here&apos;s how you align with cybersecurity GRC roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your GRC Readiness Score: {finalScore}%</CardTitle>
          <CardDescription className="text-center">
            {finalScore >= 80
              ? "Excellent match! You're well-positioned for GRC roles."
              : finalScore >= 70
                ? "Strong match! You have good alignment with GRC careers."
                : "You have potential! Consider bridge roles to build relevant experience."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResultChart answers={answers} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {isBridge ? "Recommended Bridge Roles" : "Your Top Role Matches"}
            </h2>
            <div className="space-y-6">
              {matchedRoles.map((role, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-lg font-medium">{role.title}</h3>
                  <p className="text-muted-foreground mt-1">{role.description}</p>
                  {!isBridge && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Skills Needed:</p>
                        <ul className="list-disc ml-5">
                          {role.skillsNeeded.map((skill: string, i: number) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Typical Salary Range:</p>
                        <p>{role.salaryRange}</p>
                        <p className="font-medium mt-2">Recommended Certifications:</p>
                        <p>{role.recommendedCerts.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {isBridge && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Typical Career Path:</p>
                      <p>{role.entryPath}</p>
                      <p className="font-medium mt-2">Skills to Develop:</p>
                      <ul className="list-disc ml-5">
                        {role.skillsToAcquire.map((skill: string, i: number) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <PDFDownloadButton />
        <SendEmailButton email={userInfo.email} name={userInfo.name} topRoles={topRoleNames} />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Ready to Take the Next Step?</h2>
        <p className="mb-4">
          Our 5-week GRC Program will help you build the skills needed for these roles, regardless of your starting
          point.
        </p>
        <Button asChild size="lg">
          <a href="/apply">Apply for the Program</a>
        </Button>
      </div>

      <Rating email={userInfo.email} />
    </div>
  )
}
