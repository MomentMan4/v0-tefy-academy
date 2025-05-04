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
          <p>
            We collect user data such as name, email, and industry to personalize your experience and improve our
            service. We do not sell your data. All information is stored securely and only used for internal analysis,
            communication, and support.
          </p>
          <p>
            By using this website, you agree to our collection and use of information in accordance with this policy.
          </p>
          <button className="mt-4 text-sm underline text-primary" onClick={() => setOpen(false)}>
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
