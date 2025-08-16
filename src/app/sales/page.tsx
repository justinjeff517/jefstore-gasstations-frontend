'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

type NozzleItem = {
  dispenser: string
  beginning_register: number
  calibration: number
  po: number
  cash: number
  price: number
  ending_register: number
  analog_register: number
}

const nozzles: NozzleItem[] = [
  {
    dispenser: 'Dispenser A — Regular',
    beginning_register: 1200,
    calibration: 0,
    po: 100,
    cash: 200,
    price: 65.0,
    ending_register: 1500,
    analog_register: 1502,
  },
  {
    dispenser: 'Dispenser A — Diesel',
    beginning_register: 1500,
    calibration: 0,
    po: 150,
    cash: 250,
    price: 68.5,
    ending_register: 1900,
    analog_register: 1898,
  },
  {
    dispenser: 'Dispenser B — Regular',
    beginning_register: 1100,
    calibration: 0,
    po: 120,
    cash: 180,
    price: 65.0,
    ending_register: 1400,
    analog_register: 1401,
  },
  {
    dispenser: 'Dispenser B — Diesel',
    beginning_register: 1400,
    calibration: 0,
    po: 130,
    cash: 220,
    price: 68.5,
    ending_register: 1750,
    analog_register: 1750,
  },
]

const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

type Line = { desc: string; liters: number | string; amount: number | string }

function buildLines(n: NozzleItem): Line[] {
  const sold = n.po + n.cash
  return [
    { desc: 'Price (₱/L)',        liters: '-',                   amount: currency(n.price) },
    { desc: 'Beginning Register', liters: n.beginning_register, amount: n.beginning_register * n.price },
    { desc: 'Calibration',        liters: n.calibration,         amount: n.calibration * n.price },
    { desc: 'PO',                 liters: n.po,                  amount: n.po * n.price },
    { desc: 'Cash',               liters: n.cash,                amount: n.cash * n.price },
    { desc: 'Sold (PO + Cash)',   liters: sold,                  amount: sold * n.price },
    { desc: 'Ending Register',    liters: n.ending_register,     amount: n.ending_register * n.price },
    { desc: 'Analog Register',    liters: n.analog_register,     amount: n.analog_register * n.price },
    
  ]
}

function colorClasses(title: string) {
  const t = title.toLowerCase()
  if (t.includes('regular')) {
    return {
      cardBorder: 'border-green-500',
      badge: 'bg-green-500 text-white',
    }
  }
  if (t.includes('diesel')) {
    return {
      cardBorder: 'border-yellow-500',
      badge: 'bg-yellow-500 text-black',
    }
  }
  return { cardBorder: 'border-gray-300', badge: 'bg-gray-300 text-black' }
}

function TableCard({ title, lines }: { title: string; lines: Line[] }) {
  const { cardBorder, badge } = colorClasses(title)
  return (
    <Card className={`rounded-2xl shadow-sm border-2 ${cardBorder}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge className={`flex items-center gap-1 ${badge}`}>
          <Check className="w-3 h-3" />
          Submitted
        </Badge>
      </CardHeader>
      <CardContent>
   
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Liters</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((l, i) => (
              <TableRow key={i}>
                <TableCell>{l.desc}</TableCell>
                <TableCell className="text-right">
                  {typeof l.liters === 'number' ? l.liters.toLocaleString() : l.liters}
                </TableCell>
                <TableCell className="text-right">
                  {typeof l.amount === 'number' ? currency(l.amount) : l.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const tables = useMemo(
    () =>
      nozzles.map((n) => ({
        title: n.dispenser,
        lines: buildLines(n),
      })),
    []
  )

  return (
    <div className="p-4 space-y-4">
      {tables.map(({ title, lines }) => (
        <TableCard key={title} title={title} lines={lines} />
      ))}
    </div>
  )
}
