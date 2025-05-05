import { redirect } from "next/navigation"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default function AdminLoginRedirect() {
  // Use a server-side redirect
  return redirect("/auth/admin-login")
}
