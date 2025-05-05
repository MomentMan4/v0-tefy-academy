import type { ReactNode } from "react"

interface AdminHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export default function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
