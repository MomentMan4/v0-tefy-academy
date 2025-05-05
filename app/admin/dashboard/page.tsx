import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminHeader from "../components/AdminHeader"
import DashboardClient from "./components/DashboardClient"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

// Function to get dashboard stats
async function getDashboardStats() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch stats data with error handling
    const [submissionsResult, applicationsResult, registrationsResult] = await Promise.all([
      supabase.from("submissions").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("registrations").select("*", { count: "exact", head: true }),
    ])

    // Get recent submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError)
      throw new Error("Failed to fetch recent submissions")
    }

    // Calculate average rating (mock data for now)
    const averageRating = "4.2"

    return {
      stats: {
        submissions: submissionsResult.count || 0,
        applications: applicationsResult.count || 0,
        registrations: registrationsResult.count || 0,
        averageRating,
      },
      recentSubmissions: submissions || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return fallback data
    return {
      stats: {
        submissions: 0,
        applications: 0,
        registrations: 0,
        averageRating: "0.0",
      },
      recentSubmissions: [],
    }
  }
}

// Function to get monthly data
async function getMonthlyData() {
  try {
    // For now, we'll generate some sample data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    const monthlyData = months.map((month) => {
      return {
        name: month,
        leads: Math.floor(Math.random() * 50) + 10,
        submissions: Math.floor(Math.random() * 40) + 5,
        registrations: Math.floor(Math.random() * 20) + 2,
      }
    })

    return monthlyData
  } catch (error) {
    console.error("Error fetching monthly data:", error)
    return [
      { name: "Jan", leads: 0, submissions: 0, registrations: 0 },
      { name: "Feb", leads: 0, submissions: 0, registrations: 0 },
      { name: "Mar", leads: 0, submissions: 0, registrations: 0 },
      { name: "Apr", leads: 0, submissions: 0, registrations: 0 },
      { name: "May", leads: 0, submissions: 0, registrations: 0 },
      { name: "Jun", leads: 0, submissions: 0, registrations: 0 },
    ]
  }
}

export default async function AdminDashboardPage() {
  // Fetch data on the server
  const dashboardData = await getDashboardStats()
  const monthlyData = await getMonthlyData()

  // Prepare stats for StatsCards component
  const statsData = [
    {
      title: "Total Submissions",
      value: dashboardData.stats.submissions,
      description: "Users who finished the assessment",
      change: { value: 12, trend: "up" as const },
      link: "/admin/submissions",
    },
    {
      title: "Applications",
      value: dashboardData.stats.applications,
      description: "Pre-assessment captured leads",
      change: { value: 8, trend: "up" as const },
      link: "/admin/leads",
    },
    {
      title: "Registrations",
      value: dashboardData.stats.registrations,
      description: "Paid program enrollments",
      change: { value: 5, trend: "up" as const },
      link: "/admin/registrations",
    },
    {
      title: "Average Rating",
      value: dashboardData.stats.averageRating,
      description: "Out of 5 stars",
      change: { value: 2, trend: "up" as const },
      link: "/admin/ratings",
    },
  ]

  // Prepare data for pie chart
  const conversionData = [
    { name: "Leads", value: dashboardData.stats.applications },
    { name: "Assessments", value: dashboardData.stats.submissions },
    { name: "Registrations", value: dashboardData.stats.registrations },
  ]

  // Prepare columns for recent submissions table
  const submissionsColumns = [
    { key: "email", header: "Email", sortable: true },
    { key: "score", header: "Score", sortable: true },
    {
      key: "created_at",
      header: "Date",
      cell: (row: any) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Overview of your TEFY Academy platform"
        action={
          <Button asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
        }
      />

      <Suspense fallback={<div>Loading dashboard data...</div>}>
        <DashboardClient
          statsData={statsData}
          monthlyData={monthlyData}
          conversionData={conversionData}
          recentSubmissions={dashboardData.recentSubmissions}
          submissionsColumns={submissionsColumns}
        />
      </Suspense>
    </div>
  )
}
