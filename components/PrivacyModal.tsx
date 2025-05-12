"use client"

import { Dialog } from "@headlessui/react"

export default function PrivacyModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (val: boolean) => void
}) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-2xl w-full p-6 rounded shadow-lg space-y-4 max-h-[60vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-medium">Privacy Policy</Dialog.Title>

          <p className="text-sm text-gray-600">Last Updated: May 5, 2023</p>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-base font-medium">1. Introduction</h3>
            <p>
              TEFY Academy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>

            <h3 className="text-base font-medium">2. Information We Collect</h3>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other contact details you
                provide.
              </li>
              <li>
                <strong>Assessment Data:</strong> Responses to assessment questions, scores, and results.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website.
              </li>
              <li>
                <strong>Payment Information:</strong> When you make a purchase, our payment processor collects payment
                details.
              </li>
            </ul>
          </div>

          <p className="mt-4">
            <a href="/privacy" className="text-primary hover:underline">
              View Full Privacy Policy
            </a>
          </p>

          <button className="mt-4 text-sm underline text-primary" onClick={() => setOpen(false)}>
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
