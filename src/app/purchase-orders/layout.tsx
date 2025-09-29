import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import PurchaseOrdersBreadcrumb from "@/components/purchase-orders/purchase-orders-breadcrumb";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-3">
        <PurchaseOrdersBreadcrumb />
      </header>
      <Separator className="mb-4" />
      {children}
    </main>
  );
}
