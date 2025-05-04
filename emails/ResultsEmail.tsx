export default function ResultsEmail({ name, topRoles }: { name: string; topRoles: string[] }) {
  return (
    <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: 1.5 }}>
      <p>Hello {name},</p>
      <p>Thanks for taking the Cybersecurity GRC Career Assessment!</p>
      <p>Based on your responses, your top role matches are:</p>
      <ul>
        {topRoles.map((role, i) => (
          <li key={i}>
            <strong>{role}</strong>
          </li>
        ))}
      </ul>
      <p>Next steps you can take:</p>
      <ol>
        <li>
          <a href="https://academy.tefydigital.com/apply">Enroll in our live GRC class</a>
        </li>
        <li>
          <a href="https://academy.tefydigital.com/program">Learn more about the program</a>
        </li>
        <li>
          <a href="https://academy.tefydigital.com/resources">Explore free resources</a>
        </li>
      </ol>
      <p>— The TEFY Academy Team</p>
    </div>
  )
}
