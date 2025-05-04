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
      // Get the original element
      const originalElement = document.getElementById("assessment-result-pdf")
      if (!originalElement) {
        setError("Could not find content to generate PDF.")
        setIsGenerating(false)
        return
      }

      // Create a container for our PDF content
      const pdfContainer = document.createElement("div")
      pdfContainer.style.position = "absolute"
      pdfContainer.style.left = "-9999px"
      pdfContainer.style.top = "0"
      pdfContainer.style.width = "800px" // Fixed width for better PDF layout
      pdfContainer.style.padding = "20px"
      pdfContainer.style.backgroundColor = "white"
      pdfContainer.style.fontFamily = "Arial, sans-serif"
      document.body.appendChild(pdfContainer)

      // Create header with TEFY branding
      const header = document.createElement("div")
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 5px;">GRC Career Assessment Results</h1>
          <p style="color: #666; font-size: 14px;">TEFY Digital Academy</p>
        </div>
      `
      pdfContainer.appendChild(header)

      // Get user info and score
      const userInfoElement = originalElement.querySelector("[data-user-info]")
      const scoreElement = originalElement.querySelector("[data-user-score]")

      if (userInfoElement) {
        const userInfoContent = document.createElement("div")
        userInfoContent.innerHTML = userInfoElement.innerHTML
        userInfoContent.style.marginBottom = "20px"
        pdfContainer.appendChild(userInfoContent)
      }

      if (scoreElement) {
        const scoreContent = document.createElement("div")
        scoreContent.innerHTML = scoreElement.innerHTML
        scoreContent.style.marginBottom = "20px"
        pdfContainer.appendChild(scoreContent)
      }

      // Get the skills radar data
      const radarData = window.assessmentRadarData || []

      // Create skills section
      const skillsSection = document.createElement("div")
      skillsSection.innerHTML = `
        <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Your GRC Skills Profile</h2>
      `

      // Add skills bars instead of chart (more reliable for PDF)
      radarData.forEach((skill: any) => {
        const skillBar = document.createElement("div")
        skillBar.style.marginBottom = "10px"
        skillBar.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">${skill.skill}</span>
            <span>${skill.value}%</span>
          </div>
          <div style="width: 100%; background-color: #eee; height: 10px; border-radius: 5px;">
            <div style="width: ${skill.value}%; background-color: #6366f1; height: 10px; border-radius: 5px;"></div>
          </div>
        `
        skillsSection.appendChild(skillBar)
      })

      pdfContainer.appendChild(skillsSection)

      // Get the roles data
      const rolesData = window.assessmentRolesData || []

      // Create roles section
      const rolesSection = document.createElement("div")
      rolesSection.innerHTML = `
        <h2 style="color: #333; font-size: 18px; margin: 20px 0 10px;">Your Top Role Matches</h2>
      `

      // Add roles
      rolesData.forEach((role: any, index: number) => {
        const roleCard = document.createElement("div")
        roleCard.style.marginBottom = "15px"
        roleCard.style.padding = "10px"
        roleCard.style.border = "1px solid #ddd"
        roleCard.style.borderRadius = "5px"

        roleCard.innerHTML = `
          <h3 style="margin: 0 0 5px; color: #333;">${index + 1}. ${role.title}</h3>
          <p style="margin: 0 0 10px; color: #666; font-size: 14px;">${role.description}</p>
        `

        rolesSection.appendChild(roleCard)
      })

      pdfContainer.appendChild(rolesSection)

      // Add footer
      const footer = document.createElement("div")
      footer.innerHTML = `
        <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} TEFY Digital Academy</p>
          <p style="color: #666; font-size: 12px;">Your path to a career in Cybersecurity GRC</p>
          <p style="color: #666; font-size: 12px;">www.tefydigital.com</p>
        </div>
      `
      pdfContainer.appendChild(footer)

      // Configure PDF options
      const opt = {
        margin: 10,
        filename: "GRC_Assessment_Results.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      // Generate PDF
      await window.html2pdf().from(pdfContainer).set(opt).save()

      // Clean up
      document.body.removeChild(pdfContainer)
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
