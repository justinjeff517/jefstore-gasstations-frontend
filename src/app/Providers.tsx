"use client"

import { SessionProvider } from "next-auth/react"
import SessionGate from "@/components/SessionGate"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGate>{children}</SessionGate>
    </SessionProvider>
  )
}
