interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = (current / total) * 100

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        Question {current} of {total}
      </p>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
