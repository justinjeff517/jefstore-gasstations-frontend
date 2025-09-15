"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [poNumber, setPoNumber] = useState("");
  const [message, setMessage] = useState("");

  function handleVerify() {
    // ✅ Example: PO number must start with "PO-" and have digits after
    const isValid = /^PO-\d+$/.test(poNumber.trim());

    if (isValid) {
      setMessage("✅ PO number is valid.");
    } else {
      setMessage("❌ Invalid PO number. Format: PO-####");
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <h1 className="mb-4 text-lg font-semibold">Add Purchase Order</h1>

      <div className="space-y-4">
        <Input
          placeholder="Enter PO Number (e.g., PO-1025)"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        />
        <Button onClick={handleVerify}>Verify</Button>

        {message && (
          <p className="text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
