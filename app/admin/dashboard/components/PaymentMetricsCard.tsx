"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, MinusCircle } from "lucide-react"

interface PaymentMetric {
  status: string
  count: number
  percentage: number
  trend: "up" | "down" | "neutral"
  change: number
}

interface PaymentMetricsCardProps {
  dailyPayments: {
    completed: number
    failed: number
    pending: number
    refunded: number
    total: number
  }
}

export default function PaymentMetricsCard({ dailyPayments }: PaymentMetricsCardProps) {
  const [metrics, setMetrics] = useState<PaymentMetric[]>([
    { status: "Successful", count: 0, percentage: 0, trend: "neutral", change: 0 },
    { status: "Failed", count: 0, percentage: 0, trend: "neutral", change: 0 },
    { status: "Pending", count: 0, percentage: 0, trend: "neutral", change: 0 },
    { status: "Refunded", count: 0, percentage: 0, trend: "neutral", change: 0 },
  ])

  useEffect(() => {
    // Calculate percentages based on total payments
    const total = dailyPayments.total || 1 // Avoid division by zero

    const updatedMetrics: PaymentMetric[] = [
      {
        status: "Successful",
        count: dailyPayments.completed,
        percentage: Math.round((dailyPayments.completed / total) * 100),
        trend: "up", // This would ideally be calculated based on historical data
        change: 5, // This would ideally be calculated based on historical data
      },
      {
        status: "Failed",
        count: dailyPayments.failed,
        percentage: Math.round((dailyPayments.failed / total) * 100),
        trend: "down", // This would ideally be calculated based on historical data
        change: 2, // This would ideally be calculated based on historical data
      },
      {
        status: "Pending",
        count: dailyPayments.pending,
        percentage: Math.round((dailyPayments.pending / total) * 100),
        trend: "neutral", // This would ideally be calculated based on historical data
        change: 0, // This would ideally be calculated based on historical data
      },
      {
        status: "Refunded",
        count: dailyPayments.refunded,
        percentage: Math.round((dailyPayments.refunded / total) * 100),
        trend: "up", // This would ideally be calculated based on historical data
        change: 1, // This would ideally be calculated based on historical data
      },
    ]

    setMetrics(updatedMetrics)
  }, [dailyPayments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Payment Metrics</CardTitle>
        <CardDescription>Real-time payment performance for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.status} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-sm">{metric.status}</span>
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      metric.status === "Successful"
                        ? "bg-green-100 text-green-800"
                        : metric.status === "Failed"
                          ? "bg-red-100 text-red-800"
                          : metric.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {metric.count}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold">{metric.percentage}%</span>
                  <span
                    className={`ml-1 flex items-center text-xs ${
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : metric.trend === "down" ? (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <MinusCircle className="h-3 w-3 mr-0.5" />
                    )}
                    {metric.change > 0 ? `+${metric.change}%` : metric.change === 0 ? "0%" : `${metric.change}%`}
                  </span>
                </div>
              </div>
              <Progress
                value={metric.percentage}
                className={`h-2 ${
                  metric.status === "Successful"
                    ? "bg-green-100"
                    : metric.status === "Failed"
                      ? "bg-red-100"
                      : metric.status === "Pending"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                }`}
                indicatorClassName={
                  metric.status === "Successful"
                    ? "bg-green-500"
                    : metric.status === "Failed"
                      ? "bg-red-500"
                      : metric.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
