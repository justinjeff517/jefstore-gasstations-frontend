//app/dispensers/page.tsx
"use client";

import { useSession } from "next-auth/react";
import DispensersHeader from "@/components/dispensers/DispensersHeader";
import DispensersSkeleton from "@/components/dispensers/DispensersSkeleton";
import EmptyState from "@/components/dispensers/EmptyState";
import PumpListCard from "@/components/dispensers/PumpListCard";
import useLatestDispensers from "@/components/dispensers/useLatestDispensers";

export default function Page() {
  const { data: session } = useSession();
  const location = session?.user?.location ?? "";
  const { dispensers, loading, error, refresh, hasEndpoint } = useLatestDispensers(location);

  return (
    <main className="mx-auto w-full max-w-md p-3 sm:p-4">
      <DispensersHeader location={location} loading={loading} onRefresh={refresh} disabled={!hasEndpoint} />

      {error && (
        <div className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {loading && <DispensersSkeleton />}

      {!loading && (dispensers.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid grid-cols-1 gap-3">
          {dispensers.map((d) => (
            <PumpListCard key={d.id} dispenser={d} linkBase="dispensers" />
          ))}
        </section>
      ))}
    </main>
  );
}
