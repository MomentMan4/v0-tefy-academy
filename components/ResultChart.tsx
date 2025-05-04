"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface ResultChartProps {
  answers: number[] // array of 20 scores (1–5)
}

export default function ResultChart({ answers }: ResultChartProps) {
  const groupScores = {
    Tech: average(answers.slice(4, 8)),
    Process: average(answers.slice(0, 4).concat(answers.slice(9, 12))),
    People: average(answers.slice(12, 16)),
    Compliance: average([8, 9, 10].map((i) => answers[i] || 0)),
    Risk: average([7, 11, 19].map((i) => answers[i] || 0)),
  }

  const data = Object.entries(groupScores).map(([domain, value]) => ({
    domain,
    score: Math.round(value * 20), // convert to 0–100 scale
  }))

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-md shadow">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="domain" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function average(values: number[]): number {
  if (!values.length) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}
