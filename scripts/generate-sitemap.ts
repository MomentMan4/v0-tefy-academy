import { writeFileSync } from "fs"
import { resolve } from "path"

// Define your site URL
const SITE_URL = "https://academy.tefydigital.com"

// Define your routes
const routes = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/program", changefreq: "monthly", priority: 0.9 },
  { path: "/assessment", changefreq: "monthly", priority: 0.9 },
  { path: "/assessment/questions", changefreq: "monthly", priority: 0.8 },
  { path: "/assessment/results", changefreq: "monthly", priority: 0.8 },
  { path: "/apply", changefreq: "monthly", priority: 0.9 },
  { path: "/privacy", changefreq: "yearly", priority: 0.5 },
  { path: "/terms", changefreq: "yearly", priority: 0.5 },
  { path: "/cookies", changefreq: "yearly", priority: 0.5 },
]

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split("T")[0]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  // Write sitemap to public directory
  writeFileSync(resolve("./public/sitemap.xml"), sitemap)
  console.log("Sitemap generated successfully!")
}

// Execute the function
generateSitemap()
