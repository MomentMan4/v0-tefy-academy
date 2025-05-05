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
      const userInfo = window.assessmentUserInfo || { name: "User", email: "user@example.com", industry: "Technology" }
      const score = window.assessmentScore || 0

      // Add user info section
      const userInfoSection = document.createElement("div")
      userInfoSection.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="margin-top: 0; font-size: 18px; color: #333;">Assessment Results for ${userInfo.name}</h2>
          <p style="margin: 5px 0; color: #555;">Email: ${userInfo.email}</p>
          <p style="margin: 5px 0; color: #555;">Industry: ${userInfo.industry}</p>
          <div style="margin-top: 15px;">
            <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${score}%</div>
            <p style="margin: 5px 0; color: #555;">
              ${score >= 80 ? "Excellent Match" : score >= 70 ? "Strong Match" : "Potential Match"}
            </p>
          </div>
        </div>
      `
      pdfContainer.appendChild(userInfoSection)

      // Get the skills radar data
      const radarData = window.assessmentRadarData || []
      const skillBreakdown = window.assessmentSkillBreakdown || []
      const careerPathSuggestion = window.assessmentCareerPathSuggestion || ""
      const recommendedCertifications = window.assessmentRecommendedCertifications || []

      // Create career path suggestion section
      const careerSection = document.createElement("div")
      careerSection.innerHTML = `
        <div style="margin: 20px 0; padding: 15px; background-color: #eef2ff; border-radius: 8px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #4338ca;">Career Path Suggestion</h3>
          <p style="margin: 10px 0; color: #4338ca;">${careerPathSuggestion}</p>
        </div>
      `
      pdfContainer.appendChild(careerSection)

      // Create skills section
      const skillsSection = document.createElement("div")
      skillsSection.innerHTML = `
        <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px;">Your GRC Skills Profile</h2>
      `

      // Add skills bars
      radarData.forEach((skill: any) => {
        const skillBar = document.createElement("div")
        skillBar.style.marginBottom = "15px"
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

      // Add skill breakdown
      if (skillBreakdown.length > 0) {
        const breakdownSection = document.createElement("div")
        breakdownSection.innerHTML = `
          <h3 style="color: #333; font-size: 16px; margin: 20px 0 10px;">Skill Breakdown</h3>
        `

        skillBreakdown.forEach((skill: any) => {
          const skillDetail = document.createElement("div")
          skillDetail.style.marginBottom = "15px"
          skillDetail.style.padding = "10px"
          skillDetail.style.backgroundColor = "#f8f9fa"
          skillDetail.style.borderRadius = "5px"

          skillDetail.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: bold;">${skill.category}</span>
              <span>${skill.score}%</span>
            </div>
            <p style="margin: 5px 0; color: #555; font-size: 13px;">${skill.description}</p>
          `
          breakdownSection.appendChild(skillDetail)
        })

        skillsSection.appendChild(breakdownSection)
      }

      pdfContainer.appendChild(skillsSection)

      // Add recommended certifications
      if (recommendedCertifications.length > 0) {
        const certSection = document.createElement("div")
        certSection.innerHTML = `
          <h3 style="color: #333; font-size: 16px; margin: 25px 0 10px;">Recommended Certifications</h3>
          <ul style="padding-left: 20px; margin: 10px 0;">
            ${recommendedCertifications.map((cert: string) => `<li style="margin-bottom: 8px;">${cert}</li>`).join("")}
          </ul>
        `
        pdfContainer.appendChild(certSection)
      }

      // Get the roles data
      const rolesData = window.assessmentRolesData || []

      // Create roles section
      const rolesSection = document.createElement("div")
      rolesSection.innerHTML = `
        <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px;">Your Top Role Matches</h2>
      `

      // Add roles
      rolesData.forEach((role: any, index: number) => {
        const roleCard = document.createElement("div")
        roleCard.style.marginBottom = "20px"
        roleCard.style.padding = "15px"
        roleCard.style.border = "1px solid #ddd"
        roleCard.style.borderRadius = "5px"

        roleCard.innerHTML = `
          <h3 style="margin: 0 0 10px; color: #333;">${index + 1}. ${role.title}</h3>
          <p style="margin: 0 0 10px; color: #666; font-size: 14px;">${role.description}</p>
          ${role.matchPercent ? `<p style="margin: 5px 0; color: #4f46e5; font-weight: bold;">Match: ${role.matchPercent}%</p>` : ""}
          
          ${
            role.skillsNeeded
              ? `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Skills Needed:</p>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${role.skillsNeeded.map((skill: string) => `<li style="margin-bottom: 3px;">${skill}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }
          
          ${
            role.skillsToAcquire
              ? `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Skills to Develop:</p>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${role.skillsToAcquire.map((skill: string) => `<li style="margin-bottom: 3px;">${skill}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }
        `

        rolesSection.appendChild(roleCard)
      })

      pdfContainer.appendChild(rolesSection)

      // Add next steps section
      const nextStepsSection = document.createElement("div")
      nextStepsSection.innerHTML = `
        <div style="margin: 30px 0 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #0369a1; font-size: 16px;">Next Steps</h3>
          <p style="margin: 10px 0; color: #0369a1;">Our 5-week GRC Program will help you build the skills needed for these roles, regardless of your starting point.</p>
          <ul style="padding-left: 20px; margin: 10px 0;">
            <li style="margin-bottom: 5px;">Apply for the TEFY GRC Program at academy.tefydigital.com/apply</li>
            <li style="margin-bottom: 5px;">Book a free consultation with a GRC advisor</li>
            <li style="margin-bottom: 5px;">Explore certification options based on your skill profile</li>
          </ul>
        </div>
      `
      pdfContainer.appendChild(nextStepsSection)

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
