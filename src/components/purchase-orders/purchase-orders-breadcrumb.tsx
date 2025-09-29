"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

function labelFrom(segment: string) {
  const s = decodeURIComponent(segment).replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PurchaseOrdersBreadcrumb() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  const items = parts.map((seg, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const isLast = i === parts.length - 1;
    const label = labelFrom(seg);
    return { href, isLast, label };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.length > 0 && <BreadcrumbSeparator />}

        {items.map((item, idx) => (
          <span key={item.href} className="inline-flex items-center">
            {!item.isLast ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {idx < items.length - 1 && <BreadcrumbSeparator />}
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
