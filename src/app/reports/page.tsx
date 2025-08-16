// app/reports/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Report = {
  date: string
  employees: string[]
  amount: number
}

const peso = (v: number) =>
  `₱ ${v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatHumanDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = date.toLocaleString('en-US', { month: 'short' }) + '.'
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export default function Page() {
  const router = useRouter()

  const reports: Report[] = [
    { date: '2025-08-17', employees: ['John Doe', 'Maria Lee'], amount: 1200.5 },
    { date: '2025-08-16', employees: ['Jane Smith', 'Carlos Cruz'], amount: 8450 },
    { date: '2025-08-15', employees: ['Alex Tan', 'Sophia Reyes'], amount: 3500 },
  ]

  return (
    <div className="mx-auto max-w-md p-4">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r, i) => (
            <TableRow
              key={i}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/reports/${r.date}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(`/reports/${r.date}`)
                }
              }}
              className="cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <TableCell>
                <div className="font-medium">{r.date}</div>
                <div className="text-xs text-muted-foreground">
                  {formatHumanDate(r.date)}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <div className="truncate">
                  {r.employees.join(', ')}
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {peso(r.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
