interface ResultsEmailProps {
  name: string
  topRoles: string[]
  score: number
  matchPercents?: number[]
}

export default function ResultsEmail({ name, topRoles, score, matchPercents = [] }: ResultsEmailProps) {
  return (
    <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: 1.6 }}>
      <h2>Hello {name},</h2>

      <p>🎉 Thanks for taking the Cybersecurity GRC Career Assessment!</p>

      <p>
        <strong>Your Overall Score:</strong> {score}%
      </p>

      <p>
        <strong>Here's a snapshot of your GRC Strength Profile:</strong>
      </p>
      <img
        src="https://i.ibb.co/kSyTRFv/sample-radar.png"
        alt="Radar Skills Chart"
        style={{ maxWidth: "400px", borderRadius: "8px", margin: "10px 0" }}
      />

      <p>
        <strong>Your Top Matched Roles:</strong>
      </p>
      <ul>
        {topRoles.map((role, i) => (
          <li key={i}>
            <strong>{role}</strong>
            {matchPercents[i] ? ` – Match Score: ${matchPercents[i]}%` : ""}
          </li>
        ))}
      </ul>

      <p>
        <strong>Here's what you can do next:</strong>
      </p>
      <ol>
        <li>
          <a href="https://academy.tefydigital.com/program">Explore the Full Program Curriculum</a>
        </li>
        <li>
          <a href="https://cal.com/oluwatoni-abraham/cyber-grc-class-chat">Book a Free 1:1 Info Session</a>
        </li>
        <li>
          <a href="https://academy.tefydigital.com/resources">Browse GRC Resources</a>
        </li>
      </ol>

      <p style={{ marginTop: "30px" }}>– The TEFY Academy Team</p>
    </div>
  )
}
