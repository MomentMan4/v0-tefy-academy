"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3, Users, FileText, CreditCard, Star } from "lucide-react"
import Link from "next/link"

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  icon?: React.ElementType
  link?: string
}

export default function StatsCards({ stats }: { stats: StatCardProps[] }) {
  // Map of icons to use if not provided
  const defaultIcons: Record<string, React.ElementType> = {
    "Total Submissions": FileText,
    Applications: Users,
    Registrations: CreditCard,
    "Average Rating": Star,
    default: BarChart3,
  }

  // Ensure stats is an array before mapping
  const statsArray = Array.isArray(stats) ? stats : []

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsArray.map((stat, i) => {
        const Icon = stat.icon || defaultIcons[stat.title] || defaultIcons.default

        // Determine trend color and icon
        let trendColor = "text-gray-500"
        let TrendIcon = null

        if (stat.change) {
          if (stat.change.trend === "up") {
            trendColor = "text-emerald-500"
            TrendIcon = ArrowUp
          } else if (stat.change.trend === "down") {
            trendColor = "text-red-500"
            TrendIcon = ArrowDown
          }
        }

        const card = (
          <Card key={i} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                {stat.change && (
                  <div className={`flex items-center ${trendColor} text-xs font-medium`}>
                    {TrendIcon && <TrendIcon className="h-3 w-3 mr-1" />}
                    {stat.change.value}%
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

        // If there's a link, wrap the card in a Link component
        if (stat.link) {
          return (
            <Link href={stat.link} key={i} className="transition-transform hover:scale-[1.02]">
              {card}
            </Link>
          )
        }

        return card
      })}
    </div>
  )
}
