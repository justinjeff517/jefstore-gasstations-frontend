'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
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
  const { data: session, status } = useSession()
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

  if (status !== 'authenticated') return null

  const email = session?.user?.email ?? '—'
  const name =
    session?.user?.name ?? (email.includes('@') ? email.split('@')[0] : 'You')
  const img = session?.user?.image ?? ''
  const initials =
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'YO'
  const expiry = session?.expires
    ? new Date(session.expires).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  return (
    <main className="mx-auto max-w-md p-4 pb-24">
      <h1 className="mb-3 text-xl font-semibold tracking-tight">Settings</h1>

      {/* Profile */}
      <section aria-labelledby="profile" className="mt-2 rounded-xl border">
        <h2 id="profile" className="sr-only">
          Profile
        </h2>
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          </div>
        </div>
        <ul className="divide-y">
          <Row label="Session expiry" value={expiry} />
          <li className="px-4">
            <Button
              variant="destructive"
              className="my-2 h-10 w-full"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign out
            </Button>
          </li>
        </ul>
      </section>

      {/* Notifications */}
      <section aria-labelledby="notifications" className="mt-4 rounded-xl border">
        <h2 id="notifications" className="sr-only">
          Notifications
        </h2>
        <ul className="divide-y">
          <ToggleRow
            title="Enable push"
            subtitle="Sales, reports, and system alerts"
            checked={s.enableNotifications}
            onChange={(v) => setS({ ...s, enableNotifications: v })}
          />
          <ToggleRow
            title="Low stock alerts"
            subtitle="Notify when inventory is low"
            checked={s.lowStockAlerts}
            onChange={(v) => setS({ ...s, lowStockAlerts: v })}
          />
        </ul>
      </section>

      {/* Data */}
      <section aria-labelledby="data" className="mt-4 rounded-xl border">
        <h2 id="data" className="sr-only">
          Data
        </h2>
        <ul className="divide-y">
          <ToggleRow
            title="Automatic backup"
            subtitle="Save encrypted snapshots"
            checked={s.autoBackup}
            onChange={(v) => setS({ ...s, autoBackup: v })}
          />
<li className="px-4">
  <Link
    href="/settings/fuel-balance"
    aria-label="Fuel Balance"
    className="group flex h-12 w-full items-center justify-between text-left rounded-lg px-2 transition
               hover:bg-muted/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span className="text-sm font-medium">Fuel Balance</span>
    <ChevronRight className="h-4 w-4 opacity-70 transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-1" />
  </Link>
</li>


          <li className="px-4">
            <button
              className="flex h-12 w-full items-center justify-between text-left"
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex h-14 items-center justify-between gap-3 px-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="max-w-[60%] truncate text-right text-sm font-medium">{value}</div>
    </li>
  )
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string
  subtitle: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <li className="flex h-14 items-center justify-between gap-3 px-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </li>
  )
}
