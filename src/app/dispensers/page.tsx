"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Fuel } from "lucide-react";

type Dispenser = {
  id: string;
  name: string;
};

export default function Page() {
  const { data: session } = useSession();
  const location = session?.user?.location ?? "";

  const [dispensers, setDispensers] = useState<Dispenser[]>([]);

  useEffect(() => {
    if (!location) return;
    fetch(`/api/dispensers/get-by-location?location=${location}`)
      .then((res) => res.json())
      .then((data) => {
        setDispensers(data); // assuming API returns an array [{id, name}, ...]
      })
      .catch((err) => console.error("Failed to load dispensers", err));
  }, [location]);

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-4 flex items-center gap-2">
        <Fuel className="h-5 w-5" aria-hidden />
        <h1 className="text-xl font-semibold tracking-tight">
          Dispensers for {location || "Unknown"}
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-3">
        {dispensers.map((d) => (
          <Link key={d.id} href={`/dispensers/${d.name}`} className="block">
            <Card className="transition hover:shadow-sm active:scale-[0.99]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{d.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary" className="font-mono text-xs">
                  id: {d.id}
                </Badge>
              </CardContent>
              <CardFooter className="justify-end pt-2">
                <span className="inline-flex items-center text-sm font-medium">
                  Open <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
