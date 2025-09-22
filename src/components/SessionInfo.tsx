"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"

const CREATED_KEY = "session.created_at"

export default function SessionInfo() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated") return
    const existing = localStorage.getItem(CREATED_KEY)
    if (existing) {
      setCreatedAt(existing)
    } else {
      const now = new Date().toISOString()
      localStorage.setItem(CREATED_KEY, now)
      setCreatedAt(now)
    }
  }, [status])

  if (status !== "authenticated") return null

  const email = session?.user?.email ?? "—"
  const name =
    session?.user?.name ??
    (email && email.includes("@") ? email.split("@")[0] : "You")
  const img = session?.user?.image ?? ""

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
      }),
    []
  )

  const expiryStr = session?.expires ? fmt.format(new Date(session.expires)) : "—"
  const createdStr = createdAt ? fmt.format(new Date(createdAt)) : "—"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 rounded-xl px-2 sm:px-3 gap-2"
            aria-label={`Account menu for ${name}`}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={img} alt={name} />
              <AvatarFallback className="text-[10px]">
                {name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase() || "YO"}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[8rem] truncate text-sm hidden sm:inline">
              {name}
            </span>
            <ChevronDown className="h-4 w-4 hidden sm:inline" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-52 sm:w-56 rounded-xl">
          <DropdownMenuLabel className="truncate select-text">{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Login Session Details</DialogTitle>
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
          <div className="flex justify-end">
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
