"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fuel, ShoppingBag, FileText, Settings, BottleWine, ClipboardList } from "lucide-react";

const items = [
  { href: "/dispensers", label: "Dispensers", Icon: Fuel },
  { href: "/purchase-orders", label: "POs", Icon: ClipboardList }, // ← added
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="Primary bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-md">
        <ul className="grid grid-cols-6">
          {items.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
            return (
              <li key={href} className="relative">
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
        </ul>
      </div>
    </nav>
  );
}
