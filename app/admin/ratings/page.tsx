import { Suspense } from "react"
import { Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "../dashboard/components/Table"
import ChartPreview from "../dashboard/components/ChartPreview"
import { createClient } from "@supabase/supabase-js"

async function getRatings() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase.from("ratings").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return []
  }
}

export default async function RatingsPage() {
  const ratings = await getRatings()

  // Prepare columns for ratings table
  const columns = [
    { key: "email", label: "Email", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (value: number) => {
        return (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
            <span className="ml-2">{value}/5</span>
          </div>
        )
      },
    },
    {
      key: "created_at",
      label: "Submission Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  // Prepare data for ratings distribution chart
  const ratingCounts = [0, 0, 0, 0, 0]
  ratings.forEach((rating) => {
    if (rating.rating >= 1 && rating.rating <= 5) {
      ratingCounts[rating.rating - 1]++
    }
  })

  const ratingDistribution = [
    { name: "1 Star", value: ratingCounts[0] },
    { name: "2 Stars", value: ratingCounts[1] },
    { name: "3 Stars", value: ratingCounts[2] },
    { name: "4 Stars", value: ratingCounts[3] },
    { name: "5 Stars", value: ratingCounts[4] },
  ]

  // Calculate average rating
  const totalRatings = ratings.length
  const sumRatings = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0)
  const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Ratings</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium mb-2">Average Rating</h2>
          <div className="flex items-center">
            <span className="text-4xl font-bold mr-2">{averageRating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(Number.parseFloat(averageRating))
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on {totalRatings} ratings</p>
        </div>

        <div className="col-span-2">
          <ChartPreview
            title="Rating Distribution"
            description="Distribution of user ratings"
            data={ratingDistribution}
            type="bar"
          />
        </div>
      </div>

      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading ratings...</div>}>
        <Table
          columns={columns}
          data={ratings}
          title="User Ratings"
          emptyState={
            <div className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold">No ratings found</h3>
              <p className="mt-1 text-sm text-gray-500">Ratings will appear here when users rate the assessment.</p>
            </div>
          }
        />
      </Suspense>
    </div>
  )
}
