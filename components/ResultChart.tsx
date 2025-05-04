"use client"

import { useEffect, useState, useRef } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"

interface ResultChartProps {
  answers: number[] // array of 20 scores (1–5)
}

export default function ResultChart({ answers }: ResultChartProps) {
  const [mounted, setMounted] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [useSimpleChart, setUseSimpleChart] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartAttempts = useRef(0)

  // Ensure answers is valid
  const validAnswers = Array.isArray(answers) && answers.length > 0 ? answers : Array(20).fill(3)

  const groupScores = {
    Tech: average(validAnswers.slice(4, 8)),
    Process: average(validAnswers.slice(0, 4).concat(validAnswers.slice(9, 12))),
    People: average(validAnswers.slice(12, 16)),
    Compliance: average([8, 9, 10].map((i) => validAnswers[i] || 0)),
    Risk: average([7, 11, 19].map((i) => validAnswers[i] || 0)),
  }

  const data = Object.entries(groupScores).map(([domain, value]) => ({
    domain,
    score: Math.round(value * 20), // convert to 0–100 scale
  }))

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      setMounted(true)

      const checkMobile = () => setIsMobile(window.innerWidth < 640)
      checkMobile()

      window.addEventListener("resize", checkMobile)

      // Try to render the chart multiple times
      const attemptRenderChart = () => {
        if (chartAttempts.current >= 5) {
          console.log("Maximum chart render attempts reached, using simple chart")
          setUseSimpleChart(true)
          return
        }

        chartAttempts.current += 1
        console.log(`Chart render attempt ${chartAttempts.current}`)

        if (containerRef.current) {
          // Force a reflow
          const height = containerRef.current.offsetHeight
          containerRef.current.style.height = `${height + 1}px`
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.height = `${height}px`
            }
          }, 0)
        }
      }

      // Initial attempt
      attemptRenderChart()

      // Additional attempts with increasing delays
      const timers = [
        setTimeout(attemptRenderChart, 500),
        setTimeout(attemptRenderChart, 1500),
        setTimeout(attemptRenderChart, 3000),
        setTimeout(attemptRenderChart, 6000),
      ]

      return () => {
        window.removeEventListener("resize", checkMobile)
        timers.forEach((timer) => clearTimeout(timer))
      }
    } catch (error) {
      console.error("Error in chart initialization:", error)
      setChartError("Failed to initialize chart. Using simplified version.")
      setUseSimpleChart(true)
    }
  }, [])

  // Fallback chart when Recharts fails
  const renderSimpleChart = () => {
    return (
      <div className="w-full h-full flex flex-col p-4">
        <h3 className="text-center mb-4 font-medium">Your Assessment Results</h3>
        {data.map((item) => (
          <div key={item.domain} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.domain}</span>
              <span className="font-medium">{item.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chartError || useSimpleChart) {
    return <div className="h-[300px] w-full bg-white p-4 rounded-md shadow">{renderSimpleChart()}</div>
  }

  if (!mounted) {
    return (
      <div className="h-[300px] w-full bg-white p-4 rounded-md shadow flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-[300px] w-full bg-white p-4 rounded-md shadow">
      {/* Fallback content that will always be rendered but hidden when chart works */}
      <div className="absolute opacity-0">{renderSimpleChart()}</div>

      <ResponsiveContainer width="100%" height="100%">
        {isMobile ? (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="domain" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Bar dataKey="score" name="Score" fill="#6366f1" />
          </BarChart>
        ) : (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="domain" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

function average(values: number[]): number {
  if (!values.length) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}
