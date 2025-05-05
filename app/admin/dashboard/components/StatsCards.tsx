"use client"

import Link from "next/link"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number | string
  description: string
  change?: {
    value: number
    trend: "up" | "down"
  }
  link?: string
}

export default function StatsCards({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-medium text-gray-500">{stat.title}</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stat.value}</span>
                {stat.change && (
                  <div
                    className={`flex items-center text-sm ${
                      stat.change.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change.trend === "up" ? (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    )}
                    {stat.change.value}%
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">{stat.description}</span>
              {stat.link && (
                <Link href={stat.link} className="text-xs text-blue-500 hover:underline mt-2 inline-block">
                  View details
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
