import questions from "@/data/questions"
import GRC_ROLES from "@/data/roles"
import BRIDGE_ROLES from "@/data/bridgeRoles"

interface ScoringResult {
  finalScore: number
  matchedRoles: any[]
  isBridge: boolean
  radarScores: { skill: string; value: number }[]
}

const skillDimensions = {
  Tech: [5, 7, 8],
  Compliance: [9, 10, 12],
  People: [13, 14, 15],
  Risk: [2, 4, 11],
  Process: [6, 17, 18],
}

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

export function calculateAssessmentResult(answers: number[]): ScoringResult {
  const actualScore = answers.reduce((sum, score, idx) => {
    const questionWeight = questions[idx]?.weight || 1
    return sum + score * questionWeight
  }, 0)

  const maxPossibleScore = questions.reduce((sum, q) => sum + 5 * q.weight, 0)
  const finalScore = Math.round((actualScore / maxPossibleScore) * 100)

  // Calculate radar scores
  const radarScores = calculateRadarScores(answers)

  if (finalScore < 70) {
    return {
      finalScore,
      matchedRoles: BRIDGE_ROLES,
      isBridge: true,
      radarScores,
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
    radarScores,
  }
}
