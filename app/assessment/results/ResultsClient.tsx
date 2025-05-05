"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { calculateAssessmentResult, type ScoringResult } from "@/lib/assessment/logic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2, Award, ChevronRight, Briefcase, HelpCircle } from "lucide-react"
import ResultChart from "@/components/ResultChart"
import SendEmailButton from "@/components/SendEmailButton"
import Rating from "@/components/Rating"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Define the schema version we expect
const SCHEMA_VERSION = 2 // Increment this when schema changes

// Define the expected columns for the submissions table
const EXPECTED_COLUMNS = {
  basic: ["name", "email", "industry", "score", "roles", "is_bridge"],
  extended: ["radar_scores", "skill_breakdown", "recommended_certifications", "career_path_suggestion"],
}

// Function to safely log assessment data to Supabase
async function logAssessmentToSupabase({
  name,
  email,
  industry,
  score,
  roles,
  isBridge,
  radarScores,
  skillBreakdown,
  recommendedCertifications,
  careerPathSuggestion,
}: {
  name: string
  email: string
  industry: string
  score: number
  roles: string[]
  isBridge: boolean
  radarScores: { skill: string; value: number }[]
  skillBreakdown: { category: string; score: number; description: string }[]
  recommendedCertifications: string[]
  careerPathSuggestion?: string
}) {
  try {
    console.log("Logging assessment to Supabase...")

    // Create base submission object with required fields
    const baseSubmission = {
      name,
      email,
      industry,
      score,
      roles,
      is_bridge: isBridge,
    }

    // Try to insert with all fields first
    try {
      const fullSubmission = {
        ...baseSubmission,
        radar_scores: radarScores,
        skill_breakdown: skillBreakdown,
        recommended_certifications: recommendedCertifications,
        career_path_suggestion: careerPathSuggestion,
      }

      const { error } = await supabase.from("submissions").insert(fullSubmission)

      // If successful, we're done
      if (!error) {
        console.log("Successfully logged assessment with all fields")
        return
      }

      // If there's an error, log it and try the fallback approach
      console.warn("Full submission failed, trying fallback approach:", error.message)
    } catch (error) {
      console.warn("Error during full submission, trying fallback approach:", error)
    }

    // Fallback: Try to insert just the base data
    try {
      const { error: baseError } = await supabase.from("submissions").insert(baseSubmission)

      if (baseError) {
        console.error("Base Supabase logging failed:", baseError.message)

        // If even the basic insert fails, try to diagnose the issue
        if (baseError.message.includes("duplicate key")) {
          console.log("This appears to be a duplicate submission. Attempting update instead.")

          // Try to update an existing record instead
          const { error: updateError } = await supabase
            .from("submissions")
            .update(baseSubmission)
            .eq("email", email)
            .is("score", null) // Only update if score is null (incomplete record)

          if (updateError) {
            console.error("Update of existing record also failed:", updateError.message)
          } else {
            console.log("Successfully updated existing record with base data")
          }
        }

        return // Stop if we can't even insert the basic data
      }

      console.log("Successfully inserted base submission data")
    } catch (baseInsertError) {
      console.error("Critical error during base data insertion:", baseInsertError)
      return
    }

    // If we get here, the base data was inserted successfully
    // Now try to add the extended fields one by one using upsert
    // This is safer than update because it will work even if the record was just created

    try {
      // Prepare extended data object
      const extendedData: Record<string, any> = {
        email, // Include email for matching
      }

      // Add each extended field if it exists
      if (radarScores) extendedData.radar_scores = radarScores
      if (skillBreakdown) extendedData.skill_breakdown = skillBreakdown
      if (recommendedCertifications) extendedData.recommended_certifications = recommendedCertifications
      if (careerPathSuggestion) extendedData.career_path_suggestion = careerPathSuggestion

      // Use upsert to add extended fields
      const { error: extendedError } = await supabase.from("submissions").upsert(extendedData, {
        onConflict: "email",
        ignoreDuplicates: false, // Update the record if it exists
      })

      if (extendedError) {
        console.warn("Extended fields upsert failed:", extendedError.message)

        // If upsert fails, try individual updates for each field
        await tryIndividualFieldUpdates(email, {
          radar_scores: radarScores,
          skill_breakdown: skillBreakdown,
          recommended_certifications: recommendedCertifications,
          career_path_suggestion: careerPathSuggestion,
        })
      } else {
        console.log("Successfully added extended fields")
      }
    } catch (extendedError) {
      console.warn("Error during extended fields update:", extendedError)

      // Try individual updates as a last resort
      await tryIndividualFieldUpdates(email, {
        radar_scores: radarScores,
        skill_breakdown: skillBreakdown,
        recommended_certifications: recommendedCertifications,
        career_path_suggestion: careerPathSuggestion,
      })
    }
  } catch (error) {
    console.error("Unexpected error logging assessment:", error)
  }
}

