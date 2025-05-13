import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Get Supabase URL from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase configuration",
          details: {
            urlAvailable: !!supabaseUrl,
            keyAvailable: !!supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Test connection to Supabase from the server
    let supabaseReachable = false
    let supabaseResponse = null
    let supabaseError = null

    try {
      // Try to ping the Supabase health endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
        },
        // Short timeout to avoid long waits
        signal: AbortSignal.timeout(5000),
      })

      supabaseReachable = response.ok
      supabaseResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      }
    } catch (error: any) {
      supabaseError = {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }
    }

    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      REGION: process.env.VERCEL_REGION || "unknown",
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      serverInfo: {
        environment: envInfo,
      },
      supabaseCheck: {
        url: supabaseUrl.replace(/^(https?:\/\/[^/]+).*$/, "$1"), // Only show the base URL for security
        reachable: supabaseReachable,
        response: supabaseResponse,
        error: supabaseError,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
