import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Fuel, ShoppingBag, FileText, Settings, TrendingUp } from 'lucide-react'

export default function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today</CardTitle>
          <CardDescription>Quick snapshot</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground">Total Sales</div>
            <div className="mt-1 flex items-center gap-1 text-lg font-semibold">
              <TrendingUp size={18} />
              <span>₱0.00</span>
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground">Dispenses</div>
            <div className="mt-1 text-lg font-semibold">0</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/dispenses" className="rounded-2xl border p-4 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <Fuel />
            <div>
              <div className="text-sm font-medium">Dispenses</div>
              <div className="text-xs text-muted-foreground">Record nozzle output</div>
            </div>
          </div>
        </Link>

        <Link href="/sales" className="rounded-2xl border p-4 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <ShoppingBag />
            <div>
              <div className="text-sm font-medium">Sales</div>
              <div className="text-xs text-muted-foreground">Add receipts</div>
            </div>
          </div>
        </Link>

        <Link href="/reports" className="rounded-2xl border p-4 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <FileText />
            <div>
              <div className="text-sm font-medium">Reports</div>
              <div className="text-xs text-muted-foreground">Daily & monthly</div>
            </div>
          </div>
        </Link>

        <Link href="/settings" className="rounded-2xl border p-4 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <Settings />
            <div>
              <div className="text-sm font-medium">Settings</div>
              <div className="text-xs text-muted-foreground">Station & users</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href="/dispenses">New Dispense</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/sales">New Sale</Link>
        </Button>
      </div>
    </div>
  )
}
