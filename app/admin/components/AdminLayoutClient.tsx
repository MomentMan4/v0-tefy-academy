"use client"

import type React from "react"

import Link from "next/link"
import { LayoutDashboard, Users, FileText, CreditCard, Star, Settings, Mail } from "lucide-react"
import AdminLogoutButton from "./AdminLogoutButton"
import type { User } from "@supabase/supabase-js"

// Admin navigation items
const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Submissions", href: "/admin/submissions", icon: FileText },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Registrations", href: "/admin/registrations", icon: Users },
  { name: "Ratings", href: "/admin/ratings", icon: Star },
  { name: "Stripe Test", href: "/admin/stripe-test", icon: CreditCard },
  { name: "Resend Test", href: "/admin/resend-test", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutClientProps {
  user: User
  children: React.ReactNode
}

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">TEFY Admin</span>
          </Link>
          <div className="mt-2 text-sm text-gray-500">Logged in as: {user.email}</div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li className="px-6 py-6">
              <div className="border-t border-gray-200 pt-4">
                <AdminLogoutButton />
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin/dashboard" className="font-bold text-lg">
            TEFY Admin
          </Link>
          <div className="relative group">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-focus-within:block">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </Link>
              ))}
              <div className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 md:pt-6 overflow-y-auto mt-14 md:mt-0">{children}</main>
    </div>
  )
}
