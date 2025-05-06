"use client"

import { useState } from "react"
import { BarChart, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StatsCards from "./StatsCards"
import ChartPreview from "./ChartPreview"
import Table from "./Table"
import PaymentMetricsCard from "./PaymentMetricsCard"

interface DashboardClientProps {
  statsData: any[]
  monthlyData: any[]
  conversionData: any[]
  paymentStatusData: any[]
  recentSubmissions: any[]
  recentPayments: any[]
  submissionsColumns: any[]
  paymentsColumns: any[]
  dailyPayments: {
    completed: number
    failed: number
    pending: number
    refunded: number
    total: number
  }
}

export default function DashboardClient({
  statsData,
  monthlyData,
  conversionData,
  paymentStatusData,
  recentSubmissions,
  recentPayments,
  submissionsColumns,
  paymentsColumns,
  dailyPayments,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards stats={statsData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPreview
              title="Monthly Activity"
              description="Submissions, leads, and registrations over time"
              data={monthlyData}
              type="bar"
              dataKeys={["leads", "submissions", "registrations", "payments"]}
            />

            <PaymentMetricsCard dailyPayments={dailyPayments} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <ChartPreview
              title="Monthly Activity"
              description="Detailed view of platform activity"
              data={monthlyData}
              type="line"
              dataKeys={["leads", "submissions", "registrations", "payments"]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                  <CardDescription>Overview of payment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPreview
                    title=""
                    description=""
                    data={paymentStatusData}
                    type="pie"
                    height={250}
                    colors={["#10b981", "#f59e0b", "#ef4444", "#3b82f6"]}
                  />
                </CardContent>
              </Card>

              <PaymentMetricsCard dailyPayments={dailyPayments} />
            </div>
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

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Distribution of payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPreview
                  title=""
                  description=""
                  data={paymentStatusData}
                  type="pie"
                  height={250}
                  colors={["#10b981", "#f59e0b", "#ef4444", "#3b82f6"]}
                />
              </CardContent>
            </Card>

            <PaymentMetricsCard dailyPayments={dailyPayments} />
          </div>

          {recentPayments && recentPayments.length > 0 ? (
            <Table columns={paymentsColumns} data={recentPayments} title="Recent Payments" />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No payments yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Payments will appear here once users complete transactions.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
