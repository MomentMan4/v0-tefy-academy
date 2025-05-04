"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function PDFDownloadButton() {
  const [isReady, setIsReady] = useState(false)
  const [html2pdf, setHtml2pdf] = useState<any>(null)

  useEffect(() => {
    // Dynamically import html2pdf only on the client side
    import("html2pdf.js").then((module) => {
      setHtml2pdf(() => module.default)
      // Delay activation after content renders
      setTimeout(() => setIsReady(true), 1000)
    })
  }, [])

  const handleDownload = () => {
    if (!html2pdf) return

    const element = document.getElementById("assessment-result-pdf")
    if (!element) return

    const opt = {
      margin: 0.5,
      filename: "GRC_Assessment_Results.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <Button onClick={handleDownload} disabled={!isReady}>
      📄 Download Results as PDF
    </Button>
  )
}
