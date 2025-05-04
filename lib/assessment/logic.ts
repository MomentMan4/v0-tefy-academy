import questions from "@/data/questions"
import GRC_ROLES from "@/data/roles"
import BRIDGE_ROLES from "@/data/bridgeRoles"

interface ScoringResult {
  finalScore: number
  matchedRoles: any[]
  isBridge: boolean
}

export function calculateAssessmentResult(answers: number[]): ScoringResult {
  const actualScore = answers.reduce((sum, score, idx) => {
    const questionWeight = questions[idx]?.weight || 1
    return sum + score * questionWeight
  }, 0)

  const maxPossibleScore = questions.reduce((sum, q) => sum + 5 * q.weight, 0)
  const finalScore = Math.round((actualScore / maxPossibleScore) * 100)

  if (finalScore < 70) {
    return {
      finalScore,
      matchedRoles: BRIDGE_ROLES,
      isBridge: true,
    }
  }

  // Get top 3 matches based on scoreThreshold proximity
  const matches = GRC_ROLES.filter((role) => role.scoreThreshold <= finalScore)
    .map((role) => ({
      ...role,
      matchPercent: Math.round((finalScore / role.scoreThreshold) * 100),
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3)

  return {
    finalScore,
    matchedRoles: matches,
    isBridge: false,
  }
}
