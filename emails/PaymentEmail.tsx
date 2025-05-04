export default function PaymentEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: 1.5 }}>
      <p>Hi {name},</p>
      <p>Thank you for securing your spot in the Cybersecurity GRC Program!</p>
      <p>Your payment has been received. You&apos;ll receive further instructions closer to the class start date.</p>
      <p>Need help before then? Reply to this email or contact admissions@tefydigital.com</p>
      <p>We&apos;re excited to help you launch your GRC career.</p>
      <p>— The TEFY Academy Team</p>
    </div>
  )
}
