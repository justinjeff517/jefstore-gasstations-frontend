'use client'

import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { RowSummary } from '@/components/dispensers/RowSummary'
import { RowDetails } from '@/components/dispensers/RowDetails'
import { RowEditForm } from '@/components/dispensers/RowEditForm'
import type { Row, UpdateRecord } from '@/lib/dispensers/types'

export function RowCard({
  row,
  isEditing,
  baseAnalog,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: {
  row: Row
  isEditing: boolean
  baseAnalog: number
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (patch: Partial<UpdateRecord>) => void
}) {
  const sold = row.po + row.cash
  return (
    <div className="flex flex-col gap-3">
      <div className="font-medium text-base break-words">
        {row.product_label} <span className="opacity-60 text-xs">({row.dispenser} · {row.nozzle})</span>
      </div>
      {!isEditing && (
        <>
          <RowSummary beginning={row.beginning_register} sold={sold} ending={row.ending_register} unit={row.unit} price={row.price} />
          <RowDetails row={row} />
          <Button onClick={onStartEdit} variant="secondary" className="w-full flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Change
          </Button>
        </>
      )}
      {isEditing && (
        <RowEditForm row={row} baseAnalog={baseAnalog} onSave={onSaveEdit} onCancel={onCancelEdit} />
      )}
    </div>
  )
}
