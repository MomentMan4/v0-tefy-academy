export default function OnboardingEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: 1.5 }}>
      <p>Welcome, {name}!</p>
      <p>
        You&apos;ve successfully enrolled in the Cybersecurity GRC Program. We&apos;re thrilled to have you onboard.
      </p>
      <p>Here&apos;s what to expect next:</p>
      <ul>
        <li>Your class access details will be sent soon</li>
        <li>You&apos;ll be added to our private learning community</li>
        <li>Expect weekly updates and check-ins from our team</li>
      </ul>
      <p>
        We recommend bookmarking <a href="https://academy.tefydigital.com/program">this program page</a> for reference.
      </p>
      <p>— TEFY Digital Academy Team</p>
    </div>
  )
}
