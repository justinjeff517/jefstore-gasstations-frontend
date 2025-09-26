"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Pump = {
  id: number;
  dispenser_name: string;
  name: string;
};

export default function Page() {
  const { dispenser_name } = useParams();
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dispenser_name) return;
    const fetchPumps = async () => {
      try {
        const resp = await fetch(
          `/api/pumps/get-by-dispenser-name?dispenser_name=${encodeURIComponent(
            dispenser_name as string
          )}`
        );
        if (!resp.ok) throw new Error("Failed to fetch pumps");
        const data = await resp.json();
        setPumps(data);
      } catch (err: any) {
        setError(err.message || "Error fetching pumps");
      } finally {
        setLoading(false);
      }
    };
    fetchPumps();
  }, [dispenser_name]);

  if (!dispenser_name) {
    return <p className="p-4 text-gray-500">No dispenser_name provided.</p>;
  }

  if (loading) {
    return <p className="p-4">Loading pumps…</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <main className="p-4">
      <h1 className="text-lg font-semibold mb-4">
        Pumps for {dispenser_name}
      </h1>
      <ul className="space-y-2">
        {pumps.map((p) => (
          <li key={p.id} className="rounded border p-3">
            {p.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
