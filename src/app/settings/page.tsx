'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'

type SettingsModel = {
  orgName: string
  currency: 'PHP' | 'USD'
  unit: 'L' | 'pcs' | 'kg'
  priceDecimals: 0 | 2
  enableNotifications: boolean
  lowStockAlerts: boolean
  requirePinOnEdit: boolean
  autoBackup: boolean
}

export default function SettingsPage() {
  const [s, setS] = useState<SettingsModel>({
    orgName: 'JEF Gas Station',
    currency: 'PHP',
    unit: 'L',
    priceDecimals: 2,
    enableNotifications: true,
    lowStockAlerts: true,
    requirePinOnEdit: false,
    autoBackup: true,
  })

  const pricePreview = useMemo(() => {
    const v = 68.5
    const out = s.priceDecimals === 0 ? Math.round(v).toString() : v.toFixed(2)
    const sym = s.currency === 'PHP' ? '₱' : '$'
    return `${sym} ${out}`
  }, [s.currency, s.priceDecimals])

  return (
    <main className="mx-auto max-w-md p-4 pb-24">
      <h1 className="text-xl font-semibold tracking-tight mb-3">Settings</h1>




      {/* Notifications */}
      <section aria-labelledby="notifications" className="rounded-xl border mt-4">
        <h2 id="notifications" className="sr-only">Notifications</h2>
        <ul className="divide-y">
          <li className="flex items-center justify-between gap-3 px-4 h-14">
            <div className="min-w-0">
              <div className="text-sm font-medium">Enable push</div>
              <div className="text-xs text-muted-foreground">Sales, reports, and system alerts</div>
            </div>
            <Switch
              checked={s.enableNotifications}
              onCheckedChange={(v) => setS({ ...s, enableNotifications: v })}
            />
          </li>
          <li className="flex items-center justify-between gap-3 px-4 h-14">
            <div className="min-w-0">
              <div className="text-sm font-medium">Low stock alerts</div>
              <div className="text-xs text-muted-foreground">Notify when inventory is low</div>
            </div>
            <Switch
              checked={s.lowStockAlerts}
              onCheckedChange={(v) => setS({ ...s, lowStockAlerts: v })}
            />
          </li>
        </ul>
      </section>



      {/* Data */}
      <section aria-labelledby="data" className="rounded-xl border mt-4">
        <h2 id="data" className="sr-only">Data</h2>
        <ul className="divide-y">
          <li className="flex items-center justify-between gap-3 px-4 h-14">
            <div className="min-w-0">
              <div className="text-sm font-medium">Automatic backup</div>
              <div className="text-xs text-muted-foreground">Save encrypted snapshots</div>
            </div>
            <Switch
              checked={s.autoBackup}
              onCheckedChange={(v) => setS({ ...s, autoBackup: v })}
            />
          </li>

          {/* Example navigational row (to a subpage) */}
          <li className="px-4">
            <button
              className="w-full flex items-center justify-between h-12 text-left"
              onClick={() => alert('Navigate to data export')}
              aria-label="Data export"
            >
              <span className="text-sm">Export & Reset</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        </ul>
      </section>
    </main>
  )
}
