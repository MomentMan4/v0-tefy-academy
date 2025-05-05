"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"

// Define default values for missing data
const DEFAULT_VALUES = {
  userName: "User",
  userEmail: "user@example.com",
  userIndustry: "Technology",
  score: 75,
  careerPathSuggestion: "Consider exploring entry-level GRC roles to build your experience.",
  skillBreakdown: [
    {
      category: "Tech",
      score: 70,
      description: "Your ability to understand and work with technical tools and platforms used in GRC.",
    },
    {
      category: "Compliance",
      score: 75,
      description: "Your aptitude for understanding and applying regulatory frameworks and standards.",
    },
    {
      category: "People",
      score: 80,
      description: "Your communication and collaboration skills essential for cross-functional GRC work.",
    },
    {
      category: "Risk",
      score: 65,
      description: "Your capacity to identify, assess, and mitigate various types of organizational risks.",
    },
    {
      category: "Process",
      score: 70,
      description: "Your ability to document, implement, and improve structured processes and controls.",
    },
  ],
  recommendedCertifications: [
    "CISA (Certified Information Systems Auditor)",
    "CRISC (Certified in Risk and Information Systems Control)",
    "ISO 27001 Lead Implementer",
  ],
  roles: [
    {
      title: "GRC Analyst",
      description:
        "As a GRC Analyst, you'll support governance, risk, and compliance efforts by documenting policies, conducting risk assessments, and ensuring regulatory requirements are met.",
      matchPercent: 85,
      skillsNeeded: ["Risk assessment", "Policy writing", "Framework alignment", "Stakeholder communication"],
      salaryRange: "$70,000 – $110,000",
      recommendedCerts: ["CISA", "ISO 27001", "CRISC"],
    },
    {
      title: "Compliance Analyst",
      description:
        "As a Compliance Analyst, you'll ensure the organization adheres to industry regulations, standards, and internal policies.",
      matchPercent: 80,
      skillsNeeded: ["Regulatory knowledge", "Control assessment", "Documentation", "Gap analysis"],
      salaryRange: "$75,000 – $115,000",
      recommendedCerts: ["CISA", "CISM", "CCEP"],
    },
    {
      title: "Risk Specialist",
      description: "As a Risk Specialist, you'll identify, evaluate, and mitigate risks across the organization.",
      matchPercent: 75,
      skillsNeeded: ["Threat modeling", "Risk analysis", "Controls evaluation", "Incident reporting"],
      salaryRange: "$80,000 – $120,000",
      recommendedCerts: ["CRISC", "ISO 27005", "CISSP"],
    },
  ],
}

