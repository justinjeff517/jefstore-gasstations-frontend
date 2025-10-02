// components/purchase-orders/LatestPurchaseOrders.tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PurchaseOrder, PurchaseOrderDialog } from "./PurchaseOrderDialog";

type Props = {
  data: PurchaseOrder[];
};

export default function LatestPurchaseOrders({ data }: Props) {
  const rows = data.slice(0, 4);

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>PO #</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((po) => {
            const dateShort = new Date(po.date + "T00:00:00").toLocaleDateString("en-PH", {
              month: "short",
              day: "2-digit",
            });

            const row = (
              <TableRow
                className="hover:bg-muted/40 cursor-pointer"
                key={po.id}
              >
                <TableCell>{dateShort}</TableCell>
                <TableCell className="underline underline-offset-4">
                  {po.po_number}
                </TableCell>
                <TableCell>{po.vehicle}</TableCell>
                <TableCell>{po.product}</TableCell>
                <TableCell className="text-right">{po.quantity}</TableCell>
              </TableRow>
            );

            return (
              <PurchaseOrderDialog key={po.id} po={po}>
                {row}
              </PurchaseOrderDialog>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
