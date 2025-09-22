"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"

export default function SessionInfo() {
  const { data: session, status } = useSession()
  if (status !== "authenticated") return null

  const email = session?.user?.email ?? "—"
  const name = session?.user?.name ?? email?.split("@")[0] ?? "You"
  const img = session?.user?.image ?? ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 rounded-xl px-2 sm:px-3 gap-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="text-[10px]">{name.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="max-w-[8rem] truncate text-sm hidden sm:inline">
            {name}
          </span>
          <ChevronDown className="h-4 w-4 hidden sm:inline" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => location.assign("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => location.assign("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
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
  )
}
