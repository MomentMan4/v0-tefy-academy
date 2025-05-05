import questions from "@/data/questions"
import GRC_ROLES from "@/data/roles"
import BRIDGE_ROLES from "@/data/bridgeRoles"

export interface ScoringResult {
  finalScore: number
  matchedRoles: any[]
  isBridge: boolean
  radarScores: { skill: string; value: number }[]
  skillBreakdown: { category: string; score: number; description: string }[]
  recommendedCertifications: string[]
  careerPathSuggestion: string
}

const skillDimensions = {
  Tech: [5, 7, 8],
  Compliance: [9, 10, 12],
  People: [13, 14, 15],
  Risk: [2, 4, 11],
  Process: [6, 17, 18],
}

const skillDescriptions = {
  Tech: "Your ability to understand and work with technical tools and platforms used in GRC.",
  Compliance: "Your aptitude for understanding and applying regulatory frameworks and standards.",
  People: "Your communication and collaboration skills essential for cross-functional GRC work.",
  Risk: "Your capacity to identify, assess, and mitigate various types of organizational risks.",
  Process: "Your ability to document, implement, and improve structured processes and controls.",
}

// Common certifications relevant to GRC roles
const commonCertifications = [
  "CISA (Certified Information Systems Auditor)",
  "CRISC (Certified in Risk and Information Systems Control)",
  "ISO 27001 Lead Implementer",
  "CISSP (Certified Information Systems Security Professional)",
  "CISM (Certified Information Security Manager)",
]

function calculateRadarScores(userAnswers: number[]): { skill: string; value: number }[] {
  const result: { skill: string; value: number }[] = []

  for (const [skill, indices] of Object.entries(skillDimensions)) {
    const total = indices.reduce((sum, i) => {
      const questionIndex = i - 1
      const questionWeight = questions[questionIndex]?.weight || 1
      return sum + userAnswers[questionIndex] * questionWeight
    }, 0)

    const max = indices.reduce((sum, i) => {
      const questionIndex = i - 1
      const questionWeight = questions[questionIndex]?.weight || 1
      return sum + 5 * questionWeight
    }, 0)

    const score = Math.round((total / max) * 100)
    result.push({ skill, value: score })
  }

  return result
}

function generateSkillBreakdown(
  radarScores: { skill: string; value: number }[],
): { category: string; score: number; description: string }[] {
  return radarScores.map(({ skill, value }) => ({
    category: skill,
    score: value,
    description: skillDescriptions[skill as keyof typeof skillDescriptions] || "",
  }))
}

function getRecommendedCertifications(finalScore: number, radarScores: { skill: string; value: number }[]): string[] {
  // Get top 2 skills
  const topSkills = [...radarScores]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((s) => s.skill)

  // Recommend certifications based on score and top skills
  const recommendations: string[] = []

  if (topSkills.includes("Compliance")) {
    recommendations.push("CISA (Certified Information Systems Auditor)")
    recommendations.push("ISO 27001 Lead Implementer")
  }

  if (topSkills.includes("Risk")) {
    recommendations.push("CRISC (Certified in Risk and Information Systems Control)")
  }

  if (finalScore >= 80) {
    recommendations.push("CISSP (Certified Information Systems Security Professional)")
  }

  if (topSkills.includes("Process")) {
    recommendations.push("CISM (Certified Information Security Manager)")
  }

  // Ensure we have at least 2 recommendations
  while (recommendations.length < 2) {
    const randomCert = commonCertifications[Math.floor(Math.random() * commonCertifications.length)]
    if (!recommendations.includes(randomCert)) {
      recommendations.push(randomCert)
    }
  }

  return recommendations.slice(0, 3) // Return top 3 recommendations
}

function getCareerPathSuggestion(finalScore: number, isBridge: boolean, matchedRoles: any[]): string {
  if (isBridge) {
    return `Based on your assessment, we recommend starting with a bridge role like ${matchedRoles[0]?.title || "Compliance Assistant"} to build foundational skills, then progressing to a full GRC role within 1-2 years.`
  }

  if (finalScore >= 85) {
    return `You show strong alignment with GRC roles. Consider starting as a ${matchedRoles[0]?.title || "GRC Analyst"} with potential to advance to senior positions within 2-3 years.`
  }

  if (finalScore >= 70) {
    return `You have good potential for GRC roles. We recommend starting as a ${matchedRoles[0]?.title || "GRC Analyst"} and focusing on strengthening your skills in ${matchedRoles[0]?.skillsNeeded?.[0] || "compliance"}.`
  }

  return "Consider building experience in entry-level compliance or administrative roles while developing your GRC knowledge through training and certifications."
}

export function calculateAssessmentResult(answers: number[]): ScoringResult {
  const actualScore = answers.reduce((sum, score, idx) => {
    const questionWeight = questions[idx]?.weight || 1
    return sum + score * questionWeight
  }, 0)

  const maxPossibleScore = questions.reduce((sum, q) => sum + 5 * q.weight, 0)
  const finalScore = Math.round((actualScore / maxPossibleScore) * 100)

  // Calculate radar scores
  const radarScores = calculateRadarScores(answers)

  // Generate skill breakdown with descriptions
  const skillBreakdown = generateSkillBreakdown(radarScores)

  let matchedRoles = []
  let isBridge = false

  if (finalScore < 70) {
    matchedRoles = BRIDGE_ROLES.map((role) => ({
      ...role,
      matchPercent: Math.min(100, Math.round((finalScore / 70) * 100)),
    }))
    isBridge = true
  } else {
    // Get matches based on scoreThreshold proximity
    matchedRoles = GRC_ROLES.filter((role) => role.scoreThreshold <= finalScore)
      .map((role) => ({
        ...role,
        matchPercent: Math.round((finalScore / role.scoreThreshold) * 100),
      }))
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 3)
  }

  // Get recommended certifications based on score and skills
  const recommendedCertifications = getRecommendedCertifications(finalScore, radarScores)

  // Generate career path suggestion
  const careerPathSuggestion = getCareerPathSuggestion(finalScore, isBridge, matchedRoles)

  return {
    finalScore,
    matchedRoles,
    isBridge,
    radarScores,
    skillBreakdown,
    recommendedCertifications,
    careerPathSuggestion,
  }
}
