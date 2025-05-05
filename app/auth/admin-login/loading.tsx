export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-32 h-12 bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 animate-pulse mb-6"></div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md mt-6"></div>
        </div>
      </div>
    </div>
  )
}
