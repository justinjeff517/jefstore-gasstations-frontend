//src/components/dispensers/useLatestDispensers.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispenser } from "./format";

export default function useLatestDispensers(location: string) {
  const [dispensers, setDispensers] = useState<Dispenser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    if (!location) return "";
    const q = encodeURIComponent(location);
    return `/api/pumps/get-latest-pump-inventories-by-location?location=${q}`;
  }, [location]);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { cache: "no-store", next: { revalidate: 0 } });
      const data = await res.json();
      setDispensers(Array.isArray(data) ? (data as Dispenser[]) : []);
    } catch (e) {
      setError("Failed to load latest inventories");
      setDispensers([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { dispensers, loading, error, refresh: fetchData, hasEndpoint: !!endpoint };
}
