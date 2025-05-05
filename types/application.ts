export interface Application {
  id: string
  name: string
  email: string
  phone?: string
  completed: boolean
  step: number
  converted?: boolean
  conversion_date?: string
  last_followup?: string
  created_at: string
  updated_at: string
}

export type ApplicationInsert = Omit<Application, "id" | "created_at" | "updated_at">
