"use client"

import { useState } from "react"
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  // Handle tooltip for both click and hover
  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen)
  }

  return (
    <Card className="p-6 space-y-4 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{question}</h2>
          {tooltip && (
            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                    type="button"
                    aria-label="Show more information"
                    onClick={handleTooltipClick}
                    onTouchEnd={handleTooltipClick}
                  >
                    <HelpCircle size={16} />
                    <span className="sr-only">More information</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 text-sm bg-white border shadow-lg rounded-md" sideOffset={5}>
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 text-center">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`rounded-md border p-3 text-sm transition-colors ${
              selected === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
