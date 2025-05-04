"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export default function PDFDownloadButton() {
  const [isReady, setIsReady] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return

    // Function to check if html2pdf is loaded
    const checkHtml2Pdf = () => {
      if (window.html2pdf) {
        console.log("html2pdf detected")
        setIsReady(true)
        return true
      }
      return false
    }

    // Try immediately
    if (checkHtml2Pdf()) return

    // If not loaded yet, try to load it manually
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
    script.crossOrigin = "anonymous"
    script.referrerPolicy = "no-referrer"
    script.onload = () => {
      console.log("html2pdf script loaded")
      setIsReady(true)
    }
    script.onerror = () => {
      console.error("Failed to load html2pdf")
      setError("Failed to load PDF generation library")
    }

    document.body.appendChild(script)

    // Also set up an interval as a backup
    const interval = setInterval(() => {
      if (checkHtml2Pdf()) {
        clearInterval(interval)
      }
    }, 1000)

    // Clean up
    return () => {
      clearInterval(interval)
      // Don't remove the script as other components might need it
    }
  }, [])

  const handleDownload = async () => {
    if (typeof window === "undefined") return

    setIsGenerating(true)
    setError(null)

    if (!window.html2pdf) {
      setError("PDF generation library not loaded. Please refresh the page.")
      setIsGenerating(false)
      return
    }

    try {
      const element = document.getElementById("assessment-result-pdf")
      if (!element) {
        setError("Could not find content to generate PDF.")
        setIsGenerating(false)
        return
      }

      // Create a deep clone to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement

      // Add TEFY branding
      const footer = document.createElement("div")
      footer.innerHTML = `
        <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} TEFY Digital Academy</p>
          <p style="color: #666; font-size: 12px;">Your path to a career in Cybersecurity GRC</p>
        </div>
      `
      clone.appendChild(footer)

      // Hide the clone off-screen
      clone.style.position = "absolute"
      clone.style.left = "-9999px"
      document.body.appendChild(clone)

      // Configure PDF options
      const opt = {
        margin: 0.5,
        filename: "GRC_Assessment_Results.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }

      // Generate PDF
      await window.html2pdf().from(clone).set(opt).save()

      // Clean up
      document.body.removeChild(clone)
      setIsGenerating(false)
    } catch (err) {
      console.error("PDF generation error:", err)
      setError("Failed to generate PDF. Please try again.")
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Button onClick={handleDownload} disabled={!isReady || isGenerating} className="flex items-center gap-2">
        <Download size={16} />
        {isGenerating ? "Generating PDF..." : "Download Results as PDF"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {!isReady && !error && <p className="text-amber-500 text-sm mt-2">Preparing PDF generator...</p>}
    </div>
  )
}
