/* src/components/purchase-orders/internal/CreatePOCard.tsx */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";

export default function CreatePOCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <FilePlus2 className="h-6 w-6" aria-hidden />
          <CardTitle className="text-lg">Create PO</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Start a new internal purchase order from scratch.
        </p>
      </CardHeader>
      <CardContent>
        <Button asChild variant="secondary" className="h-12 w-full text-base">
          <Link href="/purchase-orders/add-internal/create">Create New PO</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