// Helper function to try updating fields individually
async function tryIndividualFieldUpdates(email: string, fields: Record<string, any>) {
  for (const [field, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue

    try {
      const updateData: Record<string, any> = { [field]: value }
      const { error } = await supabase.from("submissions").update(updateData).eq("email", email)

      if (error) {
        console.warn(`Failed to update ${field}:`, error.message)
      } else {
        console.log(`Successfully updated ${field}`)
      }
    } catch (error) {
      console.warn(`Error updating ${field}:`, error)
    }
  }
}

export default function ResultsClient() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; industry: string } | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [dbWarning, setDbWarning] = useState<string | null>(null)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  useEffect(() => {
    const loadResults = async () => {
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

        // Store data in window for PDF generation
        if (typeof window !== "undefined") {
          window.assessmentRolesData = assessmentResult.matchedRoles
          window.assessmentRadarData = assessmentResult.radarScores
          window.assessmentSkillBreakdown = assessmentResult.skillBreakdown
          window.assessmentRecommendedCertifications = assessmentResult.recommendedCertifications
          window.assessmentCareerPathSuggestion = assessmentResult.careerPathSuggestion
          window.assessmentUserInfo = parsedUserInfo
          window.assessmentScore = assessmentResult.finalScore
        }

        // Log to Supabase
        if (parsedUserInfo && assessmentResult) {
          const roleNames = assessmentResult.matchedRoles.map((role) => role.title)

          try {
            await logAssessmentToSupabase({
              name: parsedUserInfo.name,
              email: parsedUserInfo.email,
              industry: parsedUserInfo.industry,
              score: assessmentResult.finalScore,
              roles: roleNames,
              isBridge: assessmentResult.isBridge,
              radarScores: assessmentResult.radarScores,
              skillBreakdown: assessmentResult.skillBreakdown,
              recommendedCertifications: assessmentResult.recommendedCertifications,
              careerPathSuggestion: assessmentResult.careerPathSuggestion,
            })
          } catch (dbError) {
            console.error("Database logging error:", dbError)
            setDbWarning("Your results were saved with limited information due to a database issue.")
            // Continue with the assessment results display even if logging fails
          }
        }
      } catch (err) {
        console.error("Error loading assessment results:", err)
        setError("An error occurred while loading your results. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <p className="mt-8 text-muted-foreground">Loading your results...</p>
      </div>
    )
  }

  if (error || !result || !userInfo) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error || "Unable to load your assessment results"}</p>
          <Button asChild>
            <Link href="/assessment">Retake Assessment</Link>
          </Button>
        </div>
        <div className="text-muted-foreground">
          <p>If this issue persists, please contact our support team.</p>
        </div>
      </div>
    )
  }

  const {
    finalScore,
    matchedRoles,
    isBridge,
    radarScores,
    skillBreakdown,
    recommendedCertifications,
    careerPathSuggestion,
    methodologyDescription,
  } = result
  const topRoleNames = matchedRoles.slice(0, 3).map((role) => role.title)

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8" id="assessment-result-pdf">
      <div className="flex items-center justify-between">
        <Link href="/assessment" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={16} className="mr-1" /> Back to Assessment
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            try {
              if (navigator.share && typeof navigator.share === "function") {
                navigator
                  .share({
                    title: "My GRC Assessment Results",
                    text: `I scored ${finalScore}% on the TEFY GRC Assessment!`,
                    url: window.location.href,
                  })
                  .catch((error) => {
                    console.log("Error sharing:", error)
                    // Fallback for when sharing fails
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href)
                      alert("Link copied to clipboard!")
                    }
                  })
              } else {
                // Fallback for browsers that don't support sharing
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copied to clipboard!")
                }
              }
            } catch (error) {
              console.error("Share error:", error)
              // Ultimate fallback
              alert("Copy this link to share: " + window.location.href)
            }
          }}
        >
          <Share2 size={14} /> Share
        </Button>
      </div>

      {/* Database warning message if there was an issue */}
      {dbWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
          <p>{dbWarning}</p>
        </div>
      )}

      {/* User info for PDF (hidden in UI) */}
      <div className="hidden" data-user-info>
        <h2>Assessment Results for {userInfo.name}</h2>
        <p>Email: {userInfo.email}</p>
        <p>Industry: {userInfo.industry}</p>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your GRC Career Assessment Results</h1>
        <p className="text-muted-foreground">
          Based on your responses, here&apos;s how you align with cybersecurity GRC roles
        </p>
      </div>

      {/* Score card that appears at the top */}
      <Card className="border-2 border-primary/20 bg-primary/5 relative">
        {/* Tooltip positioned in the top-right corner */}
        <div className="absolute top-4 right-4">
          <TooltipProvider>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  className="text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  type="button"
                  aria-label="Show methodology information"
                  onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                >
                  <HelpCircle size={16} />
                  <span className="sr-only">Methodology information</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 text-sm bg-white border shadow-lg rounded-md" sideOffset={5}>
                {methodologyDescription}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CardContent className="pt-6">
          <div className="text-center" data-user-score>
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Award size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">{finalScore}%</h2>
            <p className="text-lg font-medium mt-1">
              {finalScore >= 80 ? "Excellent Match" : finalScore >= 70 ? "Strong Match" : "Potential Match"}
            </p>
            <p className="text-muted-foreground mt-1">
              {finalScore >= 80
                ? "You're well-positioned for GRC roles"
                : finalScore >= 70
                  ? "You have good alignment with GRC careers"
                  : "Consider bridge roles to build relevant experience"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Profile</TabsTrigger>
          <TabsTrigger value="roles">Recommended Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Your GRC Readiness Assessment</CardTitle>
              <CardDescription>This chart shows your overall alignment with key GRC competency areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResultChart answers={answers} />

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
                <h3 className="font-medium mb-2">What does this score mean?</h3>
                <p className="text-sm">
                  Your GRC Readiness Score reflects your alignment with key skills and attributes needed for success in
                  Governance, Risk, and Compliance roles. A higher score indicates stronger natural alignment with GRC
                  career paths.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Career Path Suggestion */}
          <Card className="border-2 border-indigo-100 bg-indigo-50">
            <CardHeader>
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <Briefcase size={20} />
                Career Path Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700">{careerPathSuggestion}</p>
            </CardContent>
          </Card>

          {/* Dynamic Role Display for scores above 70% */}
          {finalScore >= 70 && !isBridge && (
            <Card className="border-2 border-green-100 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Your Top Role Matches</CardTitle>
                <CardDescription>Based on your assessment, these roles align well with your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedRoles.slice(0, 3).map((role, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{role.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{role.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => setActiveTab("roles")}>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <SendEmailButton
              email={userInfo.email}
              name={userInfo.name}
              topRoles={topRoleNames}
              score={finalScore}
              radarScores={radarScores}
              skillBreakdown={skillBreakdown}
              recommendedCertifications={recommendedCertifications}
              careerPathSuggestion={careerPathSuggestion}
            />
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your GRC Strength Profile</CardTitle>
              <CardDescription>This breakdown shows your strengths across key GRC skill dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-medium">Skill Breakdown</h3>
                {skillBreakdown.map((skill) => (
                  <div key={skill.category} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-lg">{skill.category}</h4>
                      <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {skill.score}%
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{skill.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isBridge ? "Recommended Bridge Roles" : "Your Top Role Matches"}</CardTitle>
              <CardDescription>
                {isBridge
                  ? "These roles can help you build experience toward a full GRC position"
                  : "Based on your assessment, these roles align well with your profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Display only the top 3 roles based on match percentage */}
                {matchedRoles.slice(0, 3).map((role, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:border-primary/50 transition-colors hover-lift"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{role.title}</h3>
                        {!isBridge && (
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {role.matchPercent}% Match
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">{role.description}</p>
                    {!isBridge && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="font-medium text-primary mb-3">Skills Needed:</p>
                          <ul className="list-disc ml-5 space-y-1">
                            {role.skillsNeeded.map((skill: string, i: number) => (
                              <li key={i}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="font-medium text-primary mb-2">Typical Salary Range:</p>
                          <p className="mb-4">{role.salaryRange}</p>
                          <p className="font-medium text-primary mb-2">Recommended Certifications:</p>
                          <p>{role.recommendedCerts.join(", ")}</p>
                        </div>
                      </div>
                    )}
                    {isBridge && (
                      <div className="mt-4 text-sm bg-gray-50 p-4 rounded-md">
                        <p className="font-medium text-primary mb-2">Typical Career Path:</p>
                        <p>{role.entryPath}</p>
                        <p className="font-medium text-primary mt-3 mb-1">Skills to Develop:</p>
                        <ul className="list-disc ml-5 space-y-1">
                          {role.skillsToAcquire.map((skill: string, i: number) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="mt-8 text-center space-y-6">
        <h2 className="text-xl font-semibold">Ready to Take the Next Step?</h2>
        <p className="text-muted-foreground">
          Our 5-week GRC Program will help you build the skills needed for these roles, regardless of your starting
          point.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link href="/apply">Apply for the Program</Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Talk to a GRC Advisor
            </a>
          </Button>
        </div>
      </div>

      <Rating email={userInfo.email} />
    </div>
  )
}
