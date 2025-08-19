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
  nozzle: string
  date: string
  beginning_register: number
  ending_register: number
  analog_register: number
  calibration: number
  price: number
  po: number
  cash: number
}

const nozzles: NozzleItem[] = [
  {
    dispenser: 'Dispenser A — Regular',
    nozzle: 'nozzle_1',
    date: '2025-08-19',
    beginning_register: 1200,
    ending_register: 1500,
    analog_register: 1502,
    calibration: 0,
    price: 65.0,
    po: 100,
    cash: 200,
  },
  {
    dispenser: 'Dispenser A — Diesel',
    nozzle: 'nozzle_2',
    date: '2025-08-19',
    beginning_register: 1500,
    ending_register: 1900,
    analog_register: 1898,
    calibration: 0,
    price: 68.5,
    po: 150,
    cash: 250,
  },
  {
    dispenser: 'Dispenser B — Regular',
    nozzle: 'nozzle_1',
    date: '2025-08-19',
    beginning_register: 1100,
    ending_register: 1400,
    analog_register: 1401,
    calibration: 0,
    price: 65.0,
    po: 120,
    cash: 180,
  },
  {
    dispenser: 'Dispenser B — Diesel',
    nozzle: 'nozzle_2',
    date: '2025-08-19',
    beginning_register: 1400,
    ending_register: 1750,
    analog_register: 1750,
    calibration: 0,
    price: 68.5,
    po: 130,
    cash: 220,
  },
]

const currency = (v: number) =>
  `₱ ${Number.isFinite(v) ? v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`

function colorClasses(title: string) {
  const t = title.toLowerCase()
  if (t.includes('regular')) return { cardBorder: 'border-green-500', badge: 'bg-green-500 text-white' }
  if (t.includes('diesel')) return { cardBorder: 'border-yellow-500', badge: 'bg-yellow-500 text-black' }
  return { cardBorder: 'border-gray-300', badge: 'bg-gray-300 text-black' }
}

function TableCard({ item }: { item: NozzleItem }) {
  const { cardBorder, badge } = colorClasses(item.dispenser)
  const sold = item.po + item.cash

  return (
    <Card className={`rounded-2xl shadow-sm border-2 ${cardBorder}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{item.dispenser}</CardTitle>
            <Badge className={`flex items-center gap-1 ${badge}`}>
              <Check className="w-3 h-3" />
              Submitted
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Nozzle: {item.nozzle}</Badge>
            <Badge variant="secondary">Date: {item.date}</Badge>
          </div>
        </div>
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
            <TableRow>
              <TableCell>Beginning Register</TableCell>
              <TableCell className="text-right">{item.beginning_register.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.beginning_register * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ending Register</TableCell>
              <TableCell className="text-right">{item.ending_register.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.ending_register * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Analog Register</TableCell>
              <TableCell className="text-right">{item.analog_register.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.analog_register * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Calibration</TableCell>
              <TableCell className="text-right">{item.calibration.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.calibration * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price (₱/L)</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">{currency(item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PO</TableCell>
              <TableCell className="text-right">{item.po.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.po * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cash</TableCell>
              <TableCell className="text-right">{item.cash.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(item.cash * item.price)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sold (PO + Cash)</TableCell>
              <TableCell className="text-right">{sold.toLocaleString()}</TableCell>
              <TableCell className="text-right">{currency(sold * item.price)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const tables = useMemo(() => nozzles, [])
  return (
    <div className="p-4 space-y-4">
      {tables.map((item, i) => (
        <TableCard key={`${item.dispenser}-${item.nozzle}-${i}`} item={item} />
      ))}
    </div>
  )
}
