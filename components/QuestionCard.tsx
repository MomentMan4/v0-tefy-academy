"use client"

import { Card } from "@/components/ui/card"

interface QuestionCardProps {
  question: string
  tooltip?: string
  selected: number
  onSelect: (value: number) => void
}

const options = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
]

export default function QuestionCard({ question, tooltip, selected, onSelect }: QuestionCardProps) {
  return (
    <Card className="p-6 space-y-4 shadow-lg">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{question}</h2>
        {tooltip && <p className="text-sm text-muted-foreground italic">{tooltip}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
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
