"use client"

import { useEffect, useState, useRef } from "react"
import {
  RadarChart,
  BarChart,
  Radar,
  Bar,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

export default function SkillsRadarChart({ data }: { data: { skill: string; value: number }[] }) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const [useSimpleChart, setUseSimpleChart] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chartAttempts = useRef(0)

  // Ensure data is valid
  const validData =
    Array.isArray(data) && data.length > 0
      ? data.map((item) => ({
          skill: item.skill || "Unknown",
          value: typeof item.value === "number" ? item.value : 0,
        }))
      : [
          { skill: "Tech", value: 50 },
          { skill: "Process", value: 50 },
          { skill: "People", value: 50 },
          { skill: "Compliance", value: 50 },
          { skill: "Risk", value: 50 },
        ]

  // Store data in window for PDF generation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.assessmentRadarData = validData
    }
  }, [validData])

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
        <h3 className="text-center mb-4 font-medium">Your Skills Profile</h3>
        {validData.map((item) => (
          <div key={item.skill} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.skill}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chartError || useSimpleChart) {
    return <div className="w-full h-auto min-h-[300px] border rounded-md bg-white">{renderSimpleChart()}</div>
  }

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-muted/20 animate-pulse rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-80 border rounded-md p-4 bg-white">
      {/* Fallback content that will always be rendered but hidden when chart works */}
      <div className="absolute opacity-0">{renderSimpleChart()}</div>

      <ResponsiveContainer width="100%" height="100%">
        {isMobile ? (
          <BarChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="skill" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Bar dataKey="value" name="Skill Level" fill="#6366f1" />
          </BarChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={validData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Radar name="Skill Level" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
