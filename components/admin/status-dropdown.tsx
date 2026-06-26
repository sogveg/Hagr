'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setBookingStatus } from '@/app/actions/admin'

const STATUS_OPTIONS = [
  { value: 'confirmed',     label: 'Bekreftet',        className: 'bg-blue-50 text-blue-700' },
  { value: 'prepared',      label: 'Klar til henting', className: 'bg-purple-50 text-purple-700' },
  { value: 'delivered',     label: 'Levert',           className: 'bg-indigo-50 text-indigo-700' },
  { value: 'active_rental', label: 'Aktiv leie',       className: 'bg-green-50 text-green-700' },
  { value: 'returned',      label: 'Returnert',        className: 'bg-gray-50 text-gray-600' },
  { value: 'completed',     label: 'Fullført',         className: 'bg-gray-50 text-gray-500' },
  { value: 'cancelled',     label: 'Kansellert',       className: 'bg-red-50 text-red-500' },
]

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft:           { label: 'Utkast',          className: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling', className: 'bg-yellow-50 text-yellow-700' },
  payment_failed:  { label: 'Betaling feilet', className: 'bg-red-50 text-red-600' },
  confirmed:       { label: 'Bekreftet',       className: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar til henting',className: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',          className: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',      className: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',       className: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',        className: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',      className: 'bg-red-50 text-red-500' },
}

export function StatusDropdown({
  bookingId,
  currentStatus,
}: {
  bookingId:     string
  currentStatus: string
}) {
  const [open, setOpen]           = useState(false)
  const [status, setStatus]       = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const ref                        = useRef<HTMLDivElement>(null)
  const router                     = useRouter()

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(newStatus: string) {
    if (newStatus === status) { setOpen(false); return }
    setOpen(false)
    const prev = status
    setStatus(newStatus) // optimistic update
    startTransition(async () => {
      const result = await setBookingStatus(bookingId, newStatus)
      if (!result?.success) {
        setStatus(prev) // revert on error
      } else {
        router.refresh()
      }
    })
  }

  const s = STATUS_MAP[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isPending}
        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity cursor-pointer select-none
          ${s.className} ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
        title="Klikk for å endre status"
      >
        {isPending ? '…' : s.label}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-black/[0.08] py-1 min-w-[160px]">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#F8F7F4] transition-colors flex items-center gap-2
                ${opt.value === status ? 'opacity-50 cursor-default' : ''}`}
            >
              <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                opt.className.replace('text-', 'bg-').replace(/bg-\S+\s/, '')
                  .split(' ')[0]
              }`} />
              <span className={opt.value === status ? 'text-gray-400' : 'text-[#2B2B2B]'}>
                {opt.label}
              </span>
              {opt.value === status && (
                <span className="ml-auto text-[10px] text-gray-400">nå</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
