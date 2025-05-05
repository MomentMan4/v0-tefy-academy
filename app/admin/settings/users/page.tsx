"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminUsersPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add admin user")
      }

      setSuccess(`Admin user ${email} added successfully`)
      setEmail("")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        <p className="text-muted-foreground">Manage admin users who can access the dashboard</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Admin User</CardTitle>
          <CardDescription>
            Add a new admin user by email. The user must already have an account in the system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAddAdmin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 p-3 rounded-md flex items-start space-x-2 text-green-700 text-sm">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{success}</span>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Admin User"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AdminUsersList />
    </div>
  )
}

function AdminUsersList() {
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  useState(() => {
    async function fetchAdminUsers() {
      try {
        const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setAdminUsers(data || [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminUsers()
  }, [])

  if (loading) {
    return <div>Loading admin users...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Admin Users</CardTitle>
      </CardHeader>
      <CardContent>
        {adminUsers.length === 0 ? (
          <p className="text-muted-foreground">No admin users found</p>
        ) : (
          <ul className="space-y-2">
            {adminUsers.map((user) => (
              <li key={user.id} className="flex justify-between items-center p-2 border-b">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                </div>
                <p className="text-xs text-muted-foreground">Added: {new Date(user.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
