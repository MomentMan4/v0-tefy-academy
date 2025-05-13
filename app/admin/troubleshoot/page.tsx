"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, Info, RefreshCw, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AdminTroubleshootPage() {
  const [loading, setLoading] = useState(true)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [adminCheckData, setAdminCheckData] = useState<any>(null)
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null)
  const [runningDiagnostics, setRunningDiagnostics] = useState(false)
  const [issues, setIssues] = useState<{ issue: string; solution: string; status: "ok" | "error" | "warning" }[]>([])

  const supabase = createClientSupabaseClient()

  // Run initial diagnostics
  useEffect(() => {
    runDiagnostics()
  }, [])

  // Run diagnostics
  const runDiagnostics = async () => {
    setLoading(true)
    setRunningDiagnostics(true)
    setDiagnosticError(null)
    setSessionError(null)
    setAdminCheckError(null)
    setIssues([])

    try {
      // Check client-side session
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        setSessionData(session)
        setSessionError(error?.message || null)

        if (session) {
          // Check admin status
          try {
            const { data, error: adminError } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", session.user.email)
              .single()

            setAdminCheckData(data)
            setAdminCheckError(adminError?.message || null)
          } catch (error: any) {
            setAdminCheckError(error.message || "Unknown error checking admin status")
          }
        }
      } catch (error: any) {
        setSessionError(error.message || "Unknown error getting session")
      }

      // Call diagnostic API
      try {
        const response = await fetch("/api/admin/diagnostic/auth-check")
        if (!response.ok) {
          throw new Error(`Diagnostic API returned ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setDiagnosticData(data)
      } catch (error: any) {
        setDiagnosticError(error.message || "Unknown error running diagnostics")
      }
    } catch (error: any) {
      setDiagnosticError(error.message || "Unknown error running diagnostics")
    } finally {
      setLoading(false)
      setRunningDiagnostics(false)
      analyzeIssues()
    }
  }

  // Analyze issues based on diagnostic data
  const analyzeIssues = () => {
    const newIssues: { issue: string; solution: string; status: "ok" | "error" | "warning" }[] = []

    // Check environment variables
    if (diagnosticData?.environment) {
      if (!diagnosticData.environment.SUPABASE_URL_SET) {
        newIssues.push({
          issue: "Supabase URL is not set",
          solution: "Add NEXT_PUBLIC_SUPABASE_URL to your environment variables",
          status: "error",
        })
      }
      if (!diagnosticData.environment.ANON_KEY_SET) {
        newIssues.push({
          issue: "Supabase Anon Key is not set",
          solution: "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables",
          status: "error",
        })
      }
      if (!diagnosticData.environment.SERVICE_ROLE_KEY_SET) {
        newIssues.push({
          issue: "Supabase Service Role Key is not set",
          solution: "Add SUPABASE_SERVICE_ROLE_KEY to your environment variables",
          status: "warning",
        })
      }
    }

    // Check session
    if (!sessionData && !diagnosticData?.session) {
      newIssues.push({
        issue: "No active session found",
        solution: "Try logging in again",
        status: "error",
      })
    } else if (sessionData && !diagnosticData?.session) {
      newIssues.push({
        issue: "Session found on client but not on server",
        solution: "This could indicate a cookie issue. Try clearing cookies and logging in again",
        status: "error",
      })
    } else if (!sessionData && diagnosticData?.session) {
      newIssues.push({
        issue: "Session found on server but not on client",
        solution: "This could indicate a client-side issue. Try refreshing the page",
        status: "error",
      })
    }

    // Check admin status
    if (sessionData && !adminCheckData) {
      newIssues.push({
        issue: "User is not an admin",
        solution: "Add the user to the admin_users table in the database",
        status: "error",
      })
    }

    // Check cookies
    if (diagnosticData?.cookieInfo && diagnosticData.cookieInfo.count === 0) {
      newIssues.push({
        issue: "No cookies found",
        solution: "This could indicate a cookie issue. Check browser settings and try logging in again",
        status: "error",
      })
    }

    // If no issues found and we have a session and admin status, add a success message
    if (newIssues.length === 0 && sessionData && adminCheckData) {
      newIssues.push({
        issue: "Authentication is working correctly",
        solution: "No action needed",
        status: "ok",
      })
    }

    setIssues(newIssues)
  }

  // Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/auth/admin-login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Authentication Troubleshooting</CardTitle>
          <CardDescription>This page helps diagnose issues with admin authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Diagnostic Results</h2>
            <Button onClick={runDiagnostics} disabled={runningDiagnostics}>
              {runningDiagnostics ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Run Diagnostics
                </>
              )}
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Session Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sessionData ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>Session Found</AlertTitle>
                        <AlertDescription>
                          <div className="text-sm mt-2">
                            <p>User: {sessionData.user.email}</p>
                            {sessionData.expires_at && (
                              <p>Expires: {new Date(sessionData.expires_at * 1000).toLocaleString()}</p>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-red-50 border-red-200">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle>No Session Found</AlertTitle>
                        <AlertDescription>
                          {sessionError && <p className="text-sm mt-2">Error: {sessionError}</p>}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Admin Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {adminCheckData ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>Admin Access Confirmed</AlertTitle>
                        <AlertDescription>
                          <div className="text-sm mt-2">
                            <p>Email: {adminCheckData.email}</p>
                            <p>Role: {adminCheckData.role || "admin"}</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>Admin Access Not Confirmed</AlertTitle>
                        <AlertDescription>
                          {adminCheckError && <p className="text-sm mt-2">Error: {adminCheckError}</p>}
                          {!sessionData && <p className="text-sm mt-2">No session found to check admin status</p>}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Issues & Solutions</h3>
                {issues.length > 0 ? (
                  <div className="space-y-4">
                    {issues.map((issue, index) => (
                      <Alert
                        key={index}
                        className={`${
                          issue.status === "ok"
                            ? "bg-green-50 border-green-200"
                            : issue.status === "warning"
                              ? "bg-amber-50 border-amber-200"
                              : "bg-red-50 border-red-200"
                        }`}
                      >
                        {issue.status === "ok" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : issue.status === "warning" ? (
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertTitle>{issue.issue}</AlertTitle>
                        <AlertDescription>
                          <p className="text-sm mt-2">{issue.solution}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle>No Issues Detected</AlertTitle>
                    <AlertDescription>
                      <p className="text-sm mt-2">Run diagnostics to check for issues</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Raw Diagnostic Data</h3>
                {diagnosticError ? (
                  <Alert className="bg-red-50 border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle>Error Running Diagnostics</AlertTitle>
                    <AlertDescription>
                      <p className="text-sm mt-2">{diagnosticError}</p>
                    </AlertDescription>
                  </Alert>
                ) : diagnosticData ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(diagnosticData, null, 2)}</pre>
                  </div>
                ) : (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle>No Diagnostic Data</AlertTitle>
                    <AlertDescription>
                      <p className="text-sm mt-2">Run diagnostics to get data</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
