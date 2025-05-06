"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import Link from "next/link"

interface StatsCardProps {
  title: string
  value: number | string
  description: string
  change?: {
    value: number
    trend: "up" | "down"
  }
  link?: string
}

function StatsCard({ title, value, description, change, link }: StatsCardProps) {
  const CardWrapper = link ? Link : React.Fragment
  const wrapperProps = link ? { href: link, className: "block transition-all hover:scale-[1.01]" } : {}

  return (
    <CardWrapper {...wrapperProps}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {change && (
            <div className="mt-1 flex items-center text-xs">
              {change.trend === "up" ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={change.trend === "up" ? "text-green-500" : "text-red-500"}>
                {change.value}% from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  )
}

export default function StatsCards({ stats }: { stats: StatsCardProps[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
