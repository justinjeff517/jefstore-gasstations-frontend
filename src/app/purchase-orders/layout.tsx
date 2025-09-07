// app/purchase-orders/layout.tsx
import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils" // optional; remove if you don't use cn()

import { PurchaseOrdersBreadcrumbs } from "@/components/purchase-orders/PurchaseOrdersBreadcrumbs"
export default function PurchaseOrdersLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn("min-h-dvh pb-16")}>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center">
          <PurchaseOrdersBreadcrumbs />
        </div>
      </header>

      <Separator />

      <main className="mx-auto max-w-5xl px-4 py-4">
        {children}
      </main>


    </div>
  )
}
