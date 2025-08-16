"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fuel, ShoppingBag, FileText, Settings, BottleWine} from "lucide-react";

const items = [
  { href: "/dispensers", label: "Dispensers", Icon: Fuel },
  { href: "/lubricants", label: "Lubricants", Icon: BottleWine }, // ✅ Best match
  { href: "/sales", label: "Sales", Icon: ShoppingBag },
  { href: "/reports", label: "Reports", Icon: FileText },
  { href: "/settings", label: "Settings", Icon: Settings },
];


export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-md">
        <ul className="grid grid-cols-5">
          {items.map(({ href, label, Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/")) ||
              (href !== "/" && pathname === href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-14 flex-col items-center justify-center gap-1 text-xs ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon size={22} strokeWidth={2} />
                  <span className="leading-none">{label}</span>
                  <span className={`absolute bottom-0 h-0.5 w-10 rounded-full ${active ? "bg-primary" : "bg-transparent"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
