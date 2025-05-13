"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function TroubleshootPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/diagnostic")
      if (!response.ok) {
        throw new Error(`Diagnostic API returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setDiagnosticData(data)
    } catch (err: any) {
      setError(err.message || "Failed to run diagnostics")
      console.error("Diagnostic error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Troubleshooting</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
          <CardDescription>
            View detailed information about your session, environment, and authentication status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={runDiagnostics} disabled={loading} variant="outline">
              {loading ? "Running..." : "Run Diagnostics"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>
          )}

          {diagnosticData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Session Information</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(diagnosticData.session, null, 2)}
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Admin Status</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(diagnosticData.adminCheck, null, 2)}
                </pre>
                {diagnosticData.adminCheckError && (
                  <div className="mt-2">
                    <h4 className="font-medium text-red-600">Admin Check Error:</h4>
                    <pre className="bg-red-50 p-4 rounded overflow-auto max-h-40">
                      {JSON.stringify(diagnosticData.adminCheckError, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Environment Information</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(diagnosticData.environment, null, 2)}
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Cookie Information</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(diagnosticData.cookieInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
          <CardDescription>Troubleshooting steps for common admin access problems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Database Connection Errors</h3>
              <p className="text-gray-600 mb-2">If you're seeing "Failed to fetch" or database connection errors:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify your network connection is stable</li>
                <li>Check that Supabase is operational</li>
                <li>Ensure your browser isn't blocking the connection</li>
                <li>Try clearing your browser cache and cookies</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg">Authentication Issues</h3>
              <p className="text-gray-600 mb-2">If you're having trouble logging in:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirm you're using the correct email and password</li>
                <li>Check if your admin account exists in the database</li>
                <li>Try logging out completely and logging back in</li>
                <li>Ensure cookies are enabled in your browser</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg">Permission Denied Errors</h3>
              <p className="text-gray-600 mb-2">If you're seeing permission or access denied errors:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verify your account has admin privileges</li>
                <li>Check if your session is valid and not expired</li>
                <li>Ensure the admin_users table contains your account</li>
                <li>Try logging out and logging back in to refresh your session</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
