/* app/purchase-orders/add-internal/verify/page.tsx */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VerifyPOCard from "@/components/purchase-orders/internal/VerifyPOCard";
import ResultCard from "@/components/purchase-orders/internal/ResultCard";
import CreatePOCard from "@/components/purchase-orders/internal/CreatePOCard";
import type { FuelPO } from "@/components/purchase-orders/internal/types";

export default function Page() {
  const [result, setResult] = useState<FuelPO | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/purchase-orders">
            <ArrowLeft className="h-5 w-5" aria-hidden />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Add Internal PO</h1>
      </div>

      <div className="flex flex-col gap-4">
        <VerifyPOCard onVerified={setResult} onError={setError} />
        <ResultCard result={result} />
        <CreatePOCard />
      </div>
    </main>
  );
}
