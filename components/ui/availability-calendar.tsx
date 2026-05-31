'use client'

import { useState } from 'react'

interface BookedRange {
  start: string // YYYY-MM-DD
  end: string   // YYYY-MM-DD
}

interface AvailabilityCalendarProps {
  bookedRanges:   BookedRange[]
  inventoryCount: number   // total units of this product at this location
}

function addMonths(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(1) // Must set day=1 FIRST — otherwise May 31 + 1 month = June 31 → overflows to July
  d.setMonth(d.getMonth() + n)
  return d
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun → make Mon=0
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

const WEEKDAYS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']
const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
]

export function AvailabilityCalendar({ bookedRanges, inventoryCount }: AvailabilityCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [offset, setOffset] = useState(0) // 0 = this month, 1 = next month

  // Count overlapping bookings per date — a date is "opptatt" only when
  // the count reaches inventoryCount (all units taken)
  const bookingCountMap = new Map<string, number>()
  for (const range of bookedRanges) {
    const cur = new Date(range.start)
    const end = new Date(range.end)
    while (cur <= end) {
      const d = ymd(cur)
      bookingCountMap.set(d, (bookingCountMap.get(d) ?? 0) + 1)
      cur.setDate(cur.getDate() + 1)
    }
  }

  // Render two months side by side
  const months = [addMonths(today, offset), addMonths(today, offset + 1)]

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-[#2B2B2B]">Tilgjengelighet</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset(o => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F8F7F4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            aria-label="Forrige måneder"
          >
            ‹
          </button>
          <button
            onClick={() => setOffset(o => Math.min(10, o + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F8F7F4] transition-colors text-sm"
            aria-label="Neste måneder"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {months.map(month => {
          const year  = month.getFullYear()
          const mon   = month.getMonth()
          const days  = getDaysInMonth(year, mon)
          const start = getFirstDayOfWeek(year, mon)

          return (
            <div key={`${year}-${mon}`}>
              <p className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-3 text-center">
                {MONTHS_NO[mon]} {year}
              </p>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-[10px] font-semibold text-gray-400 pb-1">{d}</div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: start }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Day cells */}
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const isPast   = dateStr < ymd(today)
                  const isToday  = dateStr === ymd(today)
                  const isBooked = (bookingCountMap.get(dateStr) ?? 0) >= inventoryCount

                  let cellCls = 'w-full aspect-square flex items-center justify-center rounded-lg text-xs font-medium '

                  if (isPast) {
                    cellCls += 'text-gray-300 cursor-default'
                  } else if (isBooked) {
                    cellCls += 'bg-red-100 text-red-500 cursor-default'
                  } else if (isToday) {
                    cellCls += 'bg-[#8FA68B] text-white font-bold'
                  } else {
                    cellCls += 'bg-[#EBF0E7] text-[#5A7A55] hover:bg-[#8FA68B] hover:text-white transition-colors cursor-default'
                  }

                  return (
                    <div key={day} className={cellCls} title={isBooked ? 'Opptatt' : isPast ? '' : 'Ledig'}>
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-black/[0.04]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#EBF0E7]" />
          <span className="text-xs text-gray-500">Ledig</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100" />
          <span className="text-xs text-gray-500">Opptatt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#8FA68B]" />
          <span className="text-xs text-gray-500">I dag</span>
        </div>
      </div>
    </div>
  )
}
