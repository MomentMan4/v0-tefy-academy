"use client"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin/dashboard"
  const supabase = createClientSupabaseClient()

  // Check if user is already logged in and is an admin
  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setDebugInfo(`Session found for user: ${session.user.email}`)

          // Check if user is an admin
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", session.user.email)
            .single()

          if (!adminError && adminData) {
            setDebugInfo(`Admin user verified: ${session.user.email}`)
            // User is an admin, redirect to dashboard
            router.push("/admin/dashboard")
            return
          }

          setDebugInfo(`Not an admin user: ${session.user.email}`)
          // User is not an admin, sign them out
          await supabase.auth.signOut()
        } else {
          setDebugInfo("No session found")
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setDebugInfo(`Error checking session: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      setDebugInfo(`Attempting login for: ${email}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setDebugInfo(`Login error: ${error.message}`)
        throw error
      }

      if (data?.user) {
        setDebugInfo(`Login successful for: ${data.user.email}`)

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", data.user.email)
          .single()

        if (adminError) {
          setDebugInfo(`Admin check error: ${adminError.message}`)
          // If not an admin, sign them out
          await supabase.auth.signOut()
          throw new Error("You do not have admin privileges")
        }

        if (!adminData) {
          setDebugInfo(`Not an admin user: ${data.user.email}`)
          // If not an admin, sign them out
          await supabase.auth.signOut()
          throw new Error("You do not have admin privileges")
        }

        setDebugInfo(`Admin verified, redirecting to: ${redirectedFrom}`)
        // Redirect to admin dashboard or the page they were trying to access
        router.push(redirectedFrom)
        router.refresh()
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
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      setResetSent(true)
    } catch (error: any) {
      setResetError(error.message || "An error occurred sending the reset link")
    } finally {
      setResetLoading(false)
    }
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
                    <Button type="submit" className="w-full" disabled={resetLoading}>
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
                  <span>{error}</span>
                </div>
              )}

              {debugInfo && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600 mr-2" />
                  <AlertDescription className="text-blue-800 text-xs">{debugInfo}</AlertDescription>
                </Alert>
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
              <Button type="submit" className="w-full" disabled={loading}>
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
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
