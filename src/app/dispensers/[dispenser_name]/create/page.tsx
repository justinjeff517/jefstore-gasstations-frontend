"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const { dispenser_name } = useParams();
  const dn = Array.isArray(dispenser_name) ? dispenser_name[0] : dispenser_name;
  const { data, status } = useSession();
  const email = data?.user?.email;
  const role = data?.user?.role;

  return (
    <div className="p-4 space-y-1">
      <div className="text-xs text-muted-foreground">
        {status === "loading" ? "Checking session…" : email ? `Signed in as ${email}` : "Not signed in"}
        <br/> 
        {role && ` (${role})`} 
      </div>
      <h1 className="text-lg font-semibold">Create Dispenser {dn}</h1>
      <p className="text-sm text-muted-foreground mt-1">Fill in the details below.</p>
    </div>
  );
}
