"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Check } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    // Check password strength
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    })
  }, [password])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Check password strength
    const isStrongPassword = Object.values(passwordStrength).every(Boolean)
    if (!isStrongPassword) {
      setError("Please ensure your password meets all the requirements")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth/admin-login")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "An error occurred updating your password")
    } finally {
      setLoading(false)
    }
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
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">Create a new password for your admin account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password has been successfully reset. Redirecting to login page...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword}>
              {error && (
                <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Password Requirements:</p>
                  <ul className="space-y-1 text-sm">
                    <li className={`flex items-center ${passwordStrength.length ? "text-green-600" : "text-gray-500"}`}>
                      <Check size={16} className="mr-2" />
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      <Check size={16} className="mr-2" />
                      At least one uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${passwordStrength.lowercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      <Check size={16} className="mr-2" />
                      At least one lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.number ? "text-green-600" : "text-gray-500"}`}>
                      <Check size={16} className="mr-2" />
                      At least one number
                    </li>
                    <li
                      className={`flex items-center ${passwordStrength.special ? "text-green-600" : "text-gray-500"}`}
                    >
                      <Check size={16} className="mr-2" />
                      At least one special character
                    </li>
                  </ul>
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? "Updating..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
