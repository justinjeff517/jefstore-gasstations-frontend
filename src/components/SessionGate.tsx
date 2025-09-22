// components/SessionGate.tsx
"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

const PUBLIC_PATHS = new Set(["/login"]) // allowed without login

export default function SessionGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_PATHS.has(pathname || "/")) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`)
    }
  }, [status, pathname, router])

  // Wait until status is known
  if (status === "loading") return null

  return <>{children}</>
}
