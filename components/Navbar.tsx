"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Program", href: "/program" },
  { label: "Take the Assessment", href: "/assessment" },
  { label: "Apply", href: "/apply" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="w-full px-4 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEFY-logo.PNG-3TKNwYc4u7SmhwZcqvDO6lg5fRAgcr.png"
            alt="TEFY Digital Academy"
            width={60}
            height={20}
          />
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              } hover:text-primary transition`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button size="sm" asChild>
          <Link href="/apply">Enroll Now</Link>
        </Button>
      </div>
    </header>
  )
}
