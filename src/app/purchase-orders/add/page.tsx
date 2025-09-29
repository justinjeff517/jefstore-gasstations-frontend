"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Truck,
  User,
  MapPin,
  Droplet,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

type PurchaseOrder = {
  id: string;
  date: string;
  product: string;
  po_number: string;
  plate_number: string;
  route: string;
  driver: string;
  quantity_liters: number;
  created: string;
};

export default function Page() {
  const [poNumber, setPoNumber] = useState("");
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    setOrder(null);

    if (!poNumber.trim()) {
      setMessage({ kind: "error", text: "Please enter a PO number." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/purchase-orders/verify?po_number=${encodeURIComponent(poNumber)}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
        setMessage({ kind: "success", text: "Purchase order found." });
      } else {
        setMessage({ kind: "error", text: data.error || "Unknown error" });
      }
    } catch {
      setMessage({ kind: "error", text: "Failed to fetch purchase order." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-4 sm:p-6 space-y-4">
      {/* Arrow return link */}
      <div className="flex items-center gap-2">
        <Link
          href="/purchase-orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Back to Purchase Orders"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <h1 className="text-lg font-semibold">Add Purchase Order</h1>
      </div>

      <form onSubmit={handleVerify} className="space-y-3">
        <Input
          placeholder="Enter PO Number (e.g., 1234)"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          className="w-full"
          inputMode="numeric"
          autoComplete="off"
        />

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Checking..." : "Verify"}
        </Button>
      </form>

      {message && (
        <Alert
          variant={message.kind === "error" ? "destructive" : "default"}
          className="flex items-start space-x-2"
          role="status"
        >
          {message.kind === "error" ? (
            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          )}
          <div>
            <AlertTitle>{message.kind === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      {order && (
        <div className="rounded-lg border p-4 text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <p>
              <strong>PO Number:</strong> {order.po_number}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4" />
            <p>
              <strong>Product:</strong> {order.product}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <p>
              <strong>Plate No.:</strong> {order.plate_number}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <p>
              <strong>Driver:</strong> {order.driver}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <p>
              <strong>Route:</strong> {order.route}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4" />
            <p>
              <strong>Quantity:</strong> {order.quantity_liters} L</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <p>
              <strong>Date:</strong> {order.date}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <p>
              <strong>Created:</strong>{" "}
              {formatDistanceToNow(parseISO(order.created), { addSuffix: true })}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
