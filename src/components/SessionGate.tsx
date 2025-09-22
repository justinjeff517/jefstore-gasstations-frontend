"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = new Set<string>(["/login"]);

export default function SessionGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session && !PUBLIC_PATHS.has(pathname || "/")) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [session, status, pathname, router]);

  if (status === "loading") return null;
  if (!session && !PUBLIC_PATHS.has(pathname || "/")) return null;

  return <>{children}</>;
}
