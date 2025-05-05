import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminHeader from "../components/AdminHeader"
import DashboardClient from "./components/DashboardClient"

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

    return {
      stats: {
        submissions: submissionsResult.count || 0,
        applications: applicationsResult.count || 0,
        registrations: registrationsResult.count || 0,
      },
      recentSubmissions: submissions || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

// Function to get monthly data
async function getMonthlyData() {
  try {
    // For now, we'll generate some sample data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const monthlyData = months.map((month, index) => {
      const randomLeads = Math.floor(Math.random() * 50) + 10
      const randomSubmissions = Math.floor(Math.random() * randomLeads)
      const randomRegistrations = Math.floor(Math.random() * randomSubmissions)

      return {
        name: month,
        leads: randomLeads,
        submissions: randomSubmissions,
        registrations: randomRegistrations,
      }
    })

    return monthlyData
  } catch (error) {
    console.error("Error fetching monthly data:", error)
    return []
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
      value: "4.2",
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
    { key: "email", header: "Email" },
    { key: "score", header: "Score" },
    {
      key: "created_at",
      header: "Date",
      cell: (row: any) => new Date(row.created_at).toLocaleDateString(),
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
