'use client'

import type { Row } from '@/lib/dispensers/types'
import { Input } from '@/components/ui/input'
import IsoDateField from '@/components/iso-date-format'


export function RowEditForm({ row }: { row: Row }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">dispenser</div>
        <Input name="dispenser" defaultValue={row.dispenser} className="text-center h-9" />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">nozzle</div>
        <Input name="nozzle" defaultValue={row.nozzle} className="text-center h-9" />
      </div>

      <div className="space-y-1 min-w-0">

<IsoDateField defaultValue={row.date} />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">
          beginning_register ({row.unit})
        </div>
        <Input
          name="beginning_register"
          type="text"
          inputMode="decimal"
          defaultValue={row.beginning_register}
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">
          ending_register ({row.unit})
        </div>
        <Input
          name="ending_register"
          type="text"
          inputMode="decimal"
          placeholder="Enter ending"
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">analog_register</div>
        <Input
          name="analog_register"
          type="text"
          inputMode="decimal"
          placeholder="Enter analog"
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">
          calibration ({row.unit})
        </div>
        <Input
          name="calibration"
          type="text"
          inputMode="decimal"
          defaultValue={row.calibration}
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">price (₱/L)</div>
        <Input
          name="price"
          type="text"
          inputMode="decimal"
          defaultValue={row.price}
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">po ({row.unit})</div>
        <Input
          name="po"
          type="text"
          inputMode="decimal"
          defaultValue={row.po}
          className="text-center h-9"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="text-[11px] font-medium opacity-70 truncate">cash ({row.unit})</div>
        <Input
          name="cash"
          type="text"
          inputMode="decimal"
          defaultValue={row.cash}
          className="text-center h-9"
        />
      </div>
    </div>
  )
}
