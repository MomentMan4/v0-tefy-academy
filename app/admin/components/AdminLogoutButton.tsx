"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push("/auth/admin-login")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center text-gray-600 hover:text-primary disabled:opacity-50"
    >
      <LogOut className="h-5 w-5 mr-3" />
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </button>
  )
}
