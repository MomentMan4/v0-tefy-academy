"use client"

import { Dialog } from "@headlessui/react"

export default function CookiesModal({
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
          <Dialog.Title className="text-lg font-medium">Cookie Policy</Dialog.Title>

          <div className="prose prose-sm max-w-none">
            <p>
              This site uses cookies to enhance your experience, improve performance, and personalize content. You may
              disable cookies in your browser settings, but certain functionality may be limited.
            </p>
            <p>We categorize cookies into essential, analytics, and marketing. You can manage preferences anytime.</p>
          </div>

          <p className="mt-4">
            <a href="/cookies" className="text-primary hover:underline">
              View Full Cookie Policy
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
