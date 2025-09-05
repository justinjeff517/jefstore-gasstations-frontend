'use client'

import { currency } from '@/lib/dispensers/utils'

export function RowSummary({
  beginning,
  sold,
  ending,
  unit,
  price,
}: {
  beginning: number
  sold: number
  ending: number
  unit: string
  price: number
}) {
  const items = [
    { label: 'Beginning', qty: beginning },
    { label: 'Sold (PO+Cash)', qty: sold },
    { label: 'Ending', qty: ending },
  ]

  return (
    <div className="divide-y rounded-lg border bg-white text-sm">
      {items.map(({ label, qty }) => (
        <div
          key={label}
          className="flex items-center justify-between px-3 py-2"
        >
          <div className="flex flex-col">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="text-xs text-gray-500">
              {currency(qty * price)}
            </span>
          </div>
          <span className="font-semibold text-gray-900">
            {qty.toLocaleString()} {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
