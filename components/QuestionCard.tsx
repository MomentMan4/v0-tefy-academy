"use client"

import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import type { QuestionOption } from "@/data/questions"

interface QuestionCardProps {
  question: string
  tooltip?: string
  options: QuestionOption[]
  selected: number
  onSelect: (value: number) => void
}

export default function QuestionCard({ question, tooltip, options, selected, onSelect }: QuestionCardProps) {
  return (
    <Card className="p-6 space-y-4 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{question}</h2>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground">
                    <HelpCircle size={16} />
                    <span className="sr-only">More information</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 text-center">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`rounded-md border p-3 text-sm ${
              selected === opt.value ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => onSelect(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
