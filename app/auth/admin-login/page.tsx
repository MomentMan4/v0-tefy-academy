"use client"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientSupabaseClient, clearClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, RefreshCw, Wifi, WifiOff } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add detailed logging in development
const isDevEnvironment = process.env.NODE_ENV === "development"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [resetSent, setResetSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(isDevEnvironment)
  const [sessionCheckAttempts, setSessionCheckAttempts] = useState(0)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [runningDiagnostics, setRunningDiagnostics] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline" | "checking">("checking")
  const [supabaseReachable, setSupabaseReachable] = useState<boolean | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin/dashboard"
  const errorParam = searchParams.get("error")

  // Initialize Supabase client
  const supabase = createClientSupabaseClient()

  // Add debug info helper function
  const addDebugInfo = (info: string) => {
    if (isDevEnvironment || showDebug) {
      console.log(info)
      setDebugInfo((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${info}`])
    }
  }

  // Check network connectivity
  useEffect(() => {
    const checkNetwork = async () => {
      setNetworkStatus("checking")

      // First check if browser is online
      const isOnline = navigator.onLine
      if (!isOnline) {
        setNetworkStatus("offline")
        addDebugInfo("Browser reports network is offline")
        return
      }

      // Then check if we can reach Supabase
      try {
        addDebugInfo("Checking Supabase connectivity...")

        // Try to ping the Supabase health endpoint
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl) {
          throw new Error("Supabase URL is not defined")
        }

        // Use a simple health check endpoint
        const healthUrl = `${supabaseUrl}/rest/v1/`
        const response = await fetch(healthUrl, {
          method: "HEAD",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          },
          // Short timeout to avoid long waits
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          setSupabaseReachable(true)
          setNetworkStatus("online")
          addDebugInfo("Supabase is reachable")
        } else {
          setSupabaseReachable(false)
          setNetworkStatus("online") // Browser is online but Supabase returned an error
          addDebugInfo(`Supabase returned status: ${response.status}`)
        }
      } catch (error: any) {
        setSupabaseReachable(false)
        setNetworkStatus("online") // Browser is online but we can't reach Supabase
        addDebugInfo(`Failed to reach Supabase: ${error.message || "Unknown error"}`)

        // Add more detailed error info
        if (error.name === "AbortError") {
          addDebugInfo("Request timed out after 5 seconds")
        } else if (error.name === "TypeError" && error.message === "Failed to fetch") {
          addDebugInfo("Network request failed completely - possible CORS or network issue")
        }
      }
    }

    checkNetwork()

    // Also listen for online/offline events
    const handleOnline = () => {
      addDebugInfo("Browser went online")
      checkNetwork()
    }

    const handleOffline = () => {
      addDebugInfo("Browser went offline")
      setNetworkStatus("offline")
      setSupabaseReachable(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Run diagnostics
  const runDiagnostics = async () => {
    setRunningDiagnostics(true)
    try {
      addDebugInfo("Running diagnostics...")
      const response = await fetch("/api/admin/diagnostic/auth-check")
      if (!response.ok) {
        throw new Error(`Diagnostic API returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setDiagnosticData(data)
      addDebugInfo("Diagnostics completed")
    } catch (error: any) {
      addDebugInfo(`Diagnostic error: ${error.message}`)
    } finally {
      setRunningDiagnostics(false)
    }
  }

  // Test Supabase connection directly
  const testSupabaseConnection = async () => {
    try {
      addDebugInfo("Testing direct Supabase connection...")

      // First check if the URL and key are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        addDebugInfo(`Missing configuration: URL=${!!supabaseUrl}, Key=${!!supabaseKey}`)
        return
      }

      // Try a simple health check
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: supabaseKey,
        },
      })

      addDebugInfo(`Supabase health check status: ${response.status}`)

      // Try to get the Supabase version
      const versionResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
        },
      })

      if (versionResponse.ok) {
        const serverInfo = await versionResponse.json()
        addDebugInfo(`Supabase server info: ${JSON.stringify(serverInfo)}`)
      } else {
        addDebugInfo(`Failed to get Supabase server info: ${versionResponse.status}`)
      }
    } catch (error: any) {
      addDebugInfo(`Supabase connection test failed: ${error.message}`)

      // Add more detailed error diagnostics
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        addDebugInfo("NETWORK ERROR: This typically indicates one of the following issues:")
        addDebugInfo("1. CORS policy blocking the request")
        addDebugInfo("2. Network connectivity issues")
        addDebugInfo("3. Supabase service is down")
        addDebugInfo("4. Firewall or security software blocking the request")
      }
    }
  }

  // Handle URL error parameters
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "session_error":
          setError("Session error occurred. Please try logging in again.")
          break
        case "admin_check_failed":
          setError("Failed to verify admin status. Please contact support.")
          break
        case "not_admin":
          setError("You do not have admin privileges.")
          break
        case "server_error":
          setError("A server error occurred. Please try again later.")
          break
        default:
          setError(`Error: ${errorParam}`)
      }
    }
  }, [errorParam])

  // Check if user is already logged in and is an admin
  useEffect(() => {
    async function checkSession() {
      try {
        addDebugInfo(`Checking session (attempt ${sessionCheckAttempts + 1})...`)

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          addDebugInfo(`Session error: ${sessionError.message}`)
          throw sessionError
        }

        if (session) {
          addDebugInfo(`Session found for user: ${session.user.email}`)

          // Check if user is an admin
          try {
            const { data: adminData, error: adminError } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", session.user.email)
              .single()

            if (adminError) {
              addDebugInfo(`Admin check error: ${adminError.message}`)

              if (adminError.code === "PGRST116") {
                addDebugInfo("User not found in admin_users table")
                // Sign out the user if they're not an admin
                await supabase.auth.signOut()
                setError("You do not have admin privileges.")
              } else {
                // Other database error
                setError(`Database error: ${adminError.message}`)

                // Add more detailed diagnostics for fetch errors
                if (adminError.message.includes("Failed to fetch")) {
                  addDebugInfo("Network error detected - checking connectivity...")
                  await testSupabaseConnection()
                }
              }
            } else if (adminData) {
              addDebugInfo(`Admin user verified: ${session.user.email}`)
              // User is an admin, redirect to dashboard
              window.location.href = redirectedFrom
              return
            } else {
              addDebugInfo(`Not an admin user: ${session.user.email}`)
              // User is not an admin, sign them out
              await supabase.auth.signOut()
              setError("You do not have admin privileges.")
            }
          } catch (adminCheckError: any) {
            addDebugInfo(`Error during admin check: ${adminCheckError.message}`)

            // Special handling for network errors
            if (adminCheckError.message.includes("fetch") || adminCheckError.name === "TypeError") {
              setError(`Network error: ${adminCheckError.message}. Please check your connection.`)
              await testSupabaseConnection()
            } else {
              setError(`Error checking admin status: ${adminCheckError.message}`)
            }
          }
        } else {
          addDebugInfo("No session found")
        }
      } catch (error: any) {
        console.error("Error checking session:", error)
        addDebugInfo(`Error checking session: ${error.message || String(error)}`)

        // Special handling for network errors
        if (error.message?.includes("fetch") || error.name === "TypeError") {
          setError(`Network error: ${error.message}. Please check your connection.`)
          await testSupabaseConnection()
        } else {
          setError("Error checking session. Please try again.")
        }
      } finally {
        setCheckingSession(false)
      }
    }

    if (checkingSession) {
      checkSession()
      setSessionCheckAttempts((prev) => prev + 1)
    }
  }, [supabase, redirectedFrom, checkingSession, sessionCheckAttempts])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo([])

    try {
      addDebugInfo(`Attempting login for: ${email}`)

      // First, check if we can reach Supabase
      if (networkStatus === "offline" || supabaseReachable === false) {
        throw new Error("Cannot connect to the database. Please check your network connection and try again.")
      }

      // First, check if the user exists in the admin_users table
      try {
        const { data: adminCheck, error: adminCheckError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email.trim())
          .single()

        if (adminCheckError) {
          addDebugInfo(`Admin check error: ${adminCheckError.message}`)

          if (adminCheckError.code === "PGRST116") {
            throw new Error("You do not have admin privileges")
          } else {
            // Special handling for network errors
            if (adminCheckError.message.includes("Failed to fetch")) {
              addDebugInfo("Network error detected during admin check")
              await testSupabaseConnection()
              throw new Error(
                `Network error: Cannot connect to the database. Please check your connection and try again.`,
              )
            } else {
              throw new Error(`Database error: ${adminCheckError.message}`)
            }
          }
        }

        if (!adminCheck) {
          addDebugInfo("User not found in admin_users table")
          throw new Error("You do not have admin privileges")
        }

        addDebugInfo(`Admin user found in database: ${email}`)
      } catch (error: any) {
        // If this is a network error, provide more helpful information
        if (error.message.includes("Failed to fetch")) {
          addDebugInfo("Network error during admin check")
          await testSupabaseConnection()
          throw new Error("Cannot connect to the database. Please check your network connection and try again.")
        } else {
          throw error
        }
      }

      // Clear any existing sessions to prevent conflicts
      await supabase.auth.signOut()
      addDebugInfo("Cleared existing sessions")

      // Reset the client to ensure a fresh state
      clearClientSupabaseClient()
      const freshClient = createClientSupabaseClient()
      addDebugInfo("Created fresh Supabase client")

      // Now attempt to sign in
      try {
        const { data, error } = await freshClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          addDebugInfo(`Login error: ${error.message}`)
          throw error
        }

        if (data?.user) {
          addDebugInfo(`Login successful for: ${data.user.email}`)
          addDebugInfo(`Session created: ${!!data.session}`)

          if (data.session) {
            addDebugInfo(`Session expires at: ${new Date(data.session.expires_at! * 1000).toISOString()}`)
          }

          // Store a flag in localStorage to indicate successful login
          localStorage.setItem("adminLoginSuccess", "true")
          localStorage.setItem("adminLoginTime", Date.now().toString())

          // Force a hard navigation instead of client-side routing
          addDebugInfo(`Redirecting to: ${redirectedFrom}`)
          window.location.href = redirectedFrom
          return
        } else {
          addDebugInfo("No user data returned from login")
          throw new Error("Login failed. Please try again.")
        }
      } catch (error: any) {
        // If this is a network error, provide more helpful information
        if (error.message.includes("Failed to fetch")) {
          addDebugInfo("Network error during login")
          await testSupabaseConnection()
          throw new Error(
            "Cannot connect to the authentication service. Please check your network connection and try again.",
          )
        } else {
          throw error
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)

    try {
      addDebugInfo(`Attempting password reset for: ${resetEmail}`)

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        addDebugInfo(`Reset error: ${error.message}`)
        throw error
      }

      addDebugInfo("Reset email sent successfully")
      setResetSent(true)
    } catch (error: any) {
      setResetError(error.message || "An error occurred sending the reset link")
    } finally {
      setResetLoading(false)
    }
  }

  const retrySessionCheck = () => {
    setCheckingSession(true)
    setError(null)
  }

  // Show loading state while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Checking session...</p>

            {networkStatus === "offline" && (
              <div className="mt-4 flex items-center justify-center text-amber-600">
                <WifiOff className="h-4 w-4 mr-2" />
                <p className="text-sm">You appear to be offline. Please check your internet connection.</p>
              </div>
            )}

            {networkStatus === "online" && supabaseReachable === false && (
              <div className="mt-4 flex items-center justify-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-sm">Cannot connect to the database. Please try again later.</p>
              </div>
            )}

            {sessionCheckAttempts > 1 && (
              <div className="mt-4">
                <p className="text-sm text-amber-600">Session check taking longer than expected.</p>
              </div>
            )}

            {sessionCheckAttempts > 2 && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setCheckingSession(false)}>
                Skip check
              </Button>
            )}

            {showDebug && debugInfo.length > 0 && (
              <div className="mt-4 text-left bg-gray-50 p-2 rounded text-xs font-mono overflow-auto max-h-40">
                {debugInfo.map((info, i) => (
                  <div key={i} className="text-gray-700">
                    {info}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-32 h-12 relative mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png"
              alt="TEFY Digital Academy"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>

          {/* Network status indicator */}
          <div className="flex items-center mt-2">
            {networkStatus === "online" && supabaseReachable === true && (
              <div className="flex items-center text-green-600 text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                <span>Connected to database</span>
              </div>
            )}
            {networkStatus === "online" && supabaseReachable === false && (
              <div className="flex items-center text-amber-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Cannot connect to database</span>
              </div>
            )}
            {networkStatus === "offline" && (
              <div className="flex items-center text-red-600 text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                <span>You are offline</span>
              </div>
            )}
            {networkStatus === "checking" && (
              <div className="flex items-center text-gray-400 text-xs">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                <span>Checking connection...</span>
              </div>
            )}
          </div>
        </CardHeader>

        {showResetForm ? (
          <>
            {resetSent ? (
              <CardContent className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Password reset link has been sent to your email. Please check your inbox.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowResetForm(false)
                    setResetSent(false)
                    setResetEmail("")
                  }}
                >
                  Back to Login
                </Button>
              </CardContent>
            ) : (
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  {resetError && (
                    <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-700 text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{resetError}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button type="submit" className="w-full" disabled={resetLoading || networkStatus === "offline"}>
                      {resetLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => setShowResetForm(false)}>
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span>{error}</span>
                    {error.includes("Failed to fetch") ||
                    error.includes("Network error") ||
                    error.includes("connect to the database") ? (
                      <div className="mt-2 text-sm">
                        <p>This could be due to:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Network connectivity issues</li>
                          <li>Supabase service being temporarily unavailable</li>
                          <li>Firewall or security settings blocking the connection</li>
                        </ul>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-red-700 hover:text-red-800 hover:bg-red-100 p-0"
                          onClick={testSupabaseConnection}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" /> Test connection
                        </Button>
                      </div>
                    ) : (
                      error.includes("session") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-7 text-red-700 hover:text-red-800 hover:bg-red-100 p-0"
                          onClick={retrySessionCheck}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" /> Retry session check
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading || networkStatus === "offline" || (networkStatus === "online" && supabaseReachable === false)
                }
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowResetForm(true)}
                >
                  Forgot your password?
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 pt-0">
              <div className="text-xs text-muted-foreground text-center">
                <p>If you're having trouble logging in, please contact the administrator.</p>
                <p className="mt-1">Make sure you have been granted admin access to the system.</p>
              </div>

              <div className="w-full flex justify-center mt-4">
                <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                </button>
              </div>

              {showDebug && (
                <div className="mt-2 text-left bg-gray-50 p-2 rounded text-xs font-mono overflow-auto max-h-60">
                  <div className="font-semibold mb-1">Environment: {process.env.NODE_ENV}</div>
                  <div className="font-semibold mb-1">
                    Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing"}
                  </div>
                  <div className="font-semibold mb-1">
                    Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing"}
                  </div>
                  <div className="font-semibold mb-1">
                    Network Status: {networkStatus} | Supabase Reachable:{" "}
                    {supabaseReachable === null ? "Unknown" : supabaseReachable ? "Yes" : "No"}
                  </div>

                  <div className="flex justify-between items-center mt-2 mb-1">
                    <span className="font-semibold">Debug Log:</span>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testSupabaseConnection}
                        className="h-6 text-xs py-0 px-2"
                      >
                        Test Connection
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={runDiagnostics}
                        disabled={runningDiagnostics}
                        className="h-6 text-xs py-0 px-2"
                      >
                        {runningDiagnostics ? "Running..." : "Run Diagnostics"}
                      </Button>
                    </div>
                  </div>

                  {debugInfo.map((info, i) => (
                    <div key={i} className="text-gray-700">
                      {info}
                    </div>
                  ))}

                  {diagnosticData && (
                    <div className="mt-4 border-t pt-2">
                      <div className="font-semibold mb-1">Diagnostic Results:</div>
                      <pre className="text-xs overflow-auto">{JSON.stringify(diagnosticData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
