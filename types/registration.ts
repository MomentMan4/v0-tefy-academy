export interface Registration {
  id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  program: string
  cohort?: string
  has_internship: boolean
  payment_id: string
  payment_status: string
  payment_amount: number
  payment_date: string
  source?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type RegistrationInsert = Omit<Registration, "id" | "created_at" | "updated_at">
