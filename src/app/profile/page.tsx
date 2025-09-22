"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Fuel, ClipboardList, Settings, LogOut, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CREATED_KEY = "session.created_at";

// ✅ Profile is a normal tab now
const items = [
  { href: "/dispensers", label: "Dispensers", Icon: Fuel },
  { href: "/purchase-orders", label: "POs", Icon: ClipboardList },
  { href: "/settings", label: "Settings", Icon: Settings },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status !== "authenticated") return null;

  const email = session?.user?.email ?? "—";
  const name =
    session?.user?.name ??
    (email && email.includes("@") ? email.split("@")[0] : "You");
  const img = session?.user?.image ?? "";

  const [createdAt, setCreatedAt] = useState<string | null>(null);
  useEffect(() => {
    if (status !== "authenticated") return;
    const v = localStorage.getItem(CREATED_KEY);
    const valid = v && !Number.isNaN(new Date(v).getTime());
    if (valid) setCreatedAt(v!);
    else {
      const now = new Date().toISOString();
      localStorage.setItem(CREATED_KEY, now);
      setCreatedAt(now);
    }
  }, [status]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
      }),
    []
  );
  const expiryStr = session?.expires ? fmt.format(new Date(session.expires)) : "—";
  const createdStr = createdAt ? fmt.format(new Date(createdAt)) : "—";

  const handleSignOut = async () => {
    try {
      localStorage.removeItem(CREATED_KEY);
    } catch {}
    await signOut({ callbackUrl: "/login" });
  };

  const initials =
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "YO";

  return (
    <>
      <nav
        role="navigation"
        aria-label="Primary bottom navigation"
        className={[
          "fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur",
          "pb-[env(safe-area-inset-bottom)]",
          "supports-[backdrop-filter]:bg-background/60",
        ].join(" ")}
      >
        <div className="mx-auto max-w-md">
          <ul className="flex">
            {items.map(({ href, label, Icon }) => {
              const active =
                pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
              return (
                <li key={href} className="relative flex-1">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                    <span className="leading-none truncate">{label}</span>
                    <span
                      className={[
                        "pointer-events-none absolute bottom-0 h-0.5 w-8 rounded-full",
                        active ? "bg-primary" : "bg-transparent",
                      ].join(" ")}
                    />
                  </Link>
                </li>
              );
            })}

            {/* Account tab (avatar) still opens Details dialog */}
            <li className="relative flex-1">
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                aria-label={`Account for ${name}`}
                className={[
                  "relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  "text-muted-foreground hover:text-foreground",
                  "touch-manipulation",
                ].join(" ")}
              >
                <Avatar className="h-[22px] w-[22px]">
                  <AvatarImage src={img} alt={name} />
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <span className="leading-none truncate">You</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Details dialog (Profile button removed) */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          className="sm:max-w-md rounded-2xl"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <DialogHeader>
            <DialogTitle>Login Session</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium truncate max-w-[60%] text-right">{email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{createdStr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expiry</span>
              <span className="font-medium">{expiryStr}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