export default function PDFDownloadButton() {
  const [isReady, setIsReady] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataValidated, setDataValidated] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  // Validate data for PDF generation
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Check if all required data is available
      const userInfo = window.assessmentUserInfo || null
      const score = window.assessmentScore || null
      const rolesData = window.assessmentRolesData || null
      const skillBreakdown = window.assessmentSkillBreakdown || null

      let message = ""

      if (!userInfo) {
        message += "User information is missing. "
      }

      if (score === null) {
        message += "Assessment score is missing. "
      }

      if (!rolesData || !Array.isArray(rolesData) || rolesData.length === 0) {
        message += "Role data is missing. "
      }

      if (!skillBreakdown || !Array.isArray(skillBreakdown) || skillBreakdown.length === 0) {
        message += "Skill breakdown is missing. "
      }

      if (message) {
        setValidationMessage("Some data may be missing. Default values will be used where needed.")
        console.warn("PDF data validation warning:", message)
      } else {
        setDataValidated(true)
      }
    } catch (err) {
      console.error("Error validating PDF data:", err)
      setValidationMessage("Data validation error. Default values will be used where needed.")
    }
  }, [])

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

  // Function to safely get data with fallbacks
  const getSafeData = () => {
    if (typeof window === "undefined") return DEFAULT_VALUES

    return {
      userName: window.assessmentUserInfo?.name || DEFAULT_VALUES.userName,
      userEmail: window.assessmentUserInfo?.email || DEFAULT_VALUES.userEmail,
      userIndustry: window.assessmentUserInfo?.industry || DEFAULT_VALUES.userIndustry,
      score: window.assessmentScore || DEFAULT_VALUES.score,
      careerPathSuggestion: window.assessmentCareerPathSuggestion || DEFAULT_VALUES.careerPathSuggestion,
      skillBreakdown:
        Array.isArray(window.assessmentSkillBreakdown) && window.assessmentSkillBreakdown.length > 0
          ? window.assessmentSkillBreakdown
          : DEFAULT_VALUES.skillBreakdown,
      recommendedCertifications:
        Array.isArray(window.assessmentRecommendedCertifications) &&
        window.assessmentRecommendedCertifications.length > 0
          ? window.assessmentRecommendedCertifications
          : DEFAULT_VALUES.recommendedCertifications,
      roles:
        Array.isArray(window.assessmentRolesData) && window.assessmentRolesData.length > 0
          ? window.assessmentRolesData
          : DEFAULT_VALUES.roles,
    }
  }

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
      // Get data with fallbacks
      const data = getSafeData()

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

      // Create header with TEFY branding - using inline SVG instead of external image
      const header = document.createElement("div")
      header.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <svg width="60" height="60" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="192" height="192" rx="96" fill="#4F46E5" fillOpacity="0.1"/>
          <path d="M50 50H142M50 96H142M50 142H142" stroke="#4F46E5" strokeWidth="12" strokeLinecap="round"/>
        </svg>
        <h1 style="color: #333; font-size: 24px; margin-bottom: 5px;">GRC Career Assessment Results</h1>
        <p style="color: #666; font-size: 14px;">TEFY Digital Academy</p>
      </div>
    `
      pdfContainer.appendChild(header)

      // Add user info section
      const userInfoSection = document.createElement("div")
      userInfoSection.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h2 style="margin-top: 0; font-size: 18px; color: #333;">Assessment Results for ${data.userName}</h2>
        <p style="margin: 5px 0; color: #555;">Email: ${data.userEmail}</p>
        <p style="margin: 5px 0; color: #555;">Industry: ${data.userIndustry}</p>
        <div style="margin-top: 15px;">
          <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${data.score}%</div>
          <p style="margin: 5px 0; color: #555;">
            ${data.score >= 80 ? "Excellent Match" : data.score >= 70 ? "Strong Match" : "Potential Match"}
          </p>
        </div>
      </div>
    `
      pdfContainer.appendChild(userInfoSection)

      // Create career path suggestion section
      if (data.careerPathSuggestion) {
        const careerSection = document.createElement("div")
        careerSection.innerHTML = `
        <div style="margin: 20px 0; padding: 15px; background-color: #eef2ff; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #4338ca; font-size: 16px;">Career Path Suggestion</h3>
          <p style="margin: 10px 0; color: #4338ca;">${data.careerPathSuggestion}</p>
        </div>
      `
        pdfContainer.appendChild(careerSection)
      }

      // Create skills section
      const skillsSection = document.createElement("div")
      skillsSection.innerHTML = `
      <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px;">Your GRC Skills Profile</h2>
    `

      // Add skill breakdown
      if (data.skillBreakdown && data.skillBreakdown.length > 0) {
        const breakdownSection = document.createElement("div")
        breakdownSection.innerHTML = `
        <h3 style="color: #333; font-size: 16px; margin: 20px 0 10px;">Skill Breakdown</h3>
      `

        data.skillBreakdown.forEach((skill) => {
          if (!skill || typeof skill !== "object") return // Skip invalid skills

          const category = skill.category || "Skill"
          const score = typeof skill.score === "number" ? skill.score : 0
          const description = skill.description || ""

          const skillDetail = document.createElement("div")
          skillDetail.style.marginBottom = "15px"
          skillDetail.style.padding = "10px"
          skillDetail.style.backgroundColor = "#f8f9fa"
          skillDetail.style.borderRadius = "5px"

          skillDetail.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">${category}</span>
            <span>${score}%</span>
          </div>
          <p style="margin: 5px 0; color: #555; font-size: 13px;">${description}</p>
          <div style="width: 100%; background-color: #eee; height: 10px; border-radius: 5px; margin-top: 8px;">
            <div style="width: ${score}%; background-color: #6366f1; height: 10px; border-radius: 5px;"></div>
          </div>
        `
          breakdownSection.appendChild(skillDetail)
        })

        skillsSection.appendChild(breakdownSection)
      }

      pdfContainer.appendChild(skillsSection)

      // Add recommended certifications
      if (data.recommendedCertifications && data.recommendedCertifications.length > 0) {
        const certSection = document.createElement("div")
        certSection.innerHTML = `
        <h3 style="color: #333; font-size: 16px; margin: 25px 0 10px;">Recommended Certifications</h3>
        <ul style="padding-left: 20px; margin: 10px 0;">
          ${data.recommendedCertifications
            .map((cert) => {
              if (!cert) return ""
              return `<li style="margin-bottom: 8px;">${cert}</li>`
            })
            .join("")}
        </ul>
      `
        pdfContainer.appendChild(certSection)
      }

      // Create roles section
      const rolesSection = document.createElement("div")
      rolesSection.innerHTML = `
      <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px;">Your Top Role Matches</h2>
    `

      // Add roles
      if (data.roles && data.roles.length > 0) {
        data.roles.forEach((role, index) => {
          if (!role || typeof role !== "object") return // Skip invalid roles

          const title = role.title || `Role ${index + 1}`
          const description = role.description || ""
          const matchPercent = typeof role.matchPercent === "number" ? role.matchPercent : null

          const roleCard = document.createElement("div")
          roleCard.style.marginBottom = "20px"
          roleCard.style.padding = "15px"
          roleCard.style.border = "1px solid #ddd"
          roleCard.style.borderRadius = "5px"

          let roleHtml = `
          <h3 style="margin: 0 0 10px; color: #333;">${index + 1}. ${title}</h3>
          <p style="margin: 0 0 10px; color: #666; font-size: 14px;">${description}</p>
          ${matchPercent !== null ? `<p style="margin: 5px 0; color: #4f46e5; font-weight: bold;">Match: ${matchPercent}%</p>` : ""}
          `

          // Add skills needed if available
          if (role.skillsNeeded && Array.isArray(role.skillsNeeded) && role.skillsNeeded.length > 0) {
            roleHtml += `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Skills Needed:</p>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${role.skillsNeeded
                  .map((skill) => {
                    if (!skill) return ""
                    return `<li style="margin-bottom: 3px;">${skill}</li>`
                  })
                  .join("")}
              </ul>
            </div>
            `
          }

          // Add salary range if available
          if (role.salaryRange) {
            roleHtml += `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Typical Salary Range:</p>
              <p style="margin: 5px 0;">${role.salaryRange}</p>
            </div>
            `
          }

          // Add recommended certifications if available
          if (role.recommendedCerts && Array.isArray(role.recommendedCerts) && role.recommendedCerts.length > 0) {
            roleHtml += `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Recommended Certifications:</p>
              <p style="margin: 5px 0;">${role.recommendedCerts.join ? role.recommendedCerts.join(", ") : role.recommendedCerts}</p>
            </div>
            `
          }

          // Add skills to acquire if available (for bridge roles)
          if (role.skillsToAcquire && Array.isArray(role.skillsToAcquire) && role.skillsToAcquire.length > 0) {
            roleHtml += `
            <div style="margin-top: 10px;">
              <p style="margin: 5px 0; font-weight: bold; color: #4f46e5;">Skills to Develop:</p>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${role.skillsToAcquire
                  .map((skill) => {
                    if (!skill) return ""
                    return `<li style="margin-bottom: 3px;">${skill}</li>`
                  })
                  .join("")}
              </ul>
            </div>
            `
          }

          roleCard.innerHTML = roleHtml
          rolesSection.appendChild(roleCard)
        })
      }

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
        html2canvas: { scale: 2, useCORS: true, logging: false },
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
      {validationMessage && !error && <p className="text-amber-500 text-sm mt-2">{validationMessage}</p>}
    </div>
  )
}
