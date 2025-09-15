// No "use client" needed here (no hooks). Add it if your setup requires.
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
          {rows.map((po) => (
            <TableRow key={po.id} className="hover:bg-muted/40">
              <TableCell>
                {new Date(po.date + "T00:00:00").toLocaleDateString("en-PH", {
                  month: "short",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <Link
                  href={`/purchase-orders/${po.po_number}`}
                  className="underline underline-offset-4"
                >
                  {po.po_number}
                </Link>
              </TableCell>
              <TableCell>{po.vehicle}</TableCell>
              <TableCell>{po.product}</TableCell>
              <TableCell className="text-right">{po.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
