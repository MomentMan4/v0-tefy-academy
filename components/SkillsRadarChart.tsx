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
  const containerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      setMounted(true)

      const checkMobile = () => setIsMobile(window.innerWidth < 640)
      checkMobile()

      window.addEventListener("resize", checkMobile)

      // Force a redraw after a short delay to ensure the chart renders
      const timer = setTimeout(() => {
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
      }, 500)

      return () => {
        window.removeEventListener("resize", checkMobile)
        clearTimeout(timer)
      }
    } catch (error) {
      console.error("Error in chart initialization:", error)
      setChartError("Failed to initialize chart. Please refresh the page.")
    }
  }, [])

  // Fallback chart when Recharts fails
  const renderFallbackChart = () => {
    return (
      <div className="w-full h-full flex flex-col">
        <h3 className="text-center mb-4">Your Skills Profile</h3>
        {validData.map((item) => (
          <div key={item.skill} className="mb-3">
            <div className="flex justify-between mb-1">
              <span>{item.skill}</span>
              <span>{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chartError) {
    return <div className="w-full h-80 border rounded-md p-4 bg-white">{renderFallbackChart()}</div>
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
      <div className="absolute opacity-0">{renderFallbackChart()}</div>

      <ResponsiveContainer width="100%" height="100%">
        {isMobile ? (
          <BarChart data={validData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="skill" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Bar dataKey="value" name="Skill Level" fill="#8884d8" />
          </BarChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={validData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
            <Legend />
            <Radar name="Skill Level" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
