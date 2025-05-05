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
  methodologyDescription: string
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

function calculateRoleMatchScore(
  radarScores: { skill: string; value: number }[],
  role: any,
  finalScore: number,
): number {
  // Create a map of the user's skill scores for easy lookup
  const userSkillMap = radarScores.reduce(
    (map, skill) => {
      map[skill.skill] = skill.value
      return map
    },
    {} as Record<string, number>,
  )

  // Calculate weighted score based on role's skill weights
  let weightedScore = 0
  let totalWeight = 0

  // If role has skillWeights, use them for precise matching
  if (role.skillWeights) {
    for (const [skill, weight] of Object.entries(role.skillWeights)) {
      const userSkillScore = userSkillMap[skill] || 0
      weightedScore += userSkillScore * (weight as number)
      totalWeight += weight as number
    }

    // Normalize to ensure weights sum to 1
    if (totalWeight > 0) {
      weightedScore = weightedScore / totalWeight
    }
  } else {
    // Fallback to simple average if no weights defined
    weightedScore = radarScores.reduce((sum, skill) => sum + skill.value, 0) / radarScores.length
  }

  // Calculate base match percentage based on how the user's score compares to the role threshold
  const thresholdFactor = finalScore / (role.scoreThreshold || 70)

  // Combine weighted skill score (70% weight) with threshold factor (30% weight)
  const matchScore = weightedScore * 0.7 + thresholdFactor * 100 * 0.3

  // Ensure match percentage is between 60% and 100%
  return Math.max(60, Math.min(100, Math.round(matchScore)))
}

function generateMethodologyDescription(): string {
  return "Our role matching algorithm analyzes your assessment responses across five key skill dimensions: Technical Knowledge, Process Management, People Skills, Compliance Aptitude, and Risk Assessment. Each role has specific skill weightings that reflect its requirements. Your match percentage represents how well your skill profile aligns with each role's unique demands."
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

  // Generate methodology description
  const methodologyDescription = generateMethodologyDescription()

  let matchedRoles = []
  let isBridge = false

  if (finalScore < 70) {
    // For bridge roles, calculate match percentages
    matchedRoles = BRIDGE_ROLES.map((role) => {
      // Calculate a match percentage based on how the user's score compares to a bridge threshold (60%)
      const bridgeThreshold = 60
      const matchPercent = Math.min(100, Math.round((finalScore / bridgeThreshold) * 100))

      return {
        ...role,
        matchPercent,
      }
    }).sort((a, b) => b.matchPercent - a.matchPercent)

    isBridge = true
  } else {
    // For regular GRC roles, calculate match scores based on skill alignment
    matchedRoles = GRC_ROLES.map((role) => {
      const matchPercent = calculateRoleMatchScore(radarScores, role, finalScore)

      return {
        ...role,
        matchPercent,
      }
    }).sort((a, b) => b.matchPercent - a.matchPercent)
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
    methodologyDescription,
  }
}
