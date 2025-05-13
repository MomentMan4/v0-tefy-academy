"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Info, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add detailed logging in development
const isDevEnvironment = process.env.NODE_ENV === "development"

export default function AdminLoginRedirect() {
  const [message, setMessage] = useState("Checking authentication status...")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(isDevEnvironment)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Add debug info helper function
  const addDebugInfo = (info: string) => {
    console.log(info)
    setDebugInfo((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${info}`])
  }

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        addDebugInfo(`Authentication check attempt ${retryCount + 1}`)

        // Check if we have a successful login flag
        const loginSuccess = localStorage.getItem("adminLoginSuccess")
        const loginTime = localStorage.getItem("adminLoginTime")

        if (loginSuccess === "true") {
          addDebugInfo("Login success flag found in localStorage")

          // Check if the login was recent (within the last 5 minutes)
          const loginTimeMs = Number.parseInt(loginTime || "0", 10)
          const isRecent = Date.now() - loginTimeMs < 5 * 60 * 1000 // 5 minutes

          if (isRecent) {
            // Clear the flag
            localStorage.removeItem("adminLoginSuccess")
            localStorage.removeItem("adminLoginTime")

            // Redirect to dashboard
            addDebugInfo("Redirecting to dashboard...")
            window.location.href = "/admin/dashboard"
            return
          } else {
            addDebugInfo("Login success flag is stale, checking session")
          }
        }

        // Get session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          addDebugInfo(`Session error: ${sessionError.message}`)
          throw new Error(`Authentication error: ${sessionError.message}`)
        }

        if (!session) {
          addDebugInfo("No session found")
          setMessage("No active session found. Redirecting to login...")

          // Redirect to login page
          setTimeout(() => {
            router.push("/auth/admin-login")
          }, 2000)
          return
        }

        addDebugInfo(`Session found for user: ${session.user.email}`)

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (adminError) {
          addDebugInfo(`Admin check error: ${adminError.message}`)

          if (adminError.code === "PGRST116") {
            addDebugInfo("User not found in admin_users table")
            throw new Error("You do not have admin privileges")
          } else {
            throw new Error(`Database error: ${adminError.message}`)
          }
        }

        if (!adminData) {
          addDebugInfo("User not found in admin_users table")
          throw new Error("You do not have admin privileges")
        }

        addDebugInfo("Admin user verified, redirecting to dashboard...")
        setMessage("Authentication successful. Redirecting to dashboard...")

        // Redirect to dashboard
        window.location.href = "/admin/dashboard"
      } catch (error: any) {
        console.error("Redirect error:", error)
        setError(error.message || "An error occurred")
        setMessage("Authentication failed")

        // Sign out on error
        try {
          await supabase.auth.signOut()
          addDebugInfo("Signed out due to error")
        } catch (signOutError) {
          addDebugInfo(`Error signing out: ${signOutError}`)
        }
      }
    }

    checkAuthAndRedirect()
  }, [router, supabase, retryCount])

  const handleRetry = () => {
    setError(null)
    setMessage("Retrying authentication check...")
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Authentication</CardTitle>
          <CardDescription>Checking your authentication status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Retry
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/auth/admin-login")}>
                    Return to Login
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
              </div>
              <p className="text-center">{message}</p>
            </>
          )}

          {showDebug && debugInfo.length > 0 && (
            <Alert className="bg-blue-50 border-blue-200 mt-4">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="text-xs font-mono text-blue-800 overflow-auto max-h-40">
                  {debugInfo.map((info, i) => (
                    <div key={i}>{info}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full flex justify-center mt-4">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-gray-600"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
