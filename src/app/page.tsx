'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Fuel, ShoppingBag, FileText, Settings, BottleWine } from 'lucide-react'

const tiles = [
  { href: '/dispensers', label: 'Dispensers', Icon: Fuel },
  { href: '/lubricants', label: 'Lubricants', Icon: BottleWine },
  { href: '/sales', label: 'Sales', Icon: ShoppingBag },
  { href: '/reports', label: 'Reports', Icon: FileText },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-24 pt-6">
      <h1 className="mb-6 text-center text-2xl font-bold">Gas Station ERP</h1>

      <section className="grid grid-cols-2 gap-4">
        {tiles.map(({ href, label, Icon }) => (
          <Link key={href} href={href}>
            <Card className="flex flex-col items-center justify-center p-6 hover:bg-accent">
              <Icon size={28} strokeWidth={2} className="mb-2" />
              <span className="font-medium">{label}</span>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  )
}
