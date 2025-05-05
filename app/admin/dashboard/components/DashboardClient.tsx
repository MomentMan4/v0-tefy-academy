"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import StatsCards from "./StatsCards"
import ChartPreview from "./ChartPreview"
import Table from "./Table"

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
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={statsData} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPreview
          title="Monthly Activity"
          description="Leads, assessments, and registrations by month"
          data={monthlyData}
          type="bar"
          dataKeys={["leads", "submissions", "registrations"]}
        />

        <ChartPreview
          title="Conversion Funnel"
          description="Leads to registrations conversion"
          data={conversionData}
          type="pie"
        />
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Recent Submissions</h3>
              <p className="text-sm text-gray-500">The latest assessment submissions</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/submissions">View all</Link>
            </Button>
          </div>

          {recentSubmissions && recentSubmissions.length > 0 ? (
            <Table data={recentSubmissions} columns={submissionsColumns} pagination={{ pageSize: 5 }} />
          ) : (
            <div className="text-center py-8">
              <BarChart className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No submissions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Submissions will appear here once users complete the assessment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
