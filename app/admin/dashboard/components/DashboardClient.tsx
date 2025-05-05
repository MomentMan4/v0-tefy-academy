"use client"

import { useState } from "react"
import { BarChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StatsCards from "./StatsCards"
import ChartPreview from "./ChartPreview"
import Table from "./Table"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface DashboardClientProps {
  statsData: any[]
  monthlyData: any[]
  conversionData: any[]
  recentSubmissions: any[]
  submissionsColumns: any[]
}

export default function DashboardClient({
  statsData,
  monthlyData,
  conversionData,
  recentSubmissions,
  submissionsColumns,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  // Handle export data
  const handleExportData = () => {
    // Create CSV content
    const headers = submissionsColumns.map((col) => col.header).join(",")
    const rows = recentSubmissions
      .map((row) =>
        submissionsColumns
          .map((col) => {
            const value = typeof row[col.key] === "string" ? `"${row[col.key]}"` : row[col.key]
            return value
          })
          .join(","),
      )
      .join("\n")

    const csvContent = `${headers}\n${rows}`

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `dashboard-data-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards stats={statsData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPreview
              title="Monthly Activity"
              description="Submissions, leads, and registrations over time"
              data={monthlyData}
              type="bar"
            />

            <ChartPreview
              title="Conversion Funnel"
              description="Leads to registrations conversion"
              data={conversionData}
              type="pie"
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <ChartPreview
              title="Monthly Activity"
              description="Detailed view of platform activity"
              data={monthlyData}
              type="line"
            />
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {recentSubmissions && recentSubmissions.length > 0 ? (
            <Table columns={submissionsColumns} data={recentSubmissions} title="Recent Submissions" />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BarChart className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No submissions yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Submissions will appear here once users complete the assessment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
