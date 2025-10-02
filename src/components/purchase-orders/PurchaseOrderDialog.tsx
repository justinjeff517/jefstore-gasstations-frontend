// components/purchase-orders/PurchaseOrderDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export type PurchaseOrder = {
  id: string;
  date: string;
  po_number: string;
  vehicle: string;
  product: string;
  quantity: number;
  driver: string;
  route: string;
};

type Props = {
  po: PurchaseOrder;
  children: React.ReactNode;
};

export function PurchaseOrderDialog({ po, children }: Props) {
  const dateFull = new Date(po.date + "T00:00:00").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Order #{po.po_number}</DialogTitle>
          <DialogDescription>{dateFull}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-medium">{po.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product</span>
            <span className="font-medium">{po.product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">{po.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Driver</span>
            <span className="font-medium">{po.driver}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <span className="font-medium">{po.route}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
