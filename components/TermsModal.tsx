"use client"

import { Dialog } from "@headlessui/react"

export default function TermsModal({
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
          <Dialog.Title className="text-lg font-medium">Terms and Conditions</Dialog.Title>
          <p>
            By enrolling in the Cybersecurity GRC program, you agree to abide by all policies and instructions shared
            during the course. All payments are final and non-refundable, except in rare circumstances. However,
            participants may defer their enrollment to the next session.
          </p>
          <p>All course content is owned by TEFY Digital Academy and may not be redistributed without permission.</p>
          <button className="mt-4 text-sm underline text-primary" onClick={() => setOpen(false)}>
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
