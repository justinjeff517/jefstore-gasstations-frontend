// components/purchase-orders/PurchaseOrdersBreadcrumbs.tsx
"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type LabelOverrides = Record<string, string>

/**
 * Scalable, route-driven breadcrumbs.
 * - Works for nested routes under /purchase-orders (e.g., /purchase-orders/fuels/123/confirm)
 * - Auto-titleizes segments
 * - Lets you override labels for specific segments (ids, slugs)
 */
export function PurchaseOrdersBreadcrumbs({
  baseHref = "/purchase-orders",
  baseLabel = "Purchase Orders",
  labelOverrides,
}: {
  baseHref?: string
  baseLabel?: string
  labelOverrides?: LabelOverrides
}) {
  const pathname = usePathname()

  const items = useMemo(() => {
    // Normalize and keep only segments after /purchase-orders
    const afterBase = pathname.startsWith(baseHref)
      ? pathname.slice(baseHref.length)
      : ""
    const segments = afterBase.split("/").filter(Boolean)

    // Build cumulative hrefs
    const cumulative: { href: string; segment: string }[] = []
    let acc = baseHref
    for (const seg of segments) {
      acc += `/${seg}`
      cumulative.push({ href: acc, segment: seg })
    }
    return cumulative
  }, [pathname, baseHref])

  const format = (s: string) => {
    if (labelOverrides?.[s]) return labelOverrides[s]
    // Heuristics: ID-like segments → shorten; else Title Case words/dashes
    const isIdLike = s.length > 18 && /[0-9a-fA-F\-_.]/.test(s)
    if (isIdLike) return s.length > 24 ? `${s.slice(0, 12)}…${s.slice(-6)}` : s
    return s
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase())
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={baseHref}>{baseLabel}</BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((it, idx) => {
          const isLast = idx === items.length - 1
          return (
            <span key={it.href} className="inline-flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{format(it.segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={it.href}>
                    {format(it.segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
