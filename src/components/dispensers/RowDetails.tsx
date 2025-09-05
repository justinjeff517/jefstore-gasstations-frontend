'use client'

import type { Row } from '@/lib/dispensers/types'

export function RowDetails({ row }: { row: Row }) {
  const items = [
    { value: row.dispenser, label: 'Dispenser' },
    { value: row.nozzle, label: 'Nozzle' },
    { value: row.date, label: 'Date' },
    { value: row.beginning_register, label: 'Beginning Register' },
    { value: row.ending_register, label: 'Ending Register' },
    { value: row.analog_register, label: 'Analog Register' },
    { value: row.calibration, label: 'Calibration' },
    { value: row.price?.toFixed(2), label: 'Price' },
    { value: row.po, label: 'PO' },
    { value: row.cash, label: 'Cash' },
  ]

  return (
    <div className="divide-y rounded-lg border bg-white text-sm">
      {items.map(({ value, label }) => (
        <div
          key={label}
          className="flex items-center justify-between px-3 py-2"
        >
          <span className="font-medium text-gray-600">{label}</span>
          <span className="text-gray-900">{value ?? '-'}</span>
        </div>
      ))}
    </div>
  )
}
