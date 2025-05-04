import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted mt-20 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TEFY Digital Academy. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/assessment" className="hover:text-primary">
            Self-Assessment
          </Link>
          <Link href="/program" className="hover:text-primary">
            Program
          </Link>
          <Link href="/apply" className="hover:text-primary">
            Apply
          </Link>
          <Link href="mailto:admissions@tefydigital.com" className="hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-gray-200 flex justify-center gap-6 text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-primary">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-primary">
          Terms & Conditions
        </Link>
        <Link href="/cookies" className="hover:text-primary">
          Cookie Policy
        </Link>
      </div>
    </footer>
  )
}
