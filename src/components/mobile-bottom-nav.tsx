"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Fuel, ClipboardList, Settings } from "lucide-react";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/dispensers", label: "Dispensers", Icon: Fuel },
  { href: "/purchase-orders", label: "POs", Icon: ClipboardList },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <nav
      role="navigation"
      aria-label="Primary bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-md">
        <ul className="flex">
          {items.map(({ href, label, Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));
            return (
              <li key={href} className="relative flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px] touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={22} strokeWidth={2} aria-hidden />
                  <span className="truncate leading-none">{label}</span>
                  <span
                    className={`pointer-events-none absolute bottom-0 h-0.5 w-8 rounded-full ${
                      active ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
