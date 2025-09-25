"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Fuel, Settings } from "lucide-react";

const tiles = [
  { href: "/dispensers", label: "Dispensers", Icon: Fuel },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  if (status !== "authenticated") return null;

  const name =
    session?.user?.name ??
    session?.user?.email?.split("@")[0] ??
    "User";
  const email = session?.user?.email ?? "—";
  const image = session?.user?.image ?? "";
  const location = session?.user?.location ?? "";
  const role = session?.user?.role ?? "";

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-24 pt-6 space-y-6">
      <header className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight">
            Welcome, {name}
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            {email}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {location}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {role}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        {tiles.map(({ href, label, Icon }) => (
          <Link key={href} href={href}>
            <Card className="flex flex-col items-center justify-center p-6 hover:bg-accent">
              <Icon size={28} strokeWidth={2} className="mb-2" />
              <span className="font-medium">{label}</span>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
