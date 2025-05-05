export const metadata = {
  title: "Privacy Policy | TEFY Academy",
  description: "Learn how TEFY Academy protects and manages your personal data.",
  openGraph: {
    title: "Privacy Policy | TEFY Academy",
    description: "Learn how TEFY Academy protects and manages your personal data.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png",
        alt: "TEFY Digital Logo",
      },
    ],
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p className="text-lg">Last Updated: May 5, 2023</p>

      <div className="prose prose-slate max-w-none">
        <h2>1. Introduction</h2>
        <p>
          TEFY Academy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone number, and other contact details you
            provide.
          </li>
          <li>
            <strong>Assessment Data:</strong> Responses to assessment questions, scores, and results.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website, including IP address, browser type,
            pages visited, and time spent.
          </li>
          <li>
            <strong>Payment Information:</strong> When you make a purchase, our payment processor collects payment
            details. We do not store complete payment information on our servers.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To personalize your experience</li>
          <li>To communicate with you about our services</li>
          <li>To process payments</li>
          <li>To analyze usage patterns and improve our website</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>4. Legal Basis for Processing (GDPR)</h2>
        <p>
          Under the General Data Protection Regulation (GDPR), we process your personal data based on the following
          legal grounds:
        </p>
        <ul>
          <li>
            <strong>Consent:</strong> You have given clear consent for us to process your personal data for specific
            purposes.
          </li>
          <li>
            <strong>Contract:</strong> Processing is necessary for the performance of a contract with you.
          </li>
          <li>
            <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests, such as
            improving our services.
          </li>
          <li>
            <strong>Legal Obligation:</strong> Processing is necessary to comply with legal obligations.
          </li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
          Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>

        <h2>6. Your Data Protection Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You have the right to request copies of your personal data.
          </li>
          <li>
            <strong>Right to Rectification:</strong> You have the right to request that we correct any information you
            believe is inaccurate or incomplete.
          </li>
          <li>
            <strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under
            certain conditions.
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing
            of your personal data, under certain conditions.
          </li>
          <li>
            <strong>Right to Object to Processing:</strong> You have the right to object to our processing of your
            personal data, under certain conditions.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> You have the right to request that we transfer the data we have
            collected to another organization, or directly to you, under certain conditions.
          </li>
        </ul>

        <h2>7. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against
          unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
        </p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication procedures</li>
          <li>Staff training on data protection</li>
          <li>Incident response plans</li>
        </ul>

        <h2>8. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than the country in which you reside.
          These countries may have data protection laws that are different from the laws of your country. We ensure that
          appropriate safeguards are in place to protect your personal data in accordance with this Privacy Policy.
        </p>

        <h2>9. Third-Party Services</h2>
        <p>
          We may use third-party services to support our website and services. These third parties have access to your
          personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          Our services are not intended for use by children under the age of 16. We do not knowingly collect personal
          information from children under 16. If you are a parent or guardian and believe your child has provided us
          with personal information, please contact us.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>12. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
        <p>
          Email: privacy@tefyacademy.com
          <br />
          Address: 123 Education Street, Suite 400, Toronto, ON M5V 2K4, Canada
        </p>

        <h2>13. Compliance with PIPEDA</h2>
        <p>
          We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) in Canada. This means
          we follow these principles:
        </p>
        <ul>
          <li>Accountability</li>
          <li>Identifying purposes</li>
          <li>Consent</li>
          <li>Limiting collection</li>
          <li>Limiting use, disclosure, and retention</li>
          <li>Accuracy</li>
          <li>Safeguards</li>
          <li>Openness</li>
          <li>Individual access</li>
          <li>Challenging compliance</li>
        </ul>
      </div>
    </div>
  )
}
