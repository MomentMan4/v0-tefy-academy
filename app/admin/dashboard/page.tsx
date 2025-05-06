import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminHeader from "../components/AdminHeader"
import DashboardClient from "./components/DashboardClient"
import { format, subMonths, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

// Function to get dashboard stats
async function getDashboardStats() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch stats data with error handling
    const [submissionsResult, applicationsResult, registrationsResult, ratingsResult, paymentsResult] =
      await Promise.all([
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("registrations").select("*", { count: "exact", head: true }),
        supabase.from("ratings").select("rating"),
        supabase.from("registrations").select("payment_status", { count: "exact" }).eq("payment_status", "completed"),
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

    // Get recent payments
    const { data: recentPayments, error: paymentsError } = await supabase
      .from("registrations")
      .select("*")
      .order("payment_date", { ascending: false })
      .limit(10)

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError)
    }

    // Get today's payment data
    const today = new Date()
    const todayStart = startOfDay(today).toISOString()
    const todayEnd = endOfDay(today).toISOString()

    const [completedToday, failedToday, pendingToday, refundedToday, totalToday] = await Promise.all([
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "completed")
        .gte("payment_date", todayStart)
        .lte("payment_date", todayEnd),
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "failed")
        .gte("payment_date", todayStart)
        .lte("payment_date", todayEnd),
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "pending")
        .gte("payment_date", todayStart)
        .lte("payment_date", todayEnd),
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "refunded")
        .gte("payment_date", todayStart)
        .lte("payment_date", todayEnd),
      supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .gte("payment_date", todayStart)
        .lte("payment_date", todayEnd),
    ])

    // Calculate average rating
    let averageRating = 0
    if (ratingsResult.data && ratingsResult.data.length > 0) {
      const totalRating = ratingsResult.data.reduce((sum, item) => sum + (item.rating || 0), 0)
      averageRating = totalRating / ratingsResult.data.length
    }

    return {
      stats: {
        submissions: submissionsResult.count || 0,
        applications: applicationsResult.count || 0,
        registrations: registrationsResult.count || 0,
        successfulPayments: paymentsResult.count || 0,
        averageRating: averageRating.toFixed(1),
      },
      recentSubmissions: submissions || [],
      recentPayments: recentPayments || [],
      dailyPayments: {
        completed: completedToday.count || 0,
        failed: failedToday.count || 0,
        pending: pendingToday.count || 0,
        refunded: refundedToday.count || 0,
        total: totalToday.count || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return fallback data
    return {
      stats: {
        submissions: 0,
        applications: 0,
        registrations: 0,
        successfulPayments: 0,
        averageRating: "0.0",
      },
      recentSubmissions: [],
      recentPayments: [],
      dailyPayments: {
        completed: 0,
        failed: 0,
        pending: 0,
        refunded: 0,
        total: 0,
      },
    }
  }
}

// Function to get monthly data
async function getMonthlyData() {
  try {
    const supabase = createServerSupabaseClient()
    const months = []
    const monthlyData = []

    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const monthName = format(date, "MMM")

      months.push(monthName)

      // Query data for this month
      const [submissionsResult, applicationsResult, registrationsResult, paymentsResult] = await Promise.all([
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", monthStart.toISOString())
          .lte("created_at", monthEnd.toISOString()),
        supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .gte("created_at", monthStart.toISOString())
          .lte("created_at", monthEnd.toISOString()),
        supabase
          .from("registrations")
          .select("*", { count: "exact", head: true })
          .gte("created_at", monthStart.toISOString())
          .lte("created_at", monthEnd.toISOString()),
        supabase
          .from("registrations")
          .select("payment_status", { count: "exact" })
          .eq("payment_status", "completed")
          .gte("payment_date", monthStart.toISOString())
          .lte("payment_date", monthEnd.toISOString()),
      ])

      monthlyData.push({
        name: monthName,
        leads: applicationsResult.count || 0,
        submissions: submissionsResult.count || 0,
        registrations: registrationsResult.count || 0,
        payments: paymentsResult.count || 0,
      })
    }

    return monthlyData
  } catch (error) {
    console.error("Error fetching monthly data:", error)

    // Fallback to sample data if there's an error
    return [
      { name: "Jan", leads: 45, submissions: 32, registrations: 12, payments: 10 },
      { name: "Feb", leads: 52, submissions: 41, registrations: 18, payments: 15 },
      { name: "Mar", leads: 61, submissions: 52, registrations: 23, payments: 20 },
      { name: "Apr", leads: 67, submissions: 45, registrations: 19, payments: 17 },
      { name: "May", leads: 70, submissions: 55, registrations: 25, payments: 22 },
      { name: "Jun", leads: 78, submissions: 57, registrations: 29, payments: 25 },
    ]
  }
}

// Function to get payment status data
async function getPaymentStatusData() {
  try {
    const supabase = createServerSupabaseClient()

    // Get counts for different payment statuses
    const [completedResult, pendingResult, failedResult, refundedResult] = await Promise.all([
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "completed"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "failed"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("payment_status", "refunded"),
    ])

    return [
      { name: "Completed", value: completedResult.count || 0 },
      { name: "Pending", value: pendingResult.count || 0 },
      { name: "Failed", value: failedResult.count || 0 },
      { name: "Refunded", value: refundedResult.count || 0 },
    ]
  } catch (error) {
    console.error("Error fetching payment status data:", error)
    return [
      { name: "Completed", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Failed", value: 0 },
      { name: "Refunded", value: 0 },
    ]
  }
}

export default async function AdminDashboardPage() {
  // Fetch data on the server
  const dashboardData = await getDashboardStats()
  const monthlyData = await getMonthlyData()
  const paymentStatusData = await getPaymentStatusData()

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
      title: "Successful Payments",
      value: dashboardData.stats.successfulPayments,
      description: "Completed transactions",
      change: { value: 7, trend: "up" as const },
      link: "/admin/payments",
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
    { name: "Payments", value: dashboardData.stats.successfulPayments },
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

  // Prepare columns for payments table
  const paymentsColumns = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "program", header: "Program", sortable: true },
    {
      key: "payment_amount",
      header: "Amount",
      cell: (row: any) => {
        const amount = row.payment_amount
        return amount !== undefined && amount !== null ? `$${Number(amount).toFixed(2)}` : "$0.00"
      },
      sortable: true,
    },
    {
      key: "payment_status",
      header: "Status",
      cell: (row: any) => {
        const status = row.payment_status || "pending"
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "completed"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      },
      sortable: true,
    },
    {
      key: "payment_date",
      header: "Date",
      cell: (row: any) => {
        const date = row.payment_date
        return date ? new Date(date).toLocaleDateString() : "N/A"
      },
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
          paymentStatusData={paymentStatusData}
          recentSubmissions={dashboardData.recentSubmissions}
          recentPayments={dashboardData.recentPayments}
          submissionsColumns={submissionsColumns}
          paymentsColumns={paymentsColumns}
          dailyPayments={dashboardData.dailyPayments}
        />
      </Suspense>
    </div>
  )
}
