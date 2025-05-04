export interface QuestionOption {
  value: number
  label: string
}

export interface Question {
  id: number
  question: string
  weight: number
  tooltip: string
  options: QuestionOption[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What best describes your most recent job role?",
    weight: 4,
    tooltip: "Your background helps us determine the most suitable GRC path for you",
    options: [
      { value: 1, label: "Non-technical role (e.g., HR, Marketing, Sales)" },
      { value: 2, label: "Administrative or support position" },
      { value: 3, label: "Technical adjacent role (e.g., Project Management)" },
      { value: 4, label: "IT or technical role without security focus" },
      { value: 5, label: "Security or compliance-related position" },
    ],
  },
  {
    id: 2,
    question: "How comfortable are you with structured systems or documentation at work?",
    weight: 3,
    tooltip: "GRC roles involve extensive documentation and following structured processes",
    options: [
      { value: 1, label: "Very uncomfortable - I prefer flexibility" },
      { value: 2, label: "Somewhat uncomfortable" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Comfortable with structure" },
      { value: 5, label: "Very comfortable - I thrive with clear processes" },
    ],
  },
  {
    id: 3,
    question: "Which best describes how you prefer to work?",
    weight: 2,
    tooltip: "GRC roles often require both independent work and cross-team collaboration",
    options: [
      { value: 1, label: "Always independently" },
      { value: 2, label: "Mostly independently with occasional collaboration" },
      { value: 3, label: "Equal mix of independent and team work" },
      { value: 4, label: "Mostly collaborative with some independent tasks" },
      { value: 5, label: "Always as part of a team" },
    ],
  },
  {
    id: 4,
    question: "Have you ever worked in a regulated industry (e.g., healthcare, banking)?",
    weight: 4,
    tooltip: "Experience with regulations is valuable for GRC roles",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Briefly (less than 1 year)" },
      { value: 3, label: "Some experience (1-2 years)" },
      { value: 4, label: "Significant experience (3-5 years)" },
      { value: 5, label: "Extensive experience (5+ years)" },
    ],
  },
  {
    id: 5,
    question: "How confident are you using digital tools (e.g., Excel, ticketing systems)?",
    weight: 3,
    tooltip: "GRC roles require proficiency with various digital tools and platforms",
    options: [
      { value: 1, label: "Not confident at all" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Extremely confident" },
    ],
  },
  {
    id: 6,
    question: "Have you written reports, summaries, or documentation in past roles?",
    weight: 4,
    tooltip: "Documentation skills are essential for policy writing in GRC",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely (a few times)" },
      { value: 3, label: "Occasionally" },
      { value: 4, label: "Frequently" },
      { value: 5, label: "Extensively (it was a core part of my role)" },
    ],
  },
  {
    id: 7,
    question: "Do you feel confident learning tools like dashboards, spreadsheets, or new platforms?",
    weight: 3,
    tooltip: "GRC professionals regularly need to learn and adapt to new tools",
    options: [
      { value: 1, label: "Not confident at all" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Extremely confident" },
    ],
  },
  {
    id: 8,
    question: "How would you rate your problem-solving or analytical thinking?",
    weight: 3,
    tooltip: "Risk analysis requires strong analytical and problem-solving skills",
    options: [
      { value: 1, label: "Basic" },
      { value: 2, label: "Developing" },
      { value: 3, label: "Competent" },
      { value: 4, label: "Advanced" },
      { value: 5, label: "Expert" },
    ],
  },
  {
    id: 9,
    question: "How familiar are you with regulations (like GDPR, HIPAA, PCI-DSS)?",
    weight: 5,
    tooltip: "Knowledge of regulatory frameworks is central to GRC roles",
    options: [
      { value: 1, label: "Not familiar at all" },
      { value: 2, label: "Heard of them but don't know details" },
      { value: 3, label: "Basic understanding" },
      { value: 4, label: "Good working knowledge" },
      { value: 5, label: "Expert understanding" },
    ],
  },
  {
    id: 10,
    question: "Do you enjoy understanding and following rules, processes, or standards?",
    weight: 4,
    tooltip: "GRC roles focus heavily on compliance with standards and regulations",
    options: [
      { value: 1, label: "Strongly dislike" },
      { value: 2, label: "Somewhat dislike" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Somewhat enjoy" },
      { value: 5, label: "Strongly enjoy" },
    ],
  },
  {
    id: 11,
    question: "If asked to investigate why something failed at work, how would you feel?",
    weight: 3,
    tooltip: "Root cause analysis is a common task in risk management",
    options: [
      { value: 1, label: "Very uncomfortable" },
      { value: 2, label: "Somewhat uncomfortable" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Somewhat comfortable" },
      { value: 5, label: "Very comfortable and confident" },
    ],
  },
  {
    id: 12,
    question: "Which best describes your attention to detail?",
    weight: 3,
    tooltip: "GRC work requires precision and thoroughness",
    options: [
      { value: 1, label: "I often miss details" },
      { value: 2, label: "I catch some details" },
      { value: 3, label: "Average attention to detail" },
      { value: 4, label: "Detail-oriented in most situations" },
      { value: 5, label: "Extremely detail-oriented in all work" },
    ],
  },
  {
    id: 13,
    question: "How comfortable are you with collaboration or working in teams?",
    weight: 2,
    tooltip: "GRC professionals work with stakeholders across the organization",
    options: [
      { value: 1, label: "Very uncomfortable" },
      { value: 2, label: "Somewhat uncomfortable" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Comfortable" },
      { value: 5, label: "Very comfortable" },
    ],
  },
  {
    id: 14,
    question: "How do you typically respond to deadlines or structured timelines?",
    weight: 3,
    tooltip: "Compliance work often involves strict deadlines and audit schedules",
    options: [
      { value: 1, label: "I struggle significantly with deadlines" },
      { value: 2, label: "I often need extensions" },
      { value: 3, label: "I usually meet deadlines with effort" },
      { value: 4, label: "I reliably meet deadlines" },
      { value: 5, label: "I excel with deadlines and often finish early" },
    ],
  },
  {
    id: 15,
    question: "How adaptable are you when things change quickly at work?",
    weight: 2,
    tooltip: "Regulations and requirements can change rapidly in GRC",
    options: [
      { value: 1, label: "Very resistant to change" },
      { value: 2, label: "Somewhat resistant" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Adaptable" },
      { value: 5, label: "Highly adaptable" },
    ],
  },
  {
    id: 16,
    question: "How confident are you speaking or presenting findings to others?",
    weight: 3,
    tooltip: "GRC roles often require presenting audit findings or risk assessments",
    options: [
      { value: 1, label: "Not confident at all" },
      { value: 2, label: "Slightly confident" },
      { value: 3, label: "Moderately confident" },
      { value: 4, label: "Very confident" },
      { value: 5, label: "Extremely confident" },
    ],
  },
  {
    id: 17,
    question: "What motivates you most in your career path right now?",
    weight: 4,
    tooltip: "Understanding your career drivers helps match you to the right GRC path",
    options: [
      { value: 1, label: "Primarily salary and benefits" },
      { value: 2, label: "Work-life balance and stability" },
      { value: 3, label: "Learning new skills" },
      { value: 4, label: "Career advancement opportunities" },
      { value: 5, label: "Making a meaningful impact" },
    ],
  },
  {
    id: 18,
    question: "Are you open to roles that include both documentation and investigation?",
    weight: 3,
    tooltip: "GRC combines analytical investigation with thorough documentation",
    options: [
      { value: 1, label: "Strongly prefer just one aspect" },
      { value: 2, label: "Slight preference for one aspect" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Comfortable with both" },
      { value: 5, label: "Enthusiastic about both aspects" },
    ],
  },
  {
    id: 19,
    question: "How committed are you to continuous learning and professional development?",
    weight: 4,
    tooltip: "GRC requires ongoing certification and keeping up with changing regulations",
    options: [
      { value: 1, label: "Minimal interest in further learning" },
      { value: 2, label: "Willing to learn if required" },
      { value: 3, label: "Moderately interested in development" },
      { value: 4, label: "Actively seeking learning opportunities" },
      { value: 5, label: "Passionate about continuous professional growth" },
    ],
  },
  {
    id: 20,
    question: "Do you prefer a career with stability, clear paths, and long-term relevance?",
    weight: 3,
    tooltip: "GRC offers stable career progression and growing demand",
    options: [
      { value: 1, label: "Prefer flexibility over stability" },
      { value: 2, label: "Slightly value stability" },
      { value: 3, label: "Balanced view" },
      { value: 4, label: "Value stability and clear paths" },
      { value: 5, label: "Strongly prioritize stability and structure" },
    ],
  },
]

export default questions
